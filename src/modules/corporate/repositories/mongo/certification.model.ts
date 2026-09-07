import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const certificationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["iso", "quality_policy", "test_certificate_template", "other"],
      required: true,
    },
    issuer: { type: String, default: "" },
    validFrom: { type: Date, default: null },
    validTo: { type: Date, default: null },
    documentId: { type: String, default: null },
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

export type CertificationDocument = InferSchemaType<
  typeof certificationSchema
> & {
  _id: { toString(): string };
};

export const Certification: Model<CertificationDocument> =
  (models.Certification as Model<CertificationDocument> | undefined) ??
  model<CertificationDocument>("Certification", certificationSchema);
