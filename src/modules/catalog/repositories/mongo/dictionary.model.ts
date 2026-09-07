import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const dictionaryItemSchema = new Schema(
  {
    value: { type: String, required: true },
    label: { type: Map, of: String, required: true },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { _id: false },
);

const dictionarySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "alloy_grade",
        "temper",
        "surface_finish",
        "anodizing_color",
        "ral_color",
        "tolerance_standard",
        "packaging",
      ],
    },
    items: { type: [dictionaryItemSchema], default: [] },
    version: { type: Number, default: 1 },
  },
  { timestamps: true },
);

export type DictionaryDocument = InferSchemaType<typeof dictionarySchema> & {
  _id: { toString(): string };
};

export const Dictionary: Model<DictionaryDocument> =
  (models.Dictionary as Model<DictionaryDocument> | undefined) ??
  model<DictionaryDocument>("Dictionary", dictionarySchema);
