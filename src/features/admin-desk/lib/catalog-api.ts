import type { CategoryDTO, ProductDTO } from "@/modules/catalog/browser";
import { ApiClientError } from "@/features/admin-desk/lib/api";

type ApiSuccess<T> = { success: true; data: T };
type ApiFailure = {
  success: false;
  error: { code: string; message: string };
};

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

export async function fetchProductsApi(params?: {
  q?: string;
  cursor?: string | null;
  categoryId?: string;
  trash?: boolean;
  limit?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.q) sp.set("q", params.q);
  if (params?.cursor) sp.set("cursor", params.cursor);
  if (params?.categoryId) sp.set("categoryId", params.categoryId);
  if (params?.trash) sp.set("trash", "1");
  if (params?.limit) sp.set("limit", String(params.limit));
  const res = await fetch(`/api/v1/products?${sp}`);
  return parse<{ items: ProductDTO[]; nextCursor: string | null }>(res);
}

export async function fetchProductApi(id: string) {
  const res = await fetch(`/api/v1/products/${id}`);
  return parse<ProductDTO>(res);
}

export async function createProductApi(body: Record<string, unknown>) {
  const res = await fetch("/api/v1/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<ProductDTO>(res);
}

export async function updateProductApi(
  id: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`/api/v1/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<ProductDTO>(res);
}

export async function publishProductApi(
  id: string,
  action: "publish" | "unpublish",
  version: number,
) {
  const res = await fetch(`/api/v1/products/${id}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, version }),
  });
  return parse<ProductDTO>(res);
}

export async function duplicateProductApi(id: string) {
  const res = await fetch(`/api/v1/products/${id}/duplicate`, {
    method: "POST",
  });
  return parse<ProductDTO>(res);
}

export async function trashProductApi(id: string, purge = false) {
  const res = await fetch(`/api/v1/products/${id}/trash`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(purge ? { action: "purge" } : {}),
  });
  return parse<ProductDTO | { ok: true }>(res);
}

export async function deleteProductApi(id: string) {
  const res = await fetch(`/api/v1/products/${id}`, { method: "DELETE" });
  return parse<{ ok: true } | ProductDTO>(res);
}

export async function fetchCategoriesApi(view: "flat" | "tree" = "flat") {
  const res = await fetch(`/api/v1/categories?view=${view}`);
  const data = await parse<{ items?: CategoryDTO[]; tree?: CategoryDTO[] }>(
    res,
  );
  return data.items ?? data.tree ?? [];
}

export async function fetchCategoryApi(id: string) {
  const res = await fetch(`/api/v1/categories/${id}`);
  return parse<CategoryDTO>(res);
}

export async function createCategoryApi(body: Record<string, unknown>) {
  const res = await fetch("/api/v1/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<CategoryDTO>(res);
}

export async function updateCategoryApi(
  id: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`/api/v1/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<CategoryDTO>(res);
}

export async function deleteCategoryApi(id: string) {
  const res = await fetch(`/api/v1/categories/${id}`, { method: "DELETE" });
  return parse<{ ok: true } | CategoryDTO>(res);
}

export async function fetchDictionaryApi(key: string) {
  const res = await fetch(`/api/v1/dictionaries?key=${encodeURIComponent(key)}`);
  return parse<{
    key: string;
    items: Array<{ value: string; label: { en: string }; sortOrder: number }>;
    version: number;
  }>(res);
}

export { ApiClientError };
