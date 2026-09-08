import type { PageDTO } from "@/modules/cms/browser";
import {
  getPageTemplate,
  syncBlocksToTemplate,
  type BlockType,
} from "@/modules/cms/browser";

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

export async function fetchPages() {
  const res = await fetch("/api/v1/pages");
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

export type MediaUploadResult = {
  id: string;
  url: string;
  key: string;
  kind: string;
  mime: string;
};

export async function uploadMediaApi(file: File, alt?: string) {
  const form = new FormData();
  form.set("file", file);
  if (alt) form.set("alt", alt);
  const res = await fetch("/api/v1/media", { method: "POST", body: form });
  return parse<{ media: MediaUploadResult; reused: boolean }>(res);
}

/** Find by slug or create from PAGE_TEMPLATES + syncBlocksToTemplate. */
export async function ensurePageBySlug(slug: string): Promise<PageDTO> {
  const { items } = await fetchPages();
  const existing = items.find((p) => p.slug === slug && !p.deletedAt);
  if (existing) {
    const full = await fetchPage(existing.id);
    const synced = syncBlocksToTemplate(slug, full.blocks);
    if (
      synced.length !== full.blocks.length ||
      synced.some((b, i) => b.id !== full.blocks[i]?.id)
    ) {
      return updatePageApi(full.id, {
        blocks: synced,
        version: full.version,
      });
    }
    return full;
  }

  const template = getPageTemplate(slug);
  if (!template) {
    throw new ApiClientError(`Unknown page template: ${slug}`, "NOT_FOUND", 404);
  }

  const blocks = syncBlocksToTemplate(slug, []);
  return createPageApi({
    title: template.label,
    slug: template.slug,
    locale: "en",
    blocks: blocks.map((b) => ({
      id: b.id,
      type: b.type as BlockType,
      order: b.order,
      appearance: b.appearance,
      data: b.data,
    })),
  });
}

export function previewPathForTemplate(publicPath: string, locale = "en") {
  if (!publicPath) return `/${locale}`;
  return `/${locale}/${publicPath}`;
}
