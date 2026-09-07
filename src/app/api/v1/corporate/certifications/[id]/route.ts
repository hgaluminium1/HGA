import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateCorporate } from "@/lib/cms/revalidate-pages";
import {
  getCertificationById,
  softDeleteCertification,
  updateCertification,
  updateCertificationSchema,
} from "@/modules/corporate";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.read");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const certification = await getCertificationById(id);
  if (!certification) {
    return respondError("NOT_FOUND", "Certification not found", 404);
  }
  return respondSuccess(certification);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = updateCertificationSchema.parse(body);
    const result = await updateCertification(id, parsed);
    if ("error" in result) {
      if (result.error === "CONFLICT") {
        return respondError("CONFLICT", result.message ?? "Conflict", 409);
      }
      return respondError("NOT_FOUND", "Certification not found", 404);
    }
    revalidateCorporate();
    return respondSuccess(result.certification);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.delete");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const certification = await softDeleteCertification(id);
  if (!certification) {
    return respondError("NOT_FOUND", "Certification not found", 404);
  }
  revalidateCorporate();
  return respondSuccess(certification);
}
