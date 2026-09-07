import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateCorporate } from "@/lib/cms/revalidate-pages";
import {
  companyProfileSchema,
  getCompanyProfile,
  upsertCompanyProfile,
} from "@/modules/corporate";

export async function GET() {
  const authz = await authorize("corporate.read");
  if ("error" in authz) return authz.error;
  const profile = await getCompanyProfile();
  return respondSuccess(profile);
}

export async function PUT(req: Request) {
  const authz = await authorize("corporate.write");
  if ("error" in authz) return authz.error;
  try {
    const body = await req.json();
    const parsed = companyProfileSchema.parse(body);
    const result = await upsertCompanyProfile(parsed);
    if ("error" in result) {
      return respondError("CONFLICT", result.message ?? "Conflict", 409);
    }
    revalidateCorporate();
    return respondSuccess(result.profile);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
