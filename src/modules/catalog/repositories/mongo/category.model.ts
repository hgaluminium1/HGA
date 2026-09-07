import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: Map, of: String, required: true },
    slug: { type: String, required: true, trim: true },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    ancestorIds: [
      { type: Schema.Types.ObjectId, ref: "Category", index: true },
    ],
    level: { type: Number, required: true, default: 0, index: true },
    path: { type: String, default: "/", index: true },
    description: { type: Map, of: String },
    imageUrl: { type: String, default: null },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    version: { type: Number, default: 1 },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

categorySchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);
categorySchema.index(
  { parentId: 1, order: 1 },
  { partialFilterExpression: { deletedAt: null } },
);

export type CategoryDocument = InferSchemaType<typeof categorySchema> & {
  _id: { toString(): string };
};

export const Category: Model<CategoryDocument> =
  (models.Category as Model<CategoryDocument> | undefined) ??
  model<CategoryDocument>("Category", categorySchema);
