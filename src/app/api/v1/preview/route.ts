import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { createPreviewToken, revokePreviewToken } from "@/modules/cms";
import { z } from "zod";

const createSchema = z.object({
  entityId: z.string().min(1),
  entityType: z.string().default("page"),
});

const revokeSchema = z.object({
  token: z.string().min(1),
});

export async function POST(req: Request) {
  const authz = await authorize("preview.create");
  if ("error" in authz) return authz.error;
  try {
    const body = await req.json();
    if (body?.action === "revoke") {
      const parsed = revokeSchema.parse(body);
      const ok = await revokePreviewToken(parsed.token);
      if (!ok) return respondError("NOT_FOUND", "Token not found", 404);
      return respondSuccess({ ok: true });
    }
    const parsed = createSchema.parse(body);
    const result = await createPreviewToken(
      parsed.entityId,
      parsed.entityType,
    );
    if ("error" in result) {
      return respondError("NOT_FOUND", "Page not found", 404);
    }
    return respondSuccess(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
