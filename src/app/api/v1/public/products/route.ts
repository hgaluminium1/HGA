import { respondError, respondSuccess } from "@/lib/http/respond";
import { listPublishedProducts } from "@/modules/catalog";

/** Public catalogue pagination (no auth) — present products only. */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const upcomingParam = url.searchParams.get("upcoming");
    const upcoming =
      upcomingParam === "true"
        ? true
        : upcomingParam === "all"
          ? ("all" as const)
          : false;
    const data = await listPublishedProducts({
      q: url.searchParams.get("q") ?? undefined,
      cursor: url.searchParams.get("cursor") ?? undefined,
      categoryId: url.searchParams.get("categoryId") ?? undefined,
      limit: url.searchParams.get("limit")
        ? Number(url.searchParams.get("limit"))
        : 24,
      upcoming,
    });
    return respondSuccess(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return respondError("INTERNAL_ERROR", message, 500);
  }
}
