import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  FALLBACK_BRAND_ICON,
  resolveBrandLogoSrc,
} from "@/features/public-site/lib/brand-logo";

function guessContentType(url: string, header: string | null): string {
  if (header && header.startsWith("image/")) return header;
  const lower = url.toLowerCase();
  if (lower.includes(".svg") || lower.endsWith("svg")) return "image/svg+xml";
  if (lower.includes(".webp")) return "image/webp";
  if (lower.includes(".jpg") || lower.includes(".jpeg")) return "image/jpeg";
  if (lower.includes(".gif")) return "image/gif";
  return "image/png";
}

async function loadFallback(): Promise<Response> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "icons",
    "icon-192x192.png",
  );
  const buf = await readFile(filePath);
  return new Response(buf, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=60",
    },
  });
}

async function loadLocal(src: string): Promise<Response | null> {
  try {
    const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    const buf = await readFile(filePath);
    return new Response(buf, {
      headers: {
        "Content-Type": guessContentType(src, null),
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch {
    return null;
  }
}

async function loadRemote(src: string): Promise<Response | null> {
  try {
    const absolute =
      src.startsWith("http://") || src.startsWith("https://")
        ? src
        : new URL(
            src,
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          ).toString();
    const res = await fetch(absolute, {
      next: { revalidate: 60, tags: ["corporate"] },
    });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return new Response(buf, {
      headers: {
        "Content-Type": guessContentType(src, res.headers.get("content-type")),
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch {
    return null;
  }
}

/** Serve the same brand logo used in header / footer (CMS → fallback). */
export async function serveBrandIconResponse(): Promise<Response> {
  const src = (await resolveBrandLogoSrc()) || FALLBACK_BRAND_ICON;
  if (src.startsWith("/")) {
    return (await loadLocal(src)) ?? loadFallback();
  }
  return (await loadRemote(src)) ?? loadFallback();
}
