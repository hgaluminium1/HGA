import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const expansionProjectSchema = new Schema(
  {
    title: { type: Map, of: String, required: true },
    slug: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["confirmed", "proposed", "planned"],
      default: "planned",
    },
    description: { type: Map, of: String, default: () => new Map([["en", ""]]) },
    locationNote: { type: String, default: "" },
    expectedStart: { type: String, default: "" },
    expectedCommissioning: { type: String, default: "" },
    projectCostInr: { type: Number, default: null },
    estimatedRevenueInr: { type: Number, default: null },
    publicDisclosureApproved: { type: Boolean, default: false },
    publishStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    sortOrder: { type: Number, default: 0 },
    version: { type: Number, default: 1 },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

expansionProjectSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);

export type ExpansionProjectDocument = InferSchemaType<
  typeof expansionProjectSchema
> & {
  _id: { toString(): string };
};

export const ExpansionProject: Model<ExpansionProjectDocument> =
  (models.ExpansionProject as Model<ExpansionProjectDocument> | undefined) ??
  model<ExpansionProjectDocument>("ExpansionProject", expansionProjectSchema);
