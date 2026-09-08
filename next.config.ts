import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

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
        hostname: "res.cloudinary.com",
      },
      ...(r2Host
        ? ([{ protocol: "https" as const, hostname: r2Host }] as const)
        : []),
    ],
  },
};

export default nextConfig;
