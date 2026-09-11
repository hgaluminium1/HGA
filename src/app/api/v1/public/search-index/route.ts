import { respondError, respondSuccess } from "@/lib/http/respond";
import { getCachedSearchIndex } from "@/features/public-site/lib/build-search-index";

/** Compact published site index for the header command palette. */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const locale = url.searchParams.get("locale")?.trim() || "en";
    const items = await getCachedSearchIndex(locale);
    return respondSuccess(
      { items, generatedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return respondError("INTERNAL_ERROR", message, 500);
  }
}
