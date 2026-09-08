import { dbConnect } from "@/lib/db/connect";
import { assertVersionMatch } from "@/lib/http/conflict";
import { NavMenu } from "../repositories/mongo/nav-menu.model";
import type { NavMenuDTO, NavMenuKey } from "../types";
import { upsertNavMenuSchema } from "../validators/nav.validators";
import type { z } from "zod";

async function requireDb() {
  const conn = await dbConnect();
  if (!conn) throw new Error("MONGODB_URI is not configured");
}

function toDTO(doc: Record<string, unknown>): NavMenuDTO {
  return {
    id: String(doc._id),
    key: doc.key as NavMenuKey,
    title: String(doc.title),
    locale: String(doc.locale ?? "en"),
    items: (
      (doc.items as {
        label: string;
        href: string;
        description?: string;
        order?: number;
      }[]) ?? []
    )
      .map((i) => ({
        label: i.label,
        href: i.href,
        description: i.description,
        order: i.order ?? 0,
      }))
      .sort((a, b) => a.order - b.order),
    status: doc.status as "draft" | "published",
    version: Number(doc.version ?? 1),
    updatedAt:
      doc.updatedAt instanceof Date
        ? doc.updatedAt.toISOString()
        : String(doc.updatedAt ?? ""),
  };
}

export async function listNavMenus() {
  await requireDb();
  const rows = await NavMenu.find({ deletedAt: null }).sort({ key: 1 }).lean();
  return (rows as unknown as Record<string, unknown>[]).map(toDTO);
}

export async function getPublishedNavMenu(key: NavMenuKey, locale = "en") {
  await requireDb();
  const doc = await NavMenu.findOne({
    key,
    locale,
    status: "published",
    deletedAt: null,
  }).lean();
  if (!doc) return null;
  return toDTO(doc as unknown as Record<string, unknown>);
}

export async function upsertNavMenu(
  input: z.infer<typeof upsertNavMenuSchema>,
) {
  const data = upsertNavMenuSchema.parse(input);
  await requireDb();
  const existing = await NavMenu.findOne({
    key: data.key,
    locale: data.locale,
    deletedAt: null,
  });

  if (existing) {
    if (data.version != null) {
      assertVersionMatch(existing.version, data.version);
    }
    existing.title = data.title;
    existing.items = data.items as typeof existing.items;
    if (data.status) existing.status = data.status;
    existing.version = (existing.version ?? 1) + 1;
    await existing.save();
    return toDTO(existing.toObject() as unknown as Record<string, unknown>);
  }

  const created = await NavMenu.create({
    key: data.key,
    title: data.title,
    locale: data.locale,
    items: data.items,
    status: data.status ?? "draft",
    version: 1,
  });
  return toDTO(created.toObject() as unknown as Record<string, unknown>);
}
