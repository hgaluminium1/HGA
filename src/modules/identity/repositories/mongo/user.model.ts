import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

import type { Role } from "../../permissions";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "editor", "viewer"],
      required: true,
      default: "editor",
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: { toString(): string };
  role: Role;
};

export const User: Model<UserDocument> =
  (models.User as Model<UserDocument> | undefined) ??
  model<UserDocument>("User", userSchema);
