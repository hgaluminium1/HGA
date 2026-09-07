import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { isConflictError } from "@/lib/http/conflict";
import { revalidateCategories } from "@/lib/cms/revalidate-pages";
import { moveCategory, moveCategorySchema } from "@/modules/catalog";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const authz = await authorize("catalog.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = moveCategorySchema.parse(body);
    const result = await moveCategory(id, parsed);
    if ("error" in result) {
      return respondError("NOT_FOUND", "Category not found", 404);
    }
    revalidateCategories();
    return respondSuccess(result.category);
  } catch (err) {
    if (isConflictError(err)) {
      return respondError(err.code, err.message, err.status);
    }
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
