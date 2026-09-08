import { z } from "zod";

import { ConflictError } from "@/lib/http/conflict";
import { dbConnect } from "@/lib/db/connect";
import { CareerOpening } from "@/modules/careers/repositories/mongo/opening.model";
import type { CareerOpeningDTO } from "@/modules/careers/types";
import {
  createOpeningSchema,
  updateOpeningSchema,
} from "@/modules/careers/validators/career.validators";

function toDTO(doc: {
  _id: { toString(): string };
  title: string;
  slug: string;
  department: CareerOpeningDTO["department"];
  location: string;
  employmentType: CareerOpeningDTO["employmentType"];
  summary?: string | null;
  description?: string | null;
  applyEmail?: string | null;
  sortOrder?: number;
  status: "draft" | "published";
  version: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): CareerOpeningDTO {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    department: doc.department,
    location: doc.location,
    employmentType: doc.employmentType,
    summary: doc.summary ?? "",
    description: doc.description ?? "",
    applyEmail: doc.applyEmail || null,
    sortOrder: doc.sortOrder ?? 0,
    status: doc.status,
    version: doc.version,
    deletedAt: doc.deletedAt ? doc.deletedAt.toISOString() : null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function listOpenings(opts?: {
  q?: string;
  department?: string;
  status?: "draft" | "published" | "all";
  includeDeleted?: boolean;
}) {
  await dbConnect();
  const filter: Record<string, unknown> = {};
  if (!opts?.includeDeleted) filter.deletedAt = null;
  if (opts?.status && opts.status !== "all") filter.status = opts.status;
  if (opts?.department) filter.department = opts.department;
  if (opts?.q?.trim()) {
    const q = opts.q.trim();
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { summary: { $regex: q, $options: "i" } },
    ];
  }
  const docs = await CareerOpening.find(filter)
    .sort({ sortOrder: 1, updatedAt: -1 })
    .lean();
  return { items: docs.map((d) => toDTO(d as never)) };
}

export async function listPublishedOpenings(opts?: { department?: string }) {
  return listOpenings({
    status: "published",
    department: opts?.department,
  });
}

export async function getOpening(id: string) {
  await dbConnect();
  const doc = await CareerOpening.findById(id).lean();
  if (!doc || doc.deletedAt) return null;
  return toDTO(doc as never);
}

export async function getOpeningBySlug(slug: string) {
  await dbConnect();
  const doc = await CareerOpening.findOne({
    slug,
    deletedAt: null,
    status: "published",
  }).lean();
  if (!doc) return null;
  return toDTO(doc as never);
}

export async function createOpening(input: z.infer<typeof createOpeningSchema>) {
  const data = createOpeningSchema.parse(input);
  await dbConnect();
  const doc = await CareerOpening.create({
    ...data,
    applyEmail: data.applyEmail || null,
    status: data.status ?? "draft",
  });
  return toDTO(doc.toObject() as never);
}

export async function updateOpening(
  id: string,
  input: z.infer<typeof updateOpeningSchema>,
) {
  const data = updateOpeningSchema.parse(input);
  await dbConnect();
  const existing = await CareerOpening.findById(id);
  if (!existing || existing.deletedAt) {
    return { error: "NOT_FOUND" as const };
  }
  if (existing.version !== data.version) {
    throw new ConflictError("Version conflict — reload and try again");
  }
  const { version: _v, ...rest } = data;
  Object.assign(existing, {
    ...rest,
    applyEmail:
      rest.applyEmail === undefined
        ? existing.applyEmail
        : rest.applyEmail || null,
    version: existing.version + 1,
  });
  await existing.save();
  return { opening: toDTO(existing.toObject() as never) };
}

export async function publishOpening(
  id: string,
  action: "publish" | "unpublish",
  version: number,
) {
  await dbConnect();
  const existing = await CareerOpening.findById(id);
  if (!existing || existing.deletedAt) {
    return { error: "NOT_FOUND" as const };
  }
  if (existing.version !== version) {
    throw new ConflictError("Version conflict — reload and try again");
  }
  existing.status = action === "publish" ? "published" : "draft";
  existing.version += 1;
  await existing.save();
  return { opening: toDTO(existing.toObject() as never) };
}

export async function softDeleteOpening(id: string) {
  await dbConnect();
  const existing = await CareerOpening.findById(id);
  if (!existing || existing.deletedAt) {
    return { error: "NOT_FOUND" as const };
  }
  existing.deletedAt = new Date();
  existing.version += 1;
  await existing.save();
  return { opening: toDTO(existing.toObject() as never) };
}
