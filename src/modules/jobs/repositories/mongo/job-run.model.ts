import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const jobRunSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    startedAt: { type: Date, required: true },
    finishedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["running", "ok", "error"],
      default: "running",
    },
    dryRun: { type: Boolean, default: true },
    stats: { type: Schema.Types.Mixed, default: {} },
    error: { type: String, default: null },
  },
  { timestamps: false },
);

export type JobRunDocument = InferSchemaType<typeof jobRunSchema> & {
  _id: { toString(): string };
};

export const JobRun: Model<JobRunDocument> =
  (models.JobRun as Model<JobRunDocument> | undefined) ??
  model<JobRunDocument>("JobRun", jobRunSchema);
