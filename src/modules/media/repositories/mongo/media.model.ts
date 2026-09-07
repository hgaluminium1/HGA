import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const mediaSchema = new Schema(
  {
    kind: {
      type: String,
      enum: ["image", "video", "pdf", "profile_drawing"],
      required: true,
    },
    tags: [{ type: String }],
    alt: { type: Map, of: String, default: () => new Map([["en", ""]]) },
    caption: { type: Map, of: String, default: () => new Map([["en", ""]]) },
    videoUrl: { type: String, default: null },
    location: {
      type: String,
      enum: ["hg_factory", "metal_touch", "office", "other"],
      default: "other",
    },
    url: { type: String, required: true },
    key: { type: String, required: true },
    mime: { type: String, required: true },
    size: { type: Number, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    hash: { type: String, default: null, index: true },
    version: { type: Number, default: 1 },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

mediaSchema.index(
  { hash: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null, hash: { $type: "string" } },
  },
);

export type MediaDocument = InferSchemaType<typeof mediaSchema> & {
  _id: { toString(): string };
};

export const Media: Model<MediaDocument> =
  (models.Media as Model<MediaDocument> | undefined) ??
  model<MediaDocument>("Media", mediaSchema);
