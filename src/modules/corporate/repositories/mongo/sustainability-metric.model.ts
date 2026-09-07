import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const sustainabilityMetricSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: Map, of: String, required: true },
    value: { type: String, default: null },
    unit: { type: String, default: "" },
    disclosureTier: {
      type: String,
      enum: ["verified_metric", "initiative", "commitment"],
      required: true,
    },
    evidenceMediaIds: [{ type: String }],
    methodologyNote: { type: String, default: "" },
    verificationStatus: {
      type: String,
      enum: ["draft", "verified"],
      default: "draft",
    },
    publishStatus: {
      type: String,
      enum: ["hidden", "published"],
      default: "hidden",
    },
    version: { type: Number, default: 1 },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

sustainabilityMetricSchema.index(
  { key: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);

export type SustainabilityMetricDocument = InferSchemaType<
  typeof sustainabilityMetricSchema
> & {
  _id: { toString(): string };
};

export const SustainabilityMetric: Model<SustainabilityMetricDocument> =
  (models.SustainabilityMetric as
    | Model<SustainabilityMetricDocument>
    | undefined) ??
  model<SustainabilityMetricDocument>(
    "SustainabilityMetric",
    sustainabilityMetricSchema,
  );
