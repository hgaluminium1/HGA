import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const navLinkSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const navMenuSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      enum: [
        "footer-products",
        "footer-company",
        "footer-support",
        "primary",
      ],
    },
    title: { type: String, required: true },
    locale: { type: String, default: "en" },
    items: { type: [navLinkSchema], default: [] },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    version: { type: Number, default: 1 },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

navMenuSchema.index(
  { key: 1, locale: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null },
  },
);

export type NavMenuDoc = InferSchemaType<typeof navMenuSchema> & {
  _id: { toString(): string };
};

export const NavMenu: Model<NavMenuDoc> =
  (models.NavMenu as Model<NavMenuDoc> | undefined) ??
  model<NavMenuDoc>("NavMenu", navMenuSchema);
