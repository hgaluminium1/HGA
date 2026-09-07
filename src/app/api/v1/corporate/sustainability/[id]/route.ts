import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateCorporate } from "@/lib/cms/revalidate-pages";
import {
  getSustainabilityMetricById,
  softDeleteSustainabilityMetric,
  updateSustainabilityMetric,
  updateSustainabilityMetricSchema,
} from "@/modules/corporate";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.read");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const metric = await getSustainabilityMetricById(id);
  if (!metric) {
    return respondError("NOT_FOUND", "Sustainability metric not found", 404);
  }
  return respondSuccess(metric);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = updateSustainabilityMetricSchema.parse(body);
    const result = await updateSustainabilityMetric(id, parsed);
    if ("error" in result) {
      if (result.error === "CONFLICT") {
        return respondError("CONFLICT", result.message ?? "Conflict", 409);
      }
      if (result.error === "VALIDATION_ERROR") {
        return respondError(
          "VALIDATION_ERROR",
          result.message ?? "Invalid payload",
          400,
        );
      }
      return respondError("NOT_FOUND", "Sustainability metric not found", 404);
    }
    revalidateCorporate();
    return respondSuccess(result.metric);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.delete");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const metric = await softDeleteSustainabilityMetric(id);
  if (!metric) {
    return respondError("NOT_FOUND", "Sustainability metric not found", 404);
  }
  revalidateCorporate();
  return respondSuccess(metric);
}
