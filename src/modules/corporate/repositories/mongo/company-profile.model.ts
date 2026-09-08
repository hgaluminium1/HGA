import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const addressSchema = new Schema(
  {
    line1: { type: String, default: "" },
    line2: { type: String },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "India" },
  },
  { _id: false },
);

const companyProfileSchema = new Schema(
  {
    legalName: { type: String, required: true, trim: true },
    displayNames: {
      primary: { type: String, required: true, trim: true },
      alsoMention: [{ type: String }],
    },
    cin: { type: String, default: "" },
    gst: { type: String, default: "" },
    registeredOffice: { type: addressSchema, default: () => ({}) },
    factoryAddress: { type: addressSchema, default: () => ({}) },
    phones: [
      {
        label: { type: String, default: "" },
        number: { type: String, default: "" },
        _id: false,
      },
    ],
    emails: {
      sales: { type: String, default: "" },
      export: { type: String, default: "" },
      purchase: { type: String, default: "" },
      investor: { type: String, default: "" },
      hr: { type: String, default: "" },
      quality: { type: String, default: "" },
    },
    logo: {
      png: { type: String, default: null },
      svg: { type: String, default: null },
      pdf: { type: String, default: null },
    },
    brandColors: {
      primary: { type: String },
      secondary: { type: String },
      accent: { type: String },
    },
    locations: [
      {
        id: { type: String, required: true },
        label: { type: String, default: "" },
        address: { type: String, default: "" },
        mapsUrl: { type: String, default: "" },
        embedUrl: { type: String, default: "" },
        order: { type: Number, default: 0 },
        _id: false,
      },
    ],
    locale: { type: String, default: "en" },
    version: { type: Number, default: 1 },
  },
  { timestamps: true },
);

export type CompanyProfileDocument = InferSchemaType<
  typeof companyProfileSchema
> & {
  _id: { toString(): string };
};

export const CompanyProfile: Model<CompanyProfileDocument> =
  (models.CompanyProfile as Model<CompanyProfileDocument> | undefined) ??
  model<CompanyProfileDocument>("CompanyProfile", companyProfileSchema);
