import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateMedia } from "@/lib/cms/revalidate-pages";
import { purgeMedia, restoreMedia } from "@/modules/media";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  const authz = await authorize("trash.restore");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const media = await restoreMedia(id);
  if (!media) return respondError("NOT_FOUND", "Media not found", 404);
  revalidateMedia();
  return respondSuccess(media);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const authz = await authorize("trash.purge");
  if ("error" in authz) return authz.error;
  const { id } = await ctx.params;
  const result = await purgeMedia(id);
  if (!result) return respondError("NOT_FOUND", "Media not found", 404);
  revalidateMedia();
  return respondSuccess(result);
}
