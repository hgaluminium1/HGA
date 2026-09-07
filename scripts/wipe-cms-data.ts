/**
 * Wipe all CMS / catalog / corporate / jobs content (keeps AdminUser).
 * Usage: npx tsx scripts/wipe-cms-data.ts
 */
import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import { dbConnect } from "@/lib/db/connect";
import { Page } from "@/modules/cms/repositories/mongo/page.model";
import { Redirect } from "@/modules/cms/repositories/mongo/redirect.model";
import { PreviewToken } from "@/modules/cms/repositories/mongo/preview-token.model";
import { Product } from "@/modules/catalog/repositories/mongo/product.model";
import { Category } from "@/modules/catalog/repositories/mongo/category.model";
import { Dictionary } from "@/modules/catalog/repositories/mongo/dictionary.model";
import { Media } from "@/modules/media/repositories/mongo/media.model";
import { CompanyProfile } from "@/modules/corporate/repositories/mongo/company-profile.model";
import { Person } from "@/modules/corporate/repositories/mongo/person.model";
import { CapacityMetric } from "@/modules/corporate/repositories/mongo/capacity-metric.model";
import { Certification } from "@/modules/corporate/repositories/mongo/certification.model";
import { SustainabilityMetric } from "@/modules/corporate/repositories/mongo/sustainability-metric.model";
import { CustomerLogo } from "@/modules/corporate/repositories/mongo/customer-logo.model";
import { CaseStudy } from "@/modules/corporate/repositories/mongo/case-study.model";
import { Testimonial } from "@/modules/corporate/repositories/mongo/testimonial.model";
import { ExpansionProject } from "@/modules/corporate/repositories/mongo/expansion-project.model";
import { JobRun } from "@/modules/jobs/repositories/mongo/job-run.model";

async function main() {
  const conn = await dbConnect();
  if (!conn) throw new Error("MONGODB_URI is not configured");

  const targets: Array<[string, { deleteMany: (f: object) => Promise<{ deletedCount?: number }> }]> = [
    ["pages", Page],
    ["redirects", Redirect],
    ["previewTokens", PreviewToken],
    ["products", Product],
    ["categories", Category],
    ["dictionaries", Dictionary],
    ["media", Media],
    ["company", CompanyProfile],
    ["people", Person],
    ["capacity", CapacityMetric],
    ["certifications", Certification],
    ["sustainability", SustainabilityMetric],
    ["customerLogos", CustomerLogo],
    ["caseStudies", CaseStudy],
    ["testimonials", Testimonial],
    ["expansion", ExpansionProject],
    ["jobRuns", JobRun],
  ];

  const counts: Record<string, number> = {};
  for (const [key, model] of targets) {
    const res = await model.deleteMany({});
    counts[key] = res.deletedCount ?? 0;
  }

  // Soft collection wipe for enquiries (model registered on first API use)
  const enquiries = await conn.connection.db
    ?.collection("enquiries")
    .deleteMany({});
  counts.enquiries = enquiries?.deletedCount ?? 0;

  console.log(JSON.stringify({ ok: true, wiped: counts }, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect().catch(() => undefined);
    process.exit(0);
  });
