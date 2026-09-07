import { createHash, randomBytes } from "node:crypto";

import { dbConnect } from "@/lib/db/connect";
import { PreviewToken } from "../repositories/mongo/preview-token.model";
import { getPageById } from "./page.service";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createPreviewToken(entityId: string, entityType = "page") {
  await dbConnect();
  const page = await getPageById(entityId, { includeDeleted: false });
  if (!page) return { error: "NOT_FOUND" as const };

  const raw = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await PreviewToken.create({
    tokenHash,
    entityType,
    entityId,
    expiresAt,
  });

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  const url = `${site}/en/preview/${raw}`;
  return {
    token: raw,
    url,
    expiresAt: expiresAt.toISOString(),
  };
}

export async function resolvePreviewToken(rawToken: string) {
  await dbConnect();
  const tokenHash = hashToken(rawToken);
  const row = await PreviewToken.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  }).lean();
  if (!row) return null;
  if (row.entityType !== "page") return null;
  const page = await getPageById(row.entityId, { includeDeleted: false });
  return page;
}

export async function revokePreviewToken(rawToken: string) {
  await dbConnect();
  const tokenHash = hashToken(rawToken);
  const row = await PreviewToken.findOneAndUpdate(
    { tokenHash, revokedAt: null },
    { revokedAt: new Date() },
    { new: true },
  ).lean();
  return Boolean(row);
}
