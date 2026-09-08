import type { PageDTO, RedirectDTO } from "@/modules/cms/browser";

type ApiSuccess<T> = { success: true; data: T };
type ApiFailure = {
  success: false;
  error: { code: string; message: string };
};

export class ApiClientError extends Error {
  status: number;
  code: string;
  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function parse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiSuccess<T> | ApiFailure;
  if (!json.success) {
    throw new ApiClientError(
      json.error.message || "Request failed",
      json.error.code,
      res.status,
    );
  }
  return json.data;
}

export async function fetchPages(opts?: { q?: string; trash?: boolean }) {
  const params = new URLSearchParams();
  if (opts?.q) params.set("q", opts.q);
  if (opts?.trash) params.set("trash", "1");
  const qs = params.toString();
  const res = await fetch(`/api/v1/pages${qs ? `?${qs}` : ""}`);
  return parse<{ items: PageDTO[]; nextCursor: string | null }>(res);
}

export async function fetchPage(id: string) {
  const res = await fetch(`/api/v1/pages/${id}`);
  return parse<PageDTO>(res);
}

export async function createPageApi(body: {
  title: string;
  slug: string;
  locale?: string;
  blocks?: unknown[];
  seo?: { title?: string; description?: string };
}) {
  const res = await fetch("/api/v1/pages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<PageDTO>(res);
}

export async function updatePageApi(
  id: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`/api/v1/pages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<PageDTO>(res);
}

export async function publishPageApi(
  id: string,
  action: "publish" | "unpublish",
  version: number,
) {
  const res = await fetch(`/api/v1/pages/${id}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, version }),
  });
  return parse<PageDTO>(res);
}

export async function deletePageApi(id: string) {
  const res = await fetch(`/api/v1/pages/${id}`, { method: "DELETE" });
  return parse<PageDTO>(res);
}

export async function restorePageApi(id: string) {
  const res = await fetch(`/api/v1/pages/${id}/trash`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "restore" }),
  });
  return parse<PageDTO>(res);
}

export async function purgePageApi(id: string) {
  const res = await fetch(`/api/v1/pages/${id}/trash`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "purge" }),
  });
  return parse<{ ok: boolean }>(res);
}

export async function createPreviewApi(entityId: string) {
  const res = await fetch("/api/v1/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entityId, entityType: "page" }),
  });
  return parse<{ token: string; url: string; expiresAt: string }>(res);
}

export async function fetchRedirects() {
  const res = await fetch("/api/v1/redirects");
  return parse<{ items: RedirectDTO[] }>(res);
}

export async function createRedirectApi(body: {
  fromPath: string;
  toPath: string;
  statusCode: 301 | 302;
  active?: boolean;
}) {
  const res = await fetch("/api/v1/redirects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<RedirectDTO>(res);
}

export async function deleteRedirectApi(id: string) {
  const res = await fetch(`/api/v1/redirects/${id}`, { method: "DELETE" });
  return parse<RedirectDTO>(res);
}
