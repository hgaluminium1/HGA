import type {
  CategoryDTO,
  DictionaryDTO,
  ProductDTO,
} from "@/modules/catalog/browser";

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

export async function fetchCategoryTree() {
  const res = await fetch("/api/v1/categories?view=tree");
  return parse<{ tree: CategoryDTO[] }>(res);
}

export async function fetchCategoriesFlat(opts?: { trash?: boolean }) {
  const qs = opts?.trash ? "?trash=1" : "?view=flat";
  const res = await fetch(`/api/v1/categories${qs}`);
  return parse<{ items: CategoryDTO[] }>(res);
}

export async function createCategoryApi(body: {
  name: { en: string };
  slug: string;
  parentId?: string | null;
  status?: "draft" | "published";
}) {
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
  return parse<CategoryDTO>(res);
}

export async function restoreCategoryApi(id: string) {
  const res = await fetch(`/api/v1/categories/${id}/trash`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "restore" }),
  });
  return parse<CategoryDTO>(res);
}

export async function purgeCategoryApi(id: string) {
  const res = await fetch(`/api/v1/categories/${id}/trash`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "purge" }),
  });
  return parse<{ ok: boolean }>(res);
}

export async function fetchProducts(opts?: { q?: string; trash?: boolean }) {
  const params = new URLSearchParams();
  if (opts?.q) params.set("q", opts.q);
  if (opts?.trash) params.set("trash", "1");
  const qs = params.toString();
  const res = await fetch(`/api/v1/products${qs ? `?${qs}` : ""}`);
  return parse<{ items: ProductDTO[]; nextCursor: string | null }>(res);
}

export async function fetchProduct(id: string) {
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
  version: number,
  action: "publish" | "unpublish",
) {
  const res = await fetch(`/api/v1/products/${id}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, version }),
  });
  return parse<ProductDTO>(res);
}

export async function deleteProductApi(id: string) {
  const res = await fetch(`/api/v1/products/${id}`, { method: "DELETE" });
  return parse<ProductDTO>(res);
}

export async function duplicateProductApi(id: string) {
  const res = await fetch(`/api/v1/products/${id}/duplicate`, {
    method: "POST",
  });
  return parse<ProductDTO>(res);
}

export async function restoreProductApi(id: string) {
  const res = await fetch(`/api/v1/products/${id}/trash`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "restore" }),
  });
  return parse<ProductDTO>(res);
}

export async function purgeProductApi(id: string) {
  const res = await fetch(`/api/v1/products/${id}/trash`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "purge" }),
  });
  return parse<{ ok: boolean }>(res);
}

export async function fetchDictionaries() {
  const res = await fetch("/api/v1/dictionaries");
  return parse<{ items: DictionaryDTO[] }>(res);
}

export async function fetchDictionary(key: string) {
  const res = await fetch(`/api/v1/dictionaries?key=${encodeURIComponent(key)}`);
  return parse<DictionaryDTO>(res);
}

export async function addDictionaryItemApi(body: {
  key: string;
  item: {
    value: string;
    label: { en: string };
    sortOrder: number;
    active: boolean;
  };
  version: number;
}) {
  const res = await fetch("/api/v1/dictionaries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "addItem", ...body }),
  });
  return parse<DictionaryDTO>(res);
}

export async function deactivateDictionaryItemApi(body: {
  key: string;
  value: string;
  version: number;
}) {
  const res = await fetch("/api/v1/dictionaries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "deactivate", ...body }),
  });
  return parse<DictionaryDTO>(res);
}
