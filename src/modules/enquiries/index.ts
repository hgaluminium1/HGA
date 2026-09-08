import { z } from "zod";
import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

import { dbConnect } from "@/lib/db/connect";

const enquirySchema = new Schema(
  {
    name: { type: String, required: true },
    company: { type: String, default: "" },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    productInterest: { type: String, default: "" },
    alloy: { type: String, default: "" },
    temper: { type: String, default: "" },
    monthlyTonnage: { type: String, default: "" },
    destination: { type: String, default: "" },
    message: { type: String, required: true },
    locale: { type: String, default: "en" },
  },
  { timestamps: true },
);

type EnquiryDocument = InferSchemaType<typeof enquirySchema> & {
  _id: { toString(): string };
};

const Enquiry: Model<EnquiryDocument> =
  (models.Enquiry as Model<EnquiryDocument> | undefined) ??
  model<EnquiryDocument>("Enquiry", enquirySchema);

export const createEnquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(160).optional().default(""),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  productInterest: z.string().trim().max(200).optional().default(""),
  alloy: z.string().trim().max(80).optional().default(""),
  temper: z.string().trim().max(40).optional().default(""),
  monthlyTonnage: z.string().trim().max(40).optional().default(""),
  destination: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(1).max(4000),
  locale: z.string().trim().max(10).optional().default("en"),
});

export async function createEnquiry(input: z.infer<typeof createEnquirySchema>) {
  const data = createEnquirySchema.parse(input);
  const conn = await dbConnect();
  if (!conn) throw new Error("Database unavailable");
  const doc = await Enquiry.create(data);
  return { id: doc._id.toString() };
}
