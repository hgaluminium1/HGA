import { z } from "zod";

import { dbConnect } from "@/lib/db/connect";
import { Enquiry } from "@/modules/enquiries/enquiry.model";
import type { EnquiryDTO, EnquiryStatus } from "@/modules/enquiries/types";
import {
  createEnquirySchema,
  updateEnquirySchema,
} from "@/modules/enquiries/validators";

function toDTO(doc: Record<string, unknown>): EnquiryDTO {
  return {
    id: String(doc._id),
    name: String(doc.name ?? ""),
    company: String(doc.company ?? ""),
    email: String(doc.email ?? ""),
    phone: String(doc.phone ?? ""),
    productInterest: String(doc.productInterest ?? ""),
    productSlug: (doc.productSlug as string | null) ?? null,
    alloy: String(doc.alloy ?? ""),
    temper: String(doc.temper ?? ""),
    monthlyTonnage: String(doc.monthlyTonnage ?? ""),
    destination: String(doc.destination ?? ""),
    message: String(doc.message ?? ""),
    locale: String(doc.locale ?? "en"),
    source: (doc.source as EnquiryDTO["source"]) ?? "contact",
    status: (doc.status as EnquiryStatus) ?? "new",
    createdAt: new Date(doc.createdAt as Date).toISOString(),
    updatedAt: new Date(doc.updatedAt as Date).toISOString(),
  };
}

export async function createEnquiry(
  input: z.infer<typeof createEnquirySchema>,
): Promise<EnquiryDTO> {
  const data = createEnquirySchema.parse(input);
  const { website: _honeypot, ...fields } = data;
  void _honeypot;
  const conn = await dbConnect();
  if (!conn) throw new Error("Database unavailable");
  const doc = await Enquiry.create({ ...fields, status: "new" });
  return toDTO(doc.toObject() as Record<string, unknown>);
}

export async function listEnquiries(opts: {
  q?: string;
  status?: EnquiryStatus | "all";
  limit?: number;
} = {}): Promise<{ items: EnquiryDTO[] }> {
  await dbConnect();
  const filter: Record<string, unknown> = {};
  if (opts.status && opts.status !== "all") {
    filter.status = opts.status;
  }
  if (opts.q?.trim()) {
    const q = opts.q.trim();
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { company: { $regex: q, $options: "i" } },
      { productInterest: { $regex: q, $options: "i" } },
    ];
  }
  const rows = await Enquiry.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(opts.limit ?? 100, 200))
    .lean();
  return {
    items: rows.map((r) => toDTO(r as Record<string, unknown>)),
  };
}

export async function getEnquiryById(id: string): Promise<EnquiryDTO | null> {
  await dbConnect();
  const doc = await Enquiry.findById(id).lean();
  if (!doc) return null;
  return toDTO(doc as Record<string, unknown>);
}

export async function updateEnquiryStatus(
  id: string,
  input: z.infer<typeof updateEnquirySchema>,
): Promise<EnquiryDTO | { error: "NOT_FOUND" }> {
  const data = updateEnquirySchema.parse(input);
  await dbConnect();
  const doc = await Enquiry.findByIdAndUpdate(
    id,
    { status: data.status },
    { new: true },
  ).lean();
  if (!doc) return { error: "NOT_FOUND" };
  return toDTO(doc as Record<string, unknown>);
}

export async function countNewEnquiries(): Promise<number> {
  await dbConnect();
  return Enquiry.countDocuments({ status: "new" });
}
