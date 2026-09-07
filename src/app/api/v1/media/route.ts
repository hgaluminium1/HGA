import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateMedia } from "@/lib/cms/revalidate-pages";
import {
  createMediaFromUpload,
  listMedia,
  type MediaKind,
} from "@/modules/media";

export async function GET(req: Request) {
  const authz = await authorize("media.read");
  if ("error" in authz) return authz.error;
  const url = new URL(req.url);
  const data = await listMedia({
    q: url.searchParams.get("q") ?? undefined,
    kind: url.searchParams.get("kind") ?? undefined,
    tag: url.searchParams.get("tag") ?? undefined,
    cursor: url.searchParams.get("cursor") ?? undefined,
    includeDeleted: url.searchParams.get("trash") === "1",
  });
  return respondSuccess(data);
}

export async function POST(req: Request) {
  const authz = await authorize("media.write");
  if ("error" in authz) return authz.error;
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return respondError("VALIDATION_ERROR", "file is required", 400);
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const kind = (form.get("kind") as MediaKind | null) ?? undefined;
    const alt = (form.get("alt") as string | null) ?? undefined;
    const tagsRaw = (form.get("tags") as string | null) ?? "";
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const result = await createMediaFromUpload({
      buffer,
      filename: file.name,
      mime: file.type || "application/octet-stream",
      kind,
      tags,
      alt,
    });
    if ("error" in result) {
      const status = result.error === "MEDIA_NOT_CONFIGURED" ? 503 : 400;
      return respondError(result.error, result.message, status);
    }
    revalidateMedia();
    return respondSuccess(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return respondError("INTERNAL_ERROR", message, 500);
  }
}
