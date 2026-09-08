import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const openingSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    department: {
      type: String,
      enum: [
        "operations",
        "quality",
        "maintenance",
        "commercial",
        "engineering",
        "hr",
        "other",
      ],
      required: true,
    },
    location: { type: String, required: true, trim: true },
    employmentType: {
      type: String,
      enum: ["full_time", "contract", "internship"],
      default: "full_time",
    },
    summary: { type: String, default: "" },
    description: { type: String, default: "" },
    applyEmail: { type: String, default: null },
    sortOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    version: { type: Number, default: 1 },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

openingSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);
openingSchema.index({ status: 1, sortOrder: 1 });

export type OpeningDocument = InferSchemaType<typeof openingSchema> & {
  _id: { toString(): string };
};

export const CareerOpening: Model<OpeningDocument> =
  (models.CareerOpening as Model<OpeningDocument> | undefined) ??
  model<OpeningDocument>("CareerOpening", openingSchema);
