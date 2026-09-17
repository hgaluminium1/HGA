import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import {
  FALLBACK_BRAND_ICON,
  resolveBrandLogoSrc,
} from "@/features/public-site/lib/brand-logo";

async function loadBytes(src: string): Promise<{
  bytes: ArrayBuffer | Buffer;
  contentType: string;
} | null> {
  try {
    if (src.startsWith("/")) {
      const filePath = path.join(
        process.cwd(),
        "public",
        src.replace(/^\//, ""),
      );
      const bytes = await readFile(filePath);
      const lower = src.toLowerCase();
      const contentType = lower.endsWith(".svg")
        ? "image/svg+xml"
        : lower.endsWith(".webp")
          ? "image/webp"
          : lower.endsWith(".jpg") || lower.endsWith(".jpeg")
            ? "image/jpeg"
            : "image/png";
      return { bytes, contentType };
    }

    const res = await fetch(src, {
      next: { revalidate: 60, tags: ["corporate"] },
    });
    if (!res.ok) return null;
    const bytes = await res.arrayBuffer();
    const header = res.headers.get("content-type");
    const contentType =
      header && header.startsWith("image/")
        ? header
        : /\.svg(\?|$)/i.test(src)
          ? "image/svg+xml"
          : "image/png";
    return { bytes, contentType };
  } catch {
    return null;
  }
}

function toDataUri(bytes: ArrayBuffer | Buffer, contentType: string): string {
  const b64 = Buffer.from(
    bytes instanceof Buffer ? bytes : new Uint8Array(bytes),
  ).toString("base64");
  return `data:${contentType};base64,${b64}`;
}

/**
 * Favicon / apple-icon image using the same logo as header & footer.
 * Uses ImageResponse so Next.js metadata routes accept the result.
 */
export async function brandIconImageResponse(size: {
  width: number;
  height: number;
}): Promise<ImageResponse> {
  const src = (await resolveBrandLogoSrc()) || FALLBACK_BRAND_ICON;
  const loaded =
    (await loadBytes(src)) || (await loadBytes(FALLBACK_BRAND_ICON));

  if (!loaded) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0342ab",
            color: "white",
            fontSize: Math.round(size.width * 0.45),
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          HG
        </div>
      ),
      { ...size },
    );
  }

  const dataUri = toDataUri(loaded.bytes, loaded.contentType);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUri}
          width={size.width}
          height={size.height}
          style={{
            width: size.width,
            height: size.height,
            objectFit: "contain",
          }}
          alt=""
        />
      </div>
    ),
    { ...size },
  );
}
