import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateCategories } from "@/lib/cms/revalidate-pages";
import { purgeCategory, restoreCategory } from "@/modules/catalog";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as { action?: string };
  if (body.action === "purge") {
    const authz = await authorize("trash.purge");
    if ("error" in authz) return authz.error;
    const ok = await purgeCategory(id);
    if (!ok) return respondError("NOT_FOUND", "Trash item not found", 404);
    revalidateCategories();
    return respondSuccess({ ok: true });
  }
  const authz = await authorize("trash.restore");
  if ("error" in authz) return authz.error;
  const category = await restoreCategory(id);
  if (!category) return respondError("NOT_FOUND", "Trash item not found", 404);
  revalidateCategories();
  return respondSuccess(category);
}
