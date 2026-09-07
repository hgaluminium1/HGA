import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { createRedirect, listRedirects, redirectSchema } from "@/modules/cms";

export async function GET() {
  const authz = await authorize("redirects.read");
  if ("error" in authz) return authz.error;
  const items = await listRedirects();
  return respondSuccess({ items });
}

export async function POST(req: Request) {
  const authz = await authorize("redirects.write");
  if ("error" in authz) return authz.error;
  try {
    const body = await req.json();
    const parsed = redirectSchema.parse(body);
    const item = await createRedirect(parsed);
    return respondSuccess(item);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
