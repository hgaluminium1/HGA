import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
};

export function getR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET?.trim();
  const publicUrl = process.env.R2_PUBLIC_URL?.trim();
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
    return null;
  }
  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl };
}

export function isR2Configured(): boolean {
  return getR2Config() !== null;
}

function client(cfg: R2Config) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
  });
}

export async function r2PutObject(opts: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<{ url: string; key: string }> {
  const cfg = getR2Config();
  if (!cfg) {
    throw new Error("MEDIA_NOT_CONFIGURED");
  }
  await client(cfg).send(
    new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: opts.key,
      Body: opts.body,
      ContentType: opts.contentType,
    }),
  );
  const base = cfg.publicUrl.replace(/\/+$/, "");
  return { url: `${base}/${opts.key}`, key: opts.key };
}

export async function r2DeleteObject(key: string): Promise<void> {
  const cfg = getR2Config();
  if (!cfg) return;
  await client(cfg).send(
    new DeleteObjectCommand({ Bucket: cfg.bucket, Key: key }),
  );
}

export function r2PublicHostname(): string | null {
  const cfg = getR2Config();
  if (!cfg) return null;
  try {
    return new URL(cfg.publicUrl).hostname;
  } catch {
    return null;
  }
}
