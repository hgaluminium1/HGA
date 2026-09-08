import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { isConflictError } from "@/lib/http/conflict";
import { revalidateCareers } from "@/lib/cms/revalidate-pages";
import { publishOpening } from "@/modules/careers";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.publish");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = (await req.json().catch(() => ({}))) as {
      action?: string;
      version?: number;
    };
    if (typeof body.version !== "number") {
      return respondError("VALIDATION_ERROR", "version is required", 400);
    }
    const action = body.action === "unpublish" ? "unpublish" : "publish";
    const result = await publishOpening(id, action, body.version);
    if ("error" in result) {
      return respondError("NOT_FOUND", "Opening not found", 404);
    }
    revalidateCareers();
    return respondSuccess(result.opening);
  } catch (err) {
    if (isConflictError(err)) {
      return respondError(err.code, err.message, err.status);
    }
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
