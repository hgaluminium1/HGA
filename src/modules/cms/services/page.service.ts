import { dbConnect } from "@/lib/db/connect";
import { assertVersionMatch } from "@/lib/http/conflict";
import { Page } from "../repositories/mongo/page.model";
import { createRedirect } from "./redirect.service";
import type { PageDTO } from "../types";
import {
  createPageSchema,
  updatePageSchema,
} from "../validators/page.validators";
import type { z } from "zod";

async function requireDb() {
  const conn = await dbConnect();
  if (!conn) throw new Error("MONGODB_URI is not configured");
}

export type { PageDTO };

function toDTO(doc: Record<string, unknown>): PageDTO {
  const id = String(doc._id);
  return {
    id,
    title: String(doc.title),
    slug: String(doc.slug),
    locale: String(doc.locale ?? "en"),
    status: doc.status as PageDTO["status"],
    scheduledPublishAt: doc.scheduledPublishAt
      ? new Date(doc.scheduledPublishAt as string).toISOString()
      : null,
    publishedAt: doc.publishedAt
      ? new Date(doc.publishedAt as string).toISOString()
      : null,
    publishedVersion: (doc.publishedVersion as unknown) ?? null,
    blocks: ((doc.blocks as PageDTO["blocks"]) ?? []).map((b) => ({
      id: b.id,
      type: b.type,
      order: b.order,
      appearance: b.appearance ?? "default",
      data: b.data,
    })),
    seo: (doc.seo as PageDTO["seo"]) ?? {},
    version: Number(doc.version ?? 1),
    deletedAt: doc.deletedAt
      ? new Date(doc.deletedAt as string).toISOString()
      : null,
    createdAt: new Date(doc.createdAt as string).toISOString(),
    updatedAt: new Date(doc.updatedAt as string).toISOString(),
  };
}

export async function listPages(opts: {
  q?: string;
  cursor?: string;
  limit?: number;
  includeDeleted?: boolean;
}) {
  await requireDb();
  const limit = Math.min(opts.limit ?? 20, 100);
  const filter: Record<string, unknown> = opts.includeDeleted
    ? { deletedAt: { $ne: null } }
    : { deletedAt: null };
  if (opts.q) {
    filter.$or = [
      { title: { $regex: opts.q, $options: "i" } },
      { slug: { $regex: opts.q, $options: "i" } },
    ];
  }
  if (opts.cursor) {
    filter._id = { $lt: opts.cursor };
  }
  const rows = await Page.find(filter)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();
  const hasMore = rows.length > limit;
  const items = rows.slice(0, limit).map((r) => toDTO(r as Record<string, unknown>));
  const nextCursor = hasMore ? items[items.length - 1]?.id : null;
  return { items, nextCursor };
}

export async function getPageById(id: string, opts?: { includeDeleted?: boolean }) {
  await requireDb();
  const filter: Record<string, unknown> = { _id: id };
  if (!opts?.includeDeleted) filter.deletedAt = null;
  const doc = await Page.findOne(filter).lean();
  if (!doc) return null;
  return toDTO(doc as Record<string, unknown>);
}

export async function getPageBySlug(slug: string, locale = "en") {
  await requireDb();
  const doc = await Page.findOne({ slug, locale, deletedAt: null }).lean();
  if (!doc) return null;
  return toDTO(doc as Record<string, unknown>);
}

export async function getPublishedPageBySlug(slug: string, locale = "en") {
  await requireDb();
  const doc = await Page.findOne({
    slug,
    locale,
    status: "published",
    deletedAt: null,
  }).lean();
  if (!doc) return null;
  return toDTO(doc as Record<string, unknown>);
}

export async function createPage(input: z.infer<typeof createPageSchema>) {
  const data = createPageSchema.parse(input);
  await requireDb();
  const doc = await Page.create({
    title: data.title,
    slug: data.slug,
    locale: data.locale ?? "en",
    blocks: data.blocks,
    seo: data.seo ?? {},
    status: "draft",
    version: 1,
  });
  return toDTO(doc.toObject() as Record<string, unknown>);
}

