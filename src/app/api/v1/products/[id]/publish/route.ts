import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { isConflictError } from "@/lib/http/conflict";
import { revalidateProducts } from "@/lib/cms/revalidate-pages";
import { publishProduct, unpublishProduct } from "@/modules/catalog";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const authz = await authorize("catalog.publish");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = (await req.json().catch(() => ({}))) as {
      action?: string;
      version?: number;
    };
    if (typeof body.version !== "number") {
      return respondError("VALIDATION_ERROR", "version is required", 400);
    }
    const action = body.action ?? "publish";
    const result =
      action === "unpublish"
        ? await unpublishProduct(id, body.version)
        : await publishProduct(id, body.version);
    if ("error" in result) {
      if (result.error === "IMAGE_REQUIRED") {
        return respondError(
          "IMAGE_REQUIRED",
          "message" in result && typeof result.message === "string"
            ? result.message
            : "Present products require an image before publish. Upload in Media and attach it on the Basic tab.",
          400,
        );
      }
      return respondError("NOT_FOUND", "Product not found", 404);
    }
    revalidateProducts();
    return respondSuccess(result.product);
  } catch (err) {
    if (isConflictError(err)) {
      return respondError(err.code, err.message, err.status);
    }
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
