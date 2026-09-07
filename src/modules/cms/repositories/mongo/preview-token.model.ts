import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const previewTokenSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    entityType: { type: String, required: true, default: "page" },
    entityId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

previewTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type PreviewTokenDocument = InferSchemaType<typeof previewTokenSchema> & {
  _id: { toString(): string };
};

export const PreviewToken: Model<PreviewTokenDocument> =
  (models.PreviewToken as Model<PreviewTokenDocument> | undefined) ??
  model<PreviewTokenDocument>("PreviewToken", previewTokenSchema);
