import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "node:crypto";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 8;

type Bucket = { count: number; resetAt: number };
const memoryBuckets = new Map<string, Bucket>();

function memoryLimit(key: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (bucket.count >= MAX_PER_WINDOW) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  bucket.count += 1;
  return { ok: true };
}

let upstash: Ratelimit | null | undefined;

function getUpstashLimiter() {
  if (upstash !== undefined) return upstash;
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    upstash = null;
    return null;
  }
  upstash = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(MAX_PER_WINDOW, "1 h"),
    prefix: "hg:enquiry",
    analytics: false,
  });
  return upstash;
}

export function clientIpFromRequest(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Rate-limit public RFQ posts. Prefers Upstash; falls back to in-memory
 * for local/dev when Redis env is unset.
 */
export async function checkEnquiryRateLimit(ip: string): Promise<{
  ok: boolean;
  retryAfterSec?: number;
}> {
  const key = createHash("sha256").update(ip).digest("hex").slice(0, 32);
  const limiter = getUpstashLimiter();
  if (!limiter) return memoryLimit(key);

  try {
    const result = await limiter.limit(key);
    if (result.success) return { ok: true };
    return {
      ok: false,
      retryAfterSec: Math.max(
        1,
        Math.ceil((result.reset - Date.now()) / 1000),
      ),
    };
  } catch {
    return memoryLimit(key);
  }
}
