import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateProducts } from "@/lib/cms/revalidate-pages";
import { purgeProduct, restoreProduct } from "@/modules/catalog";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as { action?: string };
  if (body.action === "purge") {
    const authz = await authorize("trash.purge");
    if ("error" in authz) return authz.error;
    const ok = await purgeProduct(id);
    if (!ok) return respondError("NOT_FOUND", "Trash item not found", 404);
    revalidateProducts();
    return respondSuccess({ ok: true });
  }
  const authz = await authorize("trash.restore");
  if ("error" in authz) return authz.error;
  const product = await restoreProduct(id);
  if (!product) return respondError("NOT_FOUND", "Trash item not found", 404);
  revalidateProducts();
  return respondSuccess(product);
}
