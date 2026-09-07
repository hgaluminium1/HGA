import bcrypt from "bcryptjs";

import { dbConnect } from "@/lib/db/connect";
import { User } from "../repositories/mongo/user.model";
import type { Role } from "../permissions";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export async function findUserByEmail(email: string) {
  await dbConnect();
  return User.findOne({ email: email.toLowerCase(), deletedAt: null }).lean();
}

export async function verifyUserCredentials(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const user = await findUserByEmail(email);
  if (!user?.passwordHash) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role as Role,
  };
}

export async function ensureSeedSuperadmin() {
  await dbConnect();
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return { created: false, reason: "missing_env" as const };

  const existing = await User.findOne({ email }).lean();
  if (existing) return { created: false, reason: "exists" as const };

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({
    email,
    name: process.env.ADMIN_NAME?.trim() || "HG Admin",
    passwordHash,
    role: "superadmin",
  });
  return { created: true, reason: "created" as const };
}
