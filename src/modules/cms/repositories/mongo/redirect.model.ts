import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const redirectSchema = new Schema(
  {
    fromPath: { type: String, required: true, unique: true, trim: true },
    toPath: { type: String, required: true, trim: true },
    statusCode: { type: Number, enum: [301, 302], default: 301 },
    active: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type RedirectDocument = InferSchemaType<typeof redirectSchema> & {
  _id: { toString(): string };
};

export const Redirect: Model<RedirectDocument> =
  (models.Redirect as Model<RedirectDocument> | undefined) ??
  model<RedirectDocument>("Redirect", redirectSchema);
