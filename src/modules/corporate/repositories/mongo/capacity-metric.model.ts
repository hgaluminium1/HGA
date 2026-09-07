import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const capacityMetricSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: Map, of: String, required: true },
    value: { type: String, required: true },
    unit: { type: String, default: "" },
    category: {
      type: String,
      enum: [
        "extrusion",
        "billet",
        "ingot",
        "melting",
        "press",
        "dimension",
        "commercial",
      ],
      required: true,
    },
    sourceNote: { type: String, default: "" },
    verificationStatus: {
      type: String,
      enum: ["draft", "needs_verification", "verified"],
      default: "draft",
    },
    verifiedBy: { type: String, default: null },
    verifiedAt: { type: Date, default: null },
    publishStatus: {
      type: String,
      enum: ["hidden", "published"],
      default: "hidden",
    },
    displayOrder: { type: Number, default: 0 },
    version: { type: Number, default: 1 },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

capacityMetricSchema.index(
  { key: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);

export type CapacityMetricDocument = InferSchemaType<
  typeof capacityMetricSchema
> & {
  _id: { toString(): string };
};

export const CapacityMetric: Model<CapacityMetricDocument> =
  (models.CapacityMetric as Model<CapacityMetricDocument> | undefined) ??
  model<CapacityMetricDocument>("CapacityMetric", capacityMetricSchema);
