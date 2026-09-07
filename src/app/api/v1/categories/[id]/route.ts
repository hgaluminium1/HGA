import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { isConflictError } from "@/lib/http/conflict";
import { revalidateCategories } from "@/lib/cms/revalidate-pages";
import {
  getCategoryById,
  softDeleteCategory,
  updateCategory,
  updateCategorySchema,
} from "@/modules/catalog";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const authz = await authorize("catalog.read");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const category = await getCategoryById(id);
  if (!category) return respondError("NOT_FOUND", "Category not found", 404);
  return respondSuccess(category);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const authz = await authorize("catalog.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = updateCategorySchema.parse(body);
    const result = await updateCategory(id, parsed);
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

export async function DELETE(_req: Request, ctx: Ctx) {
  const authz = await authorize("catalog.delete");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const category = await softDeleteCategory(id);
    if (!category) return respondError("NOT_FOUND", "Category not found", 404);
    revalidateCategories();
    return respondSuccess(category);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
