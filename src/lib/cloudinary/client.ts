import { createHash } from "node:crypto";

export type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryConfigured(): boolean {
  return getCloudinaryConfig() !== null;
}

function signParams(
  params: Record<string, string | number>,
  apiSecret: string,
): string {
  const toSign = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
}

export async function cloudinaryUploadBuffer(opts: {
  buffer: Buffer;
  filename: string;
  mime: string;
  folder?: string;
}): Promise<{
  publicId: string;
  url: string;
  resourceType: "image" | "video" | "raw";
  width: number | null;
  height: number | null;
}> {
  const cfg = getCloudinaryConfig();
  if (!cfg) throw new Error("CLOUDINARY_NOT_CONFIGURED");

  const resourceType = opts.mime.startsWith("video/")
    ? "video"
    : opts.mime === "application/pdf"
      ? "raw"
      : "image";
  const folder = opts.folder ?? "hg";
  const timestamp = Math.floor(Date.now() / 1000);
  const params: Record<string, string | number> = {
    folder,
    timestamp,
    use_filename: 1,
    unique_filename: 1,
  };
  const signature = signParams(params, cfg.apiSecret);

  const form = new FormData();
  form.set(
    "file",
    new Blob([new Uint8Array(opts.buffer)], { type: opts.mime }),
    opts.filename,
  );
  form.set("api_key", cfg.apiKey);
  form.set("timestamp", String(timestamp));
  form.set("signature", signature);
  form.set("folder", folder);
  form.set("use_filename", "1");
  form.set("unique_filename", "1");

  const endpoint = `https://api.cloudinary.com/v1_1/${cfg.cloudName}/${resourceType}/upload`;
  const res = await fetch(endpoint, { method: "POST", body: form });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
  }
  const json = (await res.json()) as {
    public_id: string;
    secure_url: string;
    width?: number;
    height?: number;
  };
  return {
    publicId: json.public_id,
    url: json.secure_url,
    resourceType,
    width: json.width ?? null,
    height: json.height ?? null,
  };
}

export async function cloudinaryDestroy(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image",
): Promise<void> {
  const cfg = getCloudinaryConfig();
  if (!cfg) return;
  const timestamp = Math.floor(Date.now() / 1000);
  const params: Record<string, string | number> = {
    public_id: publicId,
    timestamp,
  };
  const signature = signParams(params, cfg.apiSecret);
  const form = new FormData();
  form.set("public_id", publicId);
  form.set("api_key", cfg.apiKey);
  form.set("timestamp", String(timestamp));
  form.set("signature", signature);
  const endpoint = `https://api.cloudinary.com/v1_1/${cfg.cloudName}/${resourceType}/destroy`;
  await fetch(endpoint, { method: "POST", body: form });
}
