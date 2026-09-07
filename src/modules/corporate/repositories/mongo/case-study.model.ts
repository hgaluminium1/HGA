import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const caseStudySchema = new Schema(
  {
    title: { type: Map, of: String, required: true },
    slug: { type: String, required: true, trim: true },
    industry: { type: String, default: "" },
    region: { type: String, default: "" },
    summary: { type: Map, of: String, default: () => new Map([["en", ""]]) },
    imageIds: [{ type: String }],
    productIds: [{ type: String }],
    approvedForWebsite: { type: Boolean, default: false },
    publishStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    version: { type: Number, default: 1 },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

caseStudySchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);

export type CaseStudyDocument = InferSchemaType<typeof caseStudySchema> & {
  _id: { toString(): string };
};

export const CaseStudy: Model<CaseStudyDocument> =
  (models.CaseStudy as Model<CaseStudyDocument> | undefined) ??
  model<CaseStudyDocument>("CaseStudy", caseStudySchema);
