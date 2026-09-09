import { ApiClientError } from "@/features/admin-desk/lib/api";
import type { EnquiryDTO, EnquiryStatus } from "@/modules/enquiries/browser";

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

export async function fetchLeadsApi(params?: {
  q?: string;
  status?: EnquiryStatus | "all";
}) {
  const sp = new URLSearchParams();
  if (params?.q) sp.set("q", params.q);
  if (params?.status) sp.set("status", params.status);
  const qs = sp.toString();
  const res = await fetch(`/api/v1/enquiries${qs ? `?${qs}` : ""}`);
  return parse<{ items: EnquiryDTO[] }>(res);
}

export async function fetchLeadApi(id: string) {
  const res = await fetch(`/api/v1/enquiries/${id}`);
  return parse<EnquiryDTO>(res);
}

export async function updateLeadStatusApi(
  id: string,
  status: EnquiryStatus,
) {
  const res = await fetch(`/api/v1/enquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return parse<EnquiryDTO>(res);
}
