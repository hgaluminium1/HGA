import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const testimonialSchema = new Schema(
  {
    quote: { type: Map, of: String, required: true },
    authorName: { type: String, required: true, trim: true },
    authorTitle: { type: String, default: "" },
    company: { type: String, default: "" },
    approvedForWebsite: { type: Boolean, default: false },
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

export type TestimonialDocument = InferSchemaType<typeof testimonialSchema> & {
  _id: { toString(): string };
};

export const Testimonial: Model<TestimonialDocument> =
  (models.Testimonial as Model<TestimonialDocument> | undefined) ??
  model<TestimonialDocument>("Testimonial", testimonialSchema);
