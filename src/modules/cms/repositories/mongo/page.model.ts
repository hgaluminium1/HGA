import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const blockSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    appearance: {
      type: String,
      enum: ["default", "inverted", "tinted", "compact"],
      default: "default",
    },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const pageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    locale: { type: String, required: true, default: "en", trim: true },
    status: {
      type: String,
      enum: ["draft", "scheduled", "published"],
      default: "draft",
      required: true,
    },
    scheduledPublishAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    publishedVersion: { type: Schema.Types.Mixed, default: null },
    blocks: { type: [blockSchema], default: [] },
    seo: {
      title: { type: String },
      description: { type: String },
    },
    version: { type: Number, default: 1 },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

pageSchema.index(
  { slug: 1, locale: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null },
  },
);

export type PageDocument = InferSchemaType<typeof pageSchema> & {
  _id: { toString(): string };
};

export const Page: Model<PageDocument> =
  (models.Page as Model<PageDocument> | undefined) ??
  model<PageDocument>("Page", pageSchema);
