import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const customerLogoSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    logoId: { type: String, default: null },
    approvedForWebsite: { type: Boolean, default: false },
    permissionNote: { type: String, default: "" },
    publishStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    sortOrder: { type: Number, default: 0 },
    version: { type: Number, default: 1 },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

export type CustomerLogoDocument = InferSchemaType<
  typeof customerLogoSchema
> & {
  _id: { toString(): string };
};

export const CustomerLogo: Model<CustomerLogoDocument> =
  (models.CustomerLogo as Model<CustomerLogoDocument> | undefined) ??
  model<CustomerLogoDocument>("CustomerLogo", customerLogoSchema);
