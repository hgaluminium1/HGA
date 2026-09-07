import mongoose from "mongoose";

import { dbConnect } from "@/lib/db/connect";
import { assertVersionMatch } from "@/lib/http/conflict";
import { Category } from "../repositories/mongo/category.model";
import { Product } from "../repositories/mongo/product.model";
import type { CategoryDTO, LocalizedString } from "../types";
import {
  createCategorySchema,
  moveCategorySchema,
  reorderCategoriesSchema,
  updateCategorySchema,
} from "../validators/catalog.validators";
import type { z } from "zod";

async function requireDb() {
  const conn = await dbConnect();
  if (!conn) throw new Error("MONGODB_URI is not configured");
}

function mapToObj(map: unknown): LocalizedString {
  if (!map) return { en: "" };
  if (map instanceof Map) {
    return { en: String(map.get("en") ?? "") };
  }
  const obj = map as Record<string, string>;
  return { en: String(obj.en ?? "") };
}

function toDTO(doc: Record<string, unknown>): CategoryDTO {
  return {
    id: String(doc._id),
    name: mapToObj(doc.name),
    slug: String(doc.slug),
    parentId: doc.parentId ? String(doc.parentId) : null,
    ancestorIds: ((doc.ancestorIds as unknown[]) ?? []).map(String),
    level: Number(doc.level ?? 0),
    path: String(doc.path ?? "/"),
    description: doc.description
      ? mapToObj(doc.description)
      : undefined,
    imageUrl: (doc.imageUrl as string | null) ?? null,
    order: Number(doc.order ?? 0),
    status: doc.status as CategoryDTO["status"],
    version: Number(doc.version ?? 1),
    deletedAt: doc.deletedAt
      ? new Date(doc.deletedAt as string).toISOString()
      : null,
    createdAt: new Date(doc.createdAt as string).toISOString(),
    updatedAt: new Date(doc.updatedAt as string).toISOString(),
  };
}

function buildPath(ancestorIds: string[], selfId: string) {
  return `/${[...ancestorIds, selfId].join("/")}/`;
}

export async function listCategoriesFlat(opts?: { includeDeleted?: boolean }) {
  await requireDb();
  const filter = opts?.includeDeleted
    ? { deletedAt: { $ne: null } }
    : { deletedAt: null };
  const rows = await Category.find(filter).sort({ path: 1, order: 1 }).lean();
  return rows.map((r) => toDTO(r as Record<string, unknown>));
}

export async function listCategoriesTree() {
  const flat = await listCategoriesFlat();
  const byId = new Map<string, CategoryDTO & { children: CategoryDTO[] }>();
  for (const c of flat) {
    byId.set(c.id, { ...c, children: [] });
  }
  const roots: CategoryDTO[] = [];
  for (const c of byId.values()) {
    if (c.parentId && byId.has(c.parentId)) {
      byId.get(c.parentId)!.children.push(c);
    } else {
      roots.push(c);
    }
  }
  const sortRec = (nodes: CategoryDTO[]) => {
    nodes.sort((a, b) => a.order - b.order);
    for (const n of nodes) {
      if (n.children?.length) sortRec(n.children);
    }
  };
  sortRec(roots);
  return roots;
}

export async function getCategoryById(
  id: string,
  opts?: { includeDeleted?: boolean },
) {
  await requireDb();
  const filter: Record<string, unknown> = { _id: id };
  if (!opts?.includeDeleted) filter.deletedAt = null;
  const doc = await Category.findOne(filter).lean();
  if (!doc) return null;
  return toDTO(doc as Record<string, unknown>);
}

export async function createCategory(
  input: z.infer<typeof createCategorySchema>,
) {
  const data = createCategorySchema.parse(input);
  await requireDb();

  let parentId: mongoose.Types.ObjectId | null = null;
  let ancestorIds: mongoose.Types.ObjectId[] = [];
  let level = 0;

  if (data.parentId) {
    const parent = await Category.findOne({
      _id: data.parentId,
      deletedAt: null,
    }).lean();
    if (!parent) throw new Error("Parent category not found");
    parentId = parent._id as mongoose.Types.ObjectId;
    ancestorIds = [
      ...((parent.ancestorIds as mongoose.Types.ObjectId[]) ?? []),
      parentId,
    ];
    level = Number(parent.level ?? 0) + 1;
  }

  const siblings = await Category.countDocuments({
    parentId,
    deletedAt: null,
  });

  const doc = await Category.create({
    name: data.name,
    slug: data.slug,
    parentId,
    ancestorIds,
    level,
    path: "/",
    description: data.description,
    imageUrl: data.imageUrl ?? null,
    order: data.order ?? siblings,
    status: data.status ?? "draft",
    version: 1,
  });

  doc.path = buildPath(
    ancestorIds.map(String),
    String(doc._id),
  );
  await doc.save();
  return toDTO(doc.toObject() as Record<string, unknown>);
}

