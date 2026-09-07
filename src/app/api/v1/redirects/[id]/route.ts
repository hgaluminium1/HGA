import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { deleteRedirect, redirectSchema, updateRedirect } from "@/modules/cms";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const authz = await authorize("redirects.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = redirectSchema.partial().parse(body);
    const item = await updateRedirect(id, parsed);
    if (!item) return respondError("NOT_FOUND", "Redirect not found", 404);
    return respondSuccess(item);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const authz = await authorize("redirects.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const item = await deleteRedirect(id);
  if (!item) return respondError("NOT_FOUND", "Redirect not found", 404);
  return respondSuccess(item);
}
