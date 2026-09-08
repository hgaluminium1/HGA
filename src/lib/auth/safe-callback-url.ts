/** Only allow same-origin admin callback paths (open-redirect guard). Client-safe. */
export function safeAdminCallbackUrl(
  raw: string | null | undefined,
  fallback = "/admin",
): string {
  if (!raw) return fallback;
  let path = raw;
  try {
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      const u = new URL(raw);
      path = `${u.pathname}${u.search}`;
    }
  } catch {
    return fallback;
  }
  if (!path.startsWith("/admin") || path.startsWith("//")) return fallback;
  if (path.startsWith("/admin/login")) return fallback;
  return path;
}
