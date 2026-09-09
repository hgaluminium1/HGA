import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function r2Hostname(): string | null {
  const raw = process.env.R2_PUBLIC_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
}

const r2Host = r2Hostname();

const offlinePage = path.join(__dirname, "src/app/~offline/page.tsx");
const offlineRevision = createHash("md5")
  .update(readFileSync(offlinePage, "utf8"))
  .digest("hex");

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  cacheOnNavigation: true,
  reloadOnOnline: false,
  additionalPrecacheEntries: [
    { url: "/~offline", revision: offlineRevision },
    { url: "/en", revision: offlineRevision },
  ],
  exclude: [
    /\/api\/.*/i,
    /\/admin\/.*/i,
    /\/_next\/data\/.*/i,
  ],
});

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      ...(r2Host
        ? ([{ protocol: "https" as const, hostname: r2Host }] as const)
        : []),
    ],
  },
};

export default withSerwist(nextConfig);
