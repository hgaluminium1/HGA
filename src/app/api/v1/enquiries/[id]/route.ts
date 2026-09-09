import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import {
  getEnquiryById,
  updateEnquirySchema,
  updateEnquiryStatus,
} from "@/modules/enquiries";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const authz = await authorize("leads.read");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const lead = await getEnquiryById(id);
  if (!lead) return respondError("NOT_FOUND", "Lead not found", 404);
  return respondSuccess(lead);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const authz = await authorize("leads.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = updateEnquirySchema.parse(body);
    const result = await updateEnquiryStatus(id, parsed);
    if ("error" in result) {
      return respondError("NOT_FOUND", "Lead not found", 404);
    }
    return respondSuccess(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