export async function updatePage(
  id: string,
  input: z.infer<typeof updatePageSchema>,
) {
  const data = updatePageSchema.parse(input);
  await requireDb();
  const existing = await Page.findOne({ _id: id, deletedAt: null });
  if (!existing) return { error: "NOT_FOUND" as const };

  assertVersionMatch(existing.version, data.version);

  const oldSlug = existing.slug;
  if (data.title !== undefined) existing.title = data.title;
  if (data.slug !== undefined) existing.slug = data.slug;
  if (data.locale !== undefined) existing.locale = data.locale;
  if (data.blocks !== undefined) existing.blocks = data.blocks as typeof existing.blocks;
  if (data.seo !== undefined) existing.seo = data.seo;
  if (data.scheduledPublishAt !== undefined) {
    existing.scheduledPublishAt = data.scheduledPublishAt
      ? new Date(data.scheduledPublishAt)
      : null;
  }
  if (data.status !== undefined) {
    existing.status = data.status;
    if (data.status === "published") {
      existing.publishedAt = new Date();
      existing.publishedVersion = {
        title: existing.title,
        slug: existing.slug,
        locale: existing.locale,
        blocks: existing.blocks,
        seo: existing.seo,
        publishedAt: existing.publishedAt.toISOString(),
      };
      existing.scheduledPublishAt = null;
    }
    if (data.status === "scheduled" && !existing.scheduledPublishAt) {
      // require scheduledPublishAt separately
    }
    if (data.status === "draft") {
      existing.scheduledPublishAt = null;
    }
  }

  existing.version = (existing.version ?? 1) + 1;
  await existing.save();

  if (
    data.slug !== undefined &&
    data.slug !== oldSlug &&
    data.createRedirectOnSlugChange !== false
  ) {
    const from = oldSlug === "" || oldSlug === "home" ? "/en" : `/en/${oldSlug}`;
    const to = data.slug === "" || data.slug === "home" ? "/en" : `/en/${data.slug}`;
    await createRedirect({
      fromPath: from,
      toPath: to,
      statusCode: 301,
      active: true,
    }).catch(() => undefined);
  }

  return { page: toDTO(existing.toObject() as Record<string, unknown>) };
}

export async function publishPage(id: string, version: number) {
  return updatePage(id, { status: "published", version });
}

export async function schedulePage(
  id: string,
  version: number,
  scheduledPublishAt: string,
) {
  return updatePage(id, {
    status: "scheduled",
    scheduledPublishAt,
    version,
  });
}

export async function unpublishPage(id: string, version: number) {
  return updatePage(id, { status: "draft", scheduledPublishAt: null, version });
}

export async function listDueScheduledPages(now = new Date()) {
  await requireDb();
  const rows = await Page.find({
    deletedAt: null,
    status: "scheduled",
    scheduledPublishAt: { $lte: now },
  }).lean();
  return rows.map((r) => toDTO(r as Record<string, unknown>));
}

export async function applyScheduledPagePublish(id: string) {
  await requireDb();
  const existing = await Page.findOne({ _id: id, deletedAt: null });
  if (!existing) return null;
  existing.status = "published";
  existing.publishedAt = new Date();
  existing.publishedVersion = {
    title: existing.title,
    slug: existing.slug,
    locale: existing.locale,
    blocks: existing.blocks,
    seo: existing.seo,
    publishedAt: existing.publishedAt.toISOString(),
  };
  existing.scheduledPublishAt = null;
  existing.version = (existing.version ?? 1) + 1;
  await existing.save();
  return toDTO(existing.toObject() as Record<string, unknown>);
}

export async function softDeletePage(id: string) {
  await requireDb();
  const doc = await Page.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { deletedAt: new Date(), $inc: { version: 1 } },
    { new: true },
  ).lean();
  if (!doc) return null;
  return toDTO(doc as Record<string, unknown>);
}

export async function restorePage(id: string) {
  await requireDb();
  const doc = await Page.findOneAndUpdate(
    { _id: id, deletedAt: { $ne: null } },
    { deletedAt: null, $inc: { version: 1 } },
    { new: true },
  ).lean();
  if (!doc) return null;
  return toDTO(doc as Record<string, unknown>);
}

export async function purgePage(id: string) {
  await requireDb();
  const res = await Page.deleteOne({ _id: id, deletedAt: { $ne: null } });
  return res.deletedCount === 1;
}
