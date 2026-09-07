import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateCorporate } from "@/lib/cms/revalidate-pages";
import {
  getPersonById,
  softDeletePerson,
  updatePerson,
  updatePersonSchema,
} from "@/modules/corporate";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.read");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const person = await getPersonById(id);
  if (!person) return respondError("NOT_FOUND", "Person not found", 404);
  return respondSuccess(person);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = updatePersonSchema.parse(body);
    const result = await updatePerson(id, parsed);
    if ("error" in result) {
      if (result.error === "CONFLICT") {
        return respondError("CONFLICT", result.message ?? "Conflict", 409);
      }
      return respondError("NOT_FOUND", "Person not found", 404);
    }
    revalidateCorporate();
    return respondSuccess(result.person);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.delete");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const person = await softDeletePerson(id);
  if (!person) return respondError("NOT_FOUND", "Person not found", 404);
  revalidateCorporate();
  return respondSuccess(person);
}
