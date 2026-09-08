import { createHash } from "node:crypto";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function keyFor(email: string, ip: string) {
  const normalized = email.trim().toLowerCase();
  return createHash("sha256").update(`${normalized}|${ip}`).digest("hex");
}

/**
 * In-memory login rate limit (5 attempts / 15 min per email+IP).
 * Suitable for single-instance / free-tier; swap for Redis when scaling out.
 */
export function checkLoginRateLimit(
  email: string,
  ip: string,
): {
  ok: boolean;
  retryAfterSec?: number;
} {
  const key = keyFor(email, ip);
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (bucket.count >= MAX_ATTEMPTS) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  bucket.count += 1;
  return { ok: true };
}

export function clearLoginRateLimit(email: string, ip: string) {
  buckets.delete(keyFor(email, ip));
}
