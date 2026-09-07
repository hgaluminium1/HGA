import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateMedia } from "@/lib/cms/revalidate-pages";
import {
  getMediaById,
  softDeleteMedia,
  updateMedia,
  updateMediaSchema,
} from "@/modules/media";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const authz = await authorize("media.read");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const media = await getMediaById(id);
  if (!media) return respondError("NOT_FOUND", "Media not found", 404);
  return respondSuccess(media);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const authz = await authorize("media.write");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = updateMediaSchema.parse(body);
    const result = await updateMedia(id, parsed);
    if ("error" in result) {
      if (result.error === "CONFLICT") {
        return respondError("CONFLICT", result.message ?? "Conflict", 409);
      }
      return respondError("NOT_FOUND", "Media not found", 404);
    }
    revalidateMedia();
    return respondSuccess(result.media);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const authz = await authorize("media.delete");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const media = await softDeleteMedia(id);
  if (!media) return respondError("NOT_FOUND", "Media not found", 404);
  revalidateMedia();
  return respondSuccess(media);
}