export async function updateCategory(
  id: string,
  input: z.infer<typeof updateCategorySchema>,
) {
  const data = updateCategorySchema.parse(input);
  await requireDb();
  const existing = await Category.findOne({ _id: id, deletedAt: null });
  if (!existing) return { error: "NOT_FOUND" as const };

  assertVersionMatch(existing.version, data.version);

  if (data.name !== undefined) existing.name = data.name as never;
  if (data.slug !== undefined) existing.slug = data.slug;
  if (data.description !== undefined) {
    existing.description = (data.description ?? undefined) as never;
  }
  if (data.imageUrl !== undefined) existing.imageUrl = data.imageUrl;
  if (data.order !== undefined) existing.order = data.order;
  if (data.status !== undefined) existing.status = data.status;
  existing.version = (existing.version ?? 1) + 1;
  await existing.save();
  return { category: toDTO(existing.toObject() as Record<string, unknown>) };
}

export async function reorderCategories(
  input: z.infer<typeof reorderCategoriesSchema>,
) {
  const data = reorderCategoriesSchema.parse(input);
  await requireDb();
  const parentId = data.parentId
    ? new mongoose.Types.ObjectId(data.parentId)
    : null;

  for (let i = 0; i < data.orderedIds.length; i++) {
    await Category.updateOne(
      {
        _id: data.orderedIds[i],
        parentId,
        deletedAt: null,
      },
      { $set: { order: i }, $inc: { version: 1 } },
    );
  }
  return listCategoriesTree();
}

export async function moveCategory(
  id: string,
  input: z.infer<typeof moveCategorySchema>,
) {
  const data = moveCategorySchema.parse(input);
  await requireDb();
  const node = await Category.findOne({ _id: id, deletedAt: null });
  if (!node) return { error: "NOT_FOUND" as const };
  assertVersionMatch(node.version, data.version);

  if (data.parentId === id) throw new Error("Cannot move category under itself");

  let parentId: mongoose.Types.ObjectId | null = null;
  let ancestorIds: mongoose.Types.ObjectId[] = [];
  let level = 0;

  if (data.parentId) {
    const parent = await Category.findOne({
      _id: data.parentId,
      deletedAt: null,
    }).lean();
    if (!parent) throw new Error("Parent category not found");
    const parentAncestors = ((parent.ancestorIds as unknown[]) ?? []).map(
      String,
    );
    if (parentAncestors.includes(id) || String(parent._id) === id) {
      throw new Error("Cannot move category into its descendant");
    }
    parentId = parent._id as mongoose.Types.ObjectId;
    ancestorIds = [
      ...((parent.ancestorIds as mongoose.Types.ObjectId[]) ?? []),
      parentId,
    ];
    level = Number(parent.level ?? 0) + 1;
  }

  const oldAncestors = ((node.ancestorIds as unknown[]) ?? []).map(String);
  const oldLevel = Number(node.level ?? 0);

  node.parentId = parentId as never;
  node.ancestorIds = ancestorIds as never;
  node.level = level;
  node.path = buildPath(ancestorIds.map(String), String(node._id));
  node.version = (node.version ?? 1) + 1;
  await node.save();

  const descendants = await Category.find({
    ancestorIds: new mongoose.Types.ObjectId(id),
    deletedAt: null,
  }).exec();

  for (const d of descendants) {
    const dAnc = ((d.ancestorIds as unknown[]) ?? []).map(String);
    const idx = dAnc.indexOf(id);
    const suffix = idx >= 0 ? dAnc.slice(idx) : [id, ...dAnc];
    const newAncestors = [...ancestorIds.map(String), ...suffix];
    await Category.updateOne(
      { _id: d._id },
      {
        $set: {
          ancestorIds: newAncestors.map((x) => new mongoose.Types.ObjectId(x)),
          level: level + (Number(d.level) - oldLevel),
          path: buildPath(newAncestors.slice(0, -1), String(d._id)),
        },
        $inc: { version: 1 },
      },
    );
  }

  void oldAncestors;
  return { category: toDTO(node.toObject() as Record<string, unknown>) };
}

export async function softDeleteCategory(id: string) {
  await requireDb();
  const childCount = await Category.countDocuments({
    parentId: id,
    deletedAt: null,
  });
  if (childCount > 0) {
    throw new Error("Cannot delete category with subcategories");
  }
  const productCount = await Product.countDocuments({
    categoryIds: id,
    deletedAt: null,
  });
  if (productCount > 0) {
    throw new Error("Cannot delete category that has products");
  }
  const doc = await Category.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { deletedAt: new Date(), $inc: { version: 1 } },
    { new: true },
  ).lean();
  if (!doc) return null;
  return toDTO(doc as Record<string, unknown>);
}

export async function restoreCategory(id: string) {
  await requireDb();
  const doc = await Category.findOneAndUpdate(
    { _id: id, deletedAt: { $ne: null } },
    { deletedAt: null, $inc: { version: 1 } },
    { new: true },
  ).lean();
  if (!doc) return null;
  return toDTO(doc as Record<string, unknown>);
}

export async function purgeCategory(id: string) {
  await requireDb();
  const res = await Category.deleteOne({ _id: id, deletedAt: { $ne: null } });
  return res.deletedCount === 1;
}
