import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateCorporate } from "@/lib/cms/revalidate-pages";
import {
  getCustomerLogoById,
  softDeleteCustomerLogo,
  updateCustomerLogo,
  updateCustomerLogoSchema,
} from "@/modules/corporate";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.read");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const logo = await getCustomerLogoById(id);
  if (!logo) return respondError("NOT_FOUND", "Customer logo not found", 404);
  return respondSuccess(logo);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = updateCustomerLogoSchema.parse(body);
    const result = await updateCustomerLogo(id, parsed);
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
      return respondError("NOT_FOUND", "Customer logo not found", 404);
    }
    revalidateCorporate();
    return respondSuccess(result.logo);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.delete");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const logo = await softDeleteCustomerLogo(id);
  if (!logo) return respondError("NOT_FOUND", "Customer logo not found", 404);
  revalidateCorporate();
  return respondSuccess(logo);
}
