import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidatePages } from "@/lib/cms/revalidate-pages";
import { purgePage, restorePage } from "@/modules/cms";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as { action?: string };
  if (body.action === "purge") {
    const authz = await authorize("trash.purge");
    if ("error" in authz) return authz.error;
    const ok = await purgePage(id);
    if (!ok) return respondError("NOT_FOUND", "Trash item not found", 404);
    revalidatePages();
    return respondSuccess({ ok: true });
  }
  const authz = await authorize("trash.restore");
  if ("error" in authz) return authz.error;
  const page = await restorePage(id);
  if (!page) return respondError("NOT_FOUND", "Trash item not found", 404);
  revalidatePages();
  return respondSuccess(page);
}
