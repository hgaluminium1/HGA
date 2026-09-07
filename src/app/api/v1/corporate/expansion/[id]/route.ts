import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateCorporate } from "@/lib/cms/revalidate-pages";
import {
  getExpansionProjectById,
  softDeleteExpansionProject,
  updateExpansionProject,
  updateExpansionProjectSchema,
} from "@/modules/corporate";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.read");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const project = await getExpansionProjectById(id);
  if (!project) return respondError("NOT_FOUND", "Not found", 404);
  return respondSuccess(project);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = updateExpansionProjectSchema.parse(body);
    const result = await updateExpansionProject(id, parsed);
    if ("error" in result) {
      if (result.error === "CONFLICT")
        return respondError("CONFLICT", result.message ?? "Conflict", 409);
      return respondError("NOT_FOUND", "Not found", 404);
    }
    revalidateCorporate();
    return respondSuccess(result.project);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.delete");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const project = await softDeleteExpansionProject(id);
  if (!project) return respondError("NOT_FOUND", "Not found", 404);
  revalidateCorporate();
  return respondSuccess(project);
}
