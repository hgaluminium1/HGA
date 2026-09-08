import { trashConfig } from "@/config/trash.config";
import { dbConnect } from "@/lib/db/connect";
import { revalidatePages, revalidateProducts } from "@/lib/cms/revalidate-pages";
import {
  applyScheduledPagePublish,
  listDueScheduledPages,
} from "@/modules/cms";
import {
  applyScheduledProductPublish,
  listDueScheduledProducts,
} from "@/modules/catalog";
import type { Model } from "mongoose";

import { PreviewToken } from "../../cms/repositories/mongo/preview-token.model";
import { Page } from "../../cms/repositories/mongo/page.model";
import { Product } from "../../catalog/repositories/mongo/product.model";
import { Category } from "../../catalog/repositories/mongo/category.model";
import { Media } from "../../media/repositories/mongo/media.model";
import { Person } from "../../corporate/repositories/mongo/person.model";
import { CapacityMetric } from "../../corporate/repositories/mongo/capacity-metric.model";
import { Certification } from "../../corporate/repositories/mongo/certification.model";
import { SustainabilityMetric } from "../../corporate/repositories/mongo/sustainability-metric.model";
import { CustomerLogo } from "../../corporate/repositories/mongo/customer-logo.model";
import { CaseStudy } from "../../corporate/repositories/mongo/case-study.model";
import { Testimonial } from "../../corporate/repositories/mongo/testimonial.model";
import { ExpansionProject } from "../../corporate/repositories/mongo/expansion-project.model";

async function requireDb() {
  const conn = await dbConnect();
  if (!conn) throw new Error("MONGODB_URI is not configured");
}

export async function runScheduledPublish(dryRun: boolean) {
  await requireDb();
  const now = new Date();
  const pages = await listDueScheduledPages(now);
  const products = await listDueScheduledProducts(now);
  const stats = {
    pagesDue: pages.length,
    productsDue: products.length,
    pagesPublished: 0,
    productsPublished: 0,
  };

  if (dryRun) {
    return stats;
  }

  for (const p of pages) {
    await applyScheduledPagePublish(p.id);
    stats.pagesPublished += 1;
  }
  for (const p of products) {
    await applyScheduledProductPublish(p.id);
    stats.productsPublished += 1;
  }
  if (stats.pagesPublished) {
    try {
      revalidatePages();
    } catch {
      // Outside Next request context (CLI / seed) — skip tag revalidation
    }
  }
  if (stats.productsPublished) {
    try {
      revalidateProducts();
    } catch {
      // Outside Next request context (CLI / seed) — skip tag revalidation
    }
  }
  return stats;
}

async function purgeSoftDeleted(
  model: Model<unknown>,
  cutoff: Date,
  dryRun: boolean,
): Promise<number> {
  const filter = { deletedAt: { $ne: null, $lte: cutoff } };
  if (dryRun) {
    return model.countDocuments(filter);
  }
  const res = await model.deleteMany(filter);
  return res.deletedCount ?? 0;
}

export async function runTrashPurge(dryRun: boolean) {
  await requireDb();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - trashConfig.retentionDays);

  const collections: [string, Model<unknown>][] = [
    ["pages", Page as unknown as Model<unknown>],
    ["products", Product as unknown as Model<unknown>],
    ["categories", Category as unknown as Model<unknown>],
    ["media", Media as unknown as Model<unknown>],
    ["people", Person as unknown as Model<unknown>],
    ["capacity", CapacityMetric as unknown as Model<unknown>],
    ["certifications", Certification as unknown as Model<unknown>],
    ["sustainability", SustainabilityMetric as unknown as Model<unknown>],
    ["customerLogos", CustomerLogo as unknown as Model<unknown>],
    ["caseStudies", CaseStudy as unknown as Model<unknown>],
    ["testimonials", Testimonial as unknown as Model<unknown>],
    ["expansion", ExpansionProject as unknown as Model<unknown>],
  ];

  const stats: Record<string, number> = {
    retentionDays: trashConfig.retentionDays,
  };
  let total = 0;
  for (const [key, model] of collections) {
    const n = await purgeSoftDeleted(model, cutoff, dryRun);
    stats[key] = n;
    total += n;
  }
  stats.purged = total;
  return stats;
}

export async function runPreviewExpire(dryRun: boolean) {
  await requireDb();
  const now = new Date();
  const filter = { expiresAt: { $lte: now } };
  if (dryRun) {
    const count = await PreviewToken.countDocuments(filter);
    return { expired: count };
  }
  const res = await PreviewToken.deleteMany(filter);
  return { expired: res.deletedCount ?? 0 };
}
