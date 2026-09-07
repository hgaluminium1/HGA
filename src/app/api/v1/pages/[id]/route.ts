import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { isConflictError } from "@/lib/http/conflict";
import { revalidatePages } from "@/lib/cms/revalidate-pages";
import {
  getPageById,
  softDeletePage,
  updatePage,
  updatePageSchema,
} from "@/modules/cms";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const authz = await authorize("pages.read");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const page = await getPageById(id);
  if (!page) return respondError("NOT_FOUND", "Page not found", 404);
  return respondSuccess(page);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const authz = await authorize("pages.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = updatePageSchema.parse(body);
    const result = await updatePage(id, parsed);
    if ("error" in result) {
      return respondError("NOT_FOUND", "Page not found", 404);
    }
    revalidatePages();
    return respondSuccess(result.page);
  } catch (err) {
    if (isConflictError(err)) {
      return respondError(err.code, err.message, err.status);
    }
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const authz = await authorize("pages.delete");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const page = await softDeletePage(id);
  if (!page) return respondError("NOT_FOUND", "Page not found", 404);
  revalidatePages();
  return respondSuccess(page);
}
