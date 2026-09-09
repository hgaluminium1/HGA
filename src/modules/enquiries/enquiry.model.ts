import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

import {
  ENQUIRY_SOURCES,
  ENQUIRY_STATUSES,
} from "@/modules/enquiries/types";

const enquirySchema = new Schema(
  {
    name: { type: String, required: true },
    company: { type: String, default: "" },
    email: { type: String, required: true, index: true },
    phone: { type: String, default: "" },
    productInterest: { type: String, default: "" },
    productSlug: { type: String, default: null },
    alloy: { type: String, default: "" },
    temper: { type: String, default: "" },
    monthlyTonnage: { type: String, default: "" },
    destination: { type: String, default: "" },
    message: { type: String, required: true },
    locale: { type: String, default: "en" },
    source: {
      type: String,
      enum: ENQUIRY_SOURCES,
      default: "contact",
      index: true,
    },
    status: {
      type: String,
      enum: ENQUIRY_STATUSES,
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ status: 1, createdAt: -1 });

export type EnquiryDocument = InferSchemaType<typeof enquirySchema> & {
  _id: { toString(): string };
  createdAt: Date;
  updatedAt: Date;
};

export const Enquiry: Model<EnquiryDocument> =
  (models.Enquiry as Model<EnquiryDocument> | undefined) ??
  model<EnquiryDocument>("Enquiry", enquirySchema);
