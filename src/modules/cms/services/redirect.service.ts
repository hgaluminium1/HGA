import { dbConnect } from "@/lib/db/connect";
import { Redirect } from "../repositories/mongo/redirect.model";
import type { RedirectDTO } from "../types";
import { redirectSchema } from "../validators/page.validators";
import type { z } from "zod";

export type { RedirectDTO };

function toDTO(doc: Record<string, unknown>): RedirectDTO {
  return {
    id: String(doc._id),
    fromPath: String(doc.fromPath),
    toPath: String(doc.toPath),
    statusCode: doc.statusCode as 301 | 302,
    active: Boolean(doc.active),
    createdAt: new Date(doc.createdAt as string).toISOString(),
    updatedAt: new Date(doc.updatedAt as string).toISOString(),
  };
}

let cache: { at: number; items: RedirectDTO[] } | null = null;
const CACHE_TTL_MS = 60_000;

export function bustRedirectCache() {
  cache = null;
}

export async function listActiveRedirectsCached() {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.items;
  }
  await dbConnect();
  const rows = await Redirect.find({ active: true, deletedAt: null }).lean();
  const items = rows.map((r) => toDTO(r as Record<string, unknown>));
  cache = { at: Date.now(), items };
  return items;
}

export async function listRedirects() {
  await dbConnect();
  const rows = await Redirect.find({ deletedAt: null }).sort({ updatedAt: -1 }).lean();
  return rows.map((r) => toDTO(r as Record<string, unknown>));
}

export async function createRedirect(input: z.infer<typeof redirectSchema>) {
  const data = redirectSchema.parse(input);
  await dbConnect();
  const doc = await Redirect.findOneAndUpdate(
    { fromPath: data.fromPath },
    {
      fromPath: data.fromPath,
      toPath: data.toPath,
      statusCode: data.statusCode,
      active: data.active,
      deletedAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  bustRedirectCache();
  return toDTO(doc as Record<string, unknown>);
}

export async function updateRedirect(
  id: string,
  input: Partial<z.infer<typeof redirectSchema>>,
) {
  await dbConnect();
  const doc = await Redirect.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { $set: input },
    { new: true },
  ).lean();
  if (!doc) return null;
  bustRedirectCache();
  return toDTO(doc as Record<string, unknown>);
}

export async function deleteRedirect(id: string) {
  await dbConnect();
  const doc = await Redirect.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { deletedAt: new Date(), active: false },
    { new: true },
  ).lean();
  bustRedirectCache();
  return doc ? toDTO(doc as Record<string, unknown>) : null;
}
