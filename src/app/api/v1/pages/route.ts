import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidatePages } from "@/lib/cms/revalidate-pages";
import { createPage, createPageSchema, listPages } from "@/modules/cms";

export async function GET(req: Request) {
  const authz = await authorize("pages.read");
  if ("error" in authz) return authz.error;

  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const cursor = url.searchParams.get("cursor") ?? undefined;
  const includeDeleted = url.searchParams.get("trash") === "1";
  const data = await listPages({
    q,
    cursor,
    includeDeleted,
  });
  return respondSuccess(data);
}

export async function POST(req: Request) {
  const authz = await authorize("pages.write");
  if ("error" in authz) return authz.error;

  try {
    const body = await req.json();
    const parsed = createPageSchema.parse(body);
    const page = await createPage(parsed);
    revalidatePages();
    return respondSuccess(page);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
