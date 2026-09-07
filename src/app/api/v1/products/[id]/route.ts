import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { isConflictError } from "@/lib/http/conflict";
import { revalidateProducts } from "@/lib/cms/revalidate-pages";
import {
  getProductById,
  softDeleteProduct,
  updateProduct,
  updateProductSchema,
} from "@/modules/catalog";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const authz = await authorize("catalog.read");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const product = await getProductById(id);
  if (!product) return respondError("NOT_FOUND", "Product not found", 404);
  return respondSuccess(product);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const authz = await authorize("catalog.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = updateProductSchema.parse(body);
    const result = await updateProduct(id, parsed);
    if ("error" in result) {
      if (result.error === "IMAGE_REQUIRED") {
        return respondError(
          "IMAGE_REQUIRED",
          "message" in result && typeof result.message === "string"
            ? result.message
            : "Present products require an image before publish.",
          400,
        );
      }
      return respondError("NOT_FOUND", "Product not found", 404);
    }
    revalidateProducts();
    return respondSuccess(result.product);
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
  const product = await softDeleteProduct(id);
  if (!product) return respondError("NOT_FOUND", "Product not found", 404);
  revalidateProducts();
  return respondSuccess(product);
}
