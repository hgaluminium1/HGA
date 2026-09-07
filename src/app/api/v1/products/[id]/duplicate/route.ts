import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateProducts } from "@/lib/cms/revalidate-pages";
import { duplicateProduct } from "@/modules/catalog";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  const authz = await authorize("catalog.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const product = await duplicateProduct(id);
  if (!product) return respondError("NOT_FOUND", "Product not found", 404);
  revalidateProducts();
  return respondSuccess(product);
}
