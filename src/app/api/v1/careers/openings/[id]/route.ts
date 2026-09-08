import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { isConflictError } from "@/lib/http/conflict";
import { revalidateCareers } from "@/lib/cms/revalidate-pages";
import {
  getOpening,
  softDeleteOpening,
  updateOpening,
  updateOpeningSchema,
} from "@/modules/careers";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.read");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const opening = await getOpening(id);
  if (!opening) return respondError("NOT_FOUND", "Opening not found", 404);
  return respondSuccess(opening);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = updateOpeningSchema.parse(body);
    const result = await updateOpening(id, parsed);
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

export async function DELETE(_req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.delete");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const result = await softDeleteOpening(id);
  if ("error" in result) {
    return respondError("NOT_FOUND", "Opening not found", 404);
  }
  revalidateCareers();
  return respondSuccess(result.opening);
}
