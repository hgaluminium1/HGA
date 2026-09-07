import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateCorporate } from "@/lib/cms/revalidate-pages";
import {
  getTestimonialById,
  softDeleteTestimonial,
  updateTestimonial,
  updateTestimonialSchema,
} from "@/modules/corporate";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.read");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const testimonial = await getTestimonialById(id);
  if (!testimonial) {
    return respondError("NOT_FOUND", "Testimonial not found", 404);
  }
  return respondSuccess(testimonial);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = updateTestimonialSchema.parse(body);
    const result = await updateTestimonial(id, parsed);
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
      return respondError("NOT_FOUND", "Testimonial not found", 404);
    }
    revalidateCorporate();
    return respondSuccess(result.testimonial);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const authz = await authorize("corporate.delete");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const testimonial = await softDeleteTestimonial(id);
  if (!testimonial) {
    return respondError("NOT_FOUND", "Testimonial not found", 404);
  }
  revalidateCorporate();
  return respondSuccess(testimonial);
}
