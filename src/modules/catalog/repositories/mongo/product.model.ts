import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const productSchema = new Schema(
  {
    sku: { type: String, required: true, trim: true },
    name: { type: Map, of: String, required: true },
    slug: { type: String, required: true, trim: true },
    categoryIds: [
      { type: Schema.Types.ObjectId, ref: "Category", index: true },
    ],
    alloyGrades: [{ type: String }],
    tempers: [{ type: String }],
    surfaceFinishes: [{ type: String }],
    anodizingColors: [{ type: String }],
    ralColors: [{ type: String }],
    toleranceStandards: [{ type: String }],
    packaging: [{ type: String }],
    maxLengthMm: { type: Number, default: null },
    minLengthMm: { type: Number, default: null },
    maxWidthMm: { type: Number, default: null },
    weightPerMeterKg: { type: Number, default: null },
    description: { type: String, default: null },
    imageUrl: { type: String, default: null },
    imageMediaId: { type: String, default: null },
    drawingMediaIds: [{ type: String }],
    blocks: { type: [Schema.Types.Mixed], default: [] },
    seo: {
      title: { type: String },
      description: { type: String },
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "published"],
      default: "draft",
    },
    scheduledPublishAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    publishedVersion: { type: Schema.Types.Mixed, default: null },
    isUpcoming: { type: Boolean, default: false, index: true },
    version: { type: Number, default: 1 },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

productSchema.index(
  { sku: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);
productSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: { toString(): string };
};

export const Product: Model<ProductDocument> =
  (models.Product as Model<ProductDocument> | undefined) ??
  model<ProductDocument>("Product", productSchema);
