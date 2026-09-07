import { createHash } from "node:crypto";
import { randomUUID } from "node:crypto";

import { assertVersionMatch, isConflictError } from "@/lib/http/conflict";
import { dbConnect } from "@/lib/db/connect";
import { isR2Configured, r2DeleteObject, r2PutObject } from "@/lib/r2/client";
import {
  MEDIA_ALLOWED_MIME,
  MEDIA_MAX_BYTES,
} from "@/config/media-tags.config";
import type { MediaDTO, MediaKind } from "../types";
import { updateMediaSchema } from "../validators/media.validators";
import { Media } from "../repositories/mongo/media.model";
import type { z } from "zod";

async function requireDb() {
  const conn = await dbConnect();
  if (!conn) throw new Error("MONGODB_URI is not configured");
}

function mapToObj(map: unknown): { en: string } {
  if (!map) return { en: "" };
  if (map instanceof Map) {
    return { en: String(map.get("en") ?? "") };
  }
  const obj = map as Record<string, string>;
  return { en: String(obj.en ?? "") };
}

function toDTO(doc: Record<string, unknown>): MediaDTO {
  return {
    id: String(doc._id),
    kind: doc.kind as MediaDTO["kind"],
    tags: ((doc.tags as string[]) ?? []).map(String),
    alt: mapToObj(doc.alt),
    caption: mapToObj(doc.caption),
    videoUrl: (doc.videoUrl as string | null) ?? null,
    location: (doc.location as MediaDTO["location"]) ?? "other",
    url: String(doc.url),
    key: String(doc.key),
    mime: String(doc.mime),
    size: Number(doc.size ?? 0),
    width: doc.width == null ? null : Number(doc.width),
    height: doc.height == null ? null : Number(doc.height),
    hash: (doc.hash as string | null) ?? null,
    version: Number(doc.version ?? 1),
    deletedAt: doc.deletedAt
      ? new Date(doc.deletedAt as Date).toISOString()
      : null,
    createdAt: new Date(doc.createdAt as Date).toISOString(),
    updatedAt: new Date(doc.updatedAt as Date).toISOString(),
  };
}

function kindFromMime(mime: string, forced?: MediaKind): MediaKind {
  if (forced) return forced;
  if (mime === "application/pdf") return "pdf";
  if (mime.startsWith("video/")) return "video";
  return "image";
}

export async function listMedia(opts: {
  q?: string;
  kind?: string;
  tag?: string;
  cursor?: string;
  limit?: number;
  includeDeleted?: boolean;
} = {}) {
  await requireDb();
  const limit = Math.min(opts.limit ?? 40, 100);
  const filter: Record<string, unknown> = opts.includeDeleted
    ? { deletedAt: { $ne: null } }
    : { deletedAt: null };
  if (opts.kind) filter.kind = opts.kind;
  if (opts.tag) filter.tags = opts.tag;
  if (opts.q) {
    filter.$or = [
      { key: { $regex: opts.q, $options: "i" } },
      { "alt.en": { $regex: opts.q, $options: "i" } },
      { tags: { $regex: opts.q, $options: "i" } },
    ];
  }
  if (opts.cursor) filter._id = { $lt: opts.cursor };
  const rows = await Media.find(filter)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();
  const hasMore = rows.length > limit;
  const items = rows
    .slice(0, limit)
    .map((r) => toDTO(r as Record<string, unknown>));
  return {
    items,
    nextCursor: hasMore ? items[items.length - 1]?.id ?? null : null,
  };
}

export async function getMediaById(
  id: string,
  opts?: { includeDeleted?: boolean },
) {
  await requireDb();
  const filter: Record<string, unknown> = { _id: id };
  if (!opts?.includeDeleted) filter.deletedAt = null;
  const doc = await Media.findOne(filter).lean();
  if (!doc) return null;
  return toDTO(doc as Record<string, unknown>);
}

export async function createMediaFromUpload(input: {
  buffer: Buffer;
  filename: string;
  mime: string;
  kind?: MediaKind;
  tags?: string[];
  alt?: string;
}): Promise<
  | { media: MediaDTO; reused: boolean }
  | { error: "MEDIA_NOT_CONFIGURED" | "VALIDATION_ERROR"; message: string }
> {
  if (!isR2Configured()) {
    return {
      error: "MEDIA_NOT_CONFIGURED",
      message: "R2 is not configured. Set R2_* env vars.",
    };
  }
  if (!MEDIA_ALLOWED_MIME.includes(input.mime as (typeof MEDIA_ALLOWED_MIME)[number])) {
    return {
      error: "VALIDATION_ERROR",
      message: `MIME type not allowed: ${input.mime}`,
    };
  }
  if (input.buffer.byteLength > MEDIA_MAX_BYTES) {
    return {
      error: "VALIDATION_ERROR",
      message: `File exceeds ${MEDIA_MAX_BYTES} bytes`,
    };
  }

  await requireDb();
  const hash = createHash("sha256").update(input.buffer).digest("hex");
  const existing = await Media.findOne({ hash, deletedAt: null }).lean();
  if (existing) {
    return {
      media: toDTO(existing as Record<string, unknown>),
      reused: true,
    };
  }

  const ext =
    input.filename.includes(".")
      ? input.filename.split(".").pop()?.toLowerCase()
      : "bin";
  const key = `uploads/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${ext}`;
  const { url } = await r2PutObject({
    key,
    body: input.buffer,
    contentType: input.mime,
  });

  const kind = kindFromMime(input.mime, input.kind);
  const doc = await Media.create({
    kind,
    tags: input.tags ?? [],
    alt: { en: input.alt ?? "" },
    caption: { en: "" },
    url,
    key,
    mime: input.mime,
    size: input.buffer.byteLength,
    hash,
    version: 1,
  });
  return {
    media: toDTO(doc.toObject() as Record<string, unknown>),
    reused: false,
  };
}

export async function updateMedia(
  id: string,
  input: z.infer<typeof updateMediaSchema>,
) {
  try {
    const data = updateMediaSchema.parse(input);
    await requireDb();
    const existing = await Media.findOne({ _id: id, deletedAt: null });
    if (!existing) return { error: "NOT_FOUND" as const };
    assertVersionMatch(existing.version, data.version);
    const { version: _v, ...fields } = data;
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        (existing as unknown as Record<string, unknown>)[key] = value;
      }
    }
    existing.version = (existing.version ?? 1) + 1;
    await existing.save();
    return { media: toDTO(existing.toObject() as Record<string, unknown>) };
  } catch (err) {
    if (isConflictError(err)) return { error: "CONFLICT" as const, message: err.message };
    throw err;
  }
}

export async function softDeleteMedia(id: string) {
  await requireDb();
  const doc = await Media.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true },
  ).lean();
  if (!doc) return null;
  return toDTO(doc as Record<string, unknown>);
}

export async function restoreMedia(id: string) {
  await requireDb();
  const doc = await Media.findOneAndUpdate(
    { _id: id, deletedAt: { $ne: null } },
    { deletedAt: null },
    { new: true },
  ).lean();
  if (!doc) return null;
  return toDTO(doc as Record<string, unknown>);
}

export async function purgeMedia(id: string) {
  await requireDb();
  const doc = await Media.findOne({ _id: id, deletedAt: { $ne: null } });
  if (!doc) return null;
  await r2DeleteObject(doc.key);
  await Media.deleteOne({ _id: id });
  return { id };
}
