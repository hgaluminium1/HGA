import type { MediaDTO } from "@/modules/media";

async function parse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as { data?: T; error?: { message?: string } };
  if (!res.ok) {
    throw new Error(json.error?.message ?? res.statusText);
  }
  return json.data as T;
}

export async function fetchMedia(opts?: {
  q?: string;
  kind?: string;
  tag?: string;
}) {
  const params = new URLSearchParams();
  if (opts?.q) params.set("q", opts.q);
  if (opts?.kind) params.set("kind", opts.kind);
  if (opts?.tag) params.set("tag", opts.tag);
  const qs = params.toString();
  const res = await fetch(`/api/v1/media${qs ? `?${qs}` : ""}`);
  return parse<{ items: MediaDTO[]; nextCursor: string | null }>(res);
}

export async function uploadMediaApi(file: File, meta?: { alt?: string; tags?: string }) {
  const form = new FormData();
  form.append("file", file);
  if (meta?.alt) form.append("alt", meta.alt);
  if (meta?.tags) form.append("tags", meta.tags);
  const res = await fetch("/api/v1/media", { method: "POST", body: form });
  return parse<{ media: MediaDTO; reused: boolean }>(res);
}

export async function updateMediaApi(
  id: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`/api/v1/media/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<MediaDTO>(res);
}

export async function deleteMediaApi(id: string) {
  const res = await fetch(`/api/v1/media/${id}`, { method: "DELETE" });
  return parse<MediaDTO>(res);
}
