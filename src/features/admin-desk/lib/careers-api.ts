import type { CareerOpeningDTO } from "@/modules/careers/browser";
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

export async function fetchOpeningsApi(params?: {
  q?: string;
  department?: string;
  status?: "draft" | "published" | "all";
  trash?: boolean;
}) {
  const sp = new URLSearchParams();
  if (params?.q) sp.set("q", params.q);
  if (params?.department) sp.set("department", params.department);
  if (params?.status) sp.set("status", params.status);
  if (params?.trash) sp.set("trash", "1");
  const res = await fetch(`/api/v1/careers/openings?${sp}`);
  return parse<{ items: CareerOpeningDTO[] }>(res);
}

export async function fetchOpeningApi(id: string) {
  const res = await fetch(`/api/v1/careers/openings/${id}`);
  return parse<CareerOpeningDTO>(res);
}

export async function createOpeningApi(body: Record<string, unknown>) {
  const res = await fetch("/api/v1/careers/openings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<CareerOpeningDTO>(res);
}

export async function updateOpeningApi(
  id: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`/api/v1/careers/openings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<CareerOpeningDTO>(res);
}

export async function publishOpeningApi(
  id: string,
  action: "publish" | "unpublish",
  version: number,
) {
  const res = await fetch(`/api/v1/careers/openings/${id}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, version }),
  });
  return parse<CareerOpeningDTO>(res);
}

export async function deleteOpeningApi(id: string) {
  const res = await fetch(`/api/v1/careers/openings/${id}`, {
    method: "DELETE",
  });
  return parse<CareerOpeningDTO>(res);
}

export { ApiClientError };
