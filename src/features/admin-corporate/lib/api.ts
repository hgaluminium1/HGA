import type {
  CapacityMetricDTO,
  CaseStudyDTO,
  CertificationDTO,
  CompanyProfileDTO,
  CustomerLogoDTO,
  PersonDTO,
  SustainabilityMetricDTO,
  TestimonialDTO,
  ExpansionProjectDTO,
} from "@/modules/corporate";

async function parse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as { data?: T; error?: { message?: string } };
  if (!res.ok) {
    throw new Error(json.error?.message ?? res.statusText);
  }
  return json.data as T;
}

/* ── Company (singleton) ─────────────────────────────────────────── */

export async function fetchCompany() {
  const res = await fetch("/api/v1/corporate/company");
  return parse<CompanyProfileDTO | null>(res);
}

export async function upsertCompanyApi(body: Record<string, unknown>) {
  const res = await fetch("/api/v1/corporate/company", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<CompanyProfileDTO>(res);
}

/* ── People ──────────────────────────────────────────────────────── */

export async function fetchPeople(opts?: { q?: string }) {
  const params = new URLSearchParams();
  if (opts?.q) params.set("q", opts.q);
  const qs = params.toString();
  const res = await fetch(
    `/api/v1/corporate/people${qs ? `?${qs}` : ""}`,
  );
  return parse<{ items: PersonDTO[] }>(res);
}

export async function createPersonApi(body: Record<string, unknown>) {
  const res = await fetch("/api/v1/corporate/people", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<PersonDTO>(res);
}

export async function updatePersonApi(
  id: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`/api/v1/corporate/people/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<PersonDTO>(res);
}

export async function deletePersonApi(id: string) {
  const res = await fetch(`/api/v1/corporate/people/${id}`, {
    method: "DELETE",
  });
  return parse<PersonDTO>(res);
}

/* ── Capacity metrics ────────────────────────────────────────────── */

export async function fetchCapacityMetrics(opts?: { q?: string }) {
  const params = new URLSearchParams();
  if (opts?.q) params.set("q", opts.q);
  const qs = params.toString();
  const res = await fetch(
    `/api/v1/corporate/capacity-metrics${qs ? `?${qs}` : ""}`,
  );
  return parse<{ items: CapacityMetricDTO[] }>(res);
}

export async function createCapacityMetricApi(body: Record<string, unknown>) {
  const res = await fetch("/api/v1/corporate/capacity-metrics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<CapacityMetricDTO>(res);
}

export async function updateCapacityMetricApi(
  id: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`/api/v1/corporate/capacity-metrics/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<CapacityMetricDTO>(res);
}

export async function deleteCapacityMetricApi(id: string) {
  const res = await fetch(`/api/v1/corporate/capacity-metrics/${id}`, {
    method: "DELETE",
  });
  return parse<CapacityMetricDTO>(res);
}

/* ── Certifications ──────────────────────────────────────────────── */

export async function fetchCertifications(opts?: { q?: string }) {
  const params = new URLSearchParams();
  if (opts?.q) params.set("q", opts.q);
  const qs = params.toString();
  const res = await fetch(
    `/api/v1/corporate/certifications${qs ? `?${qs}` : ""}`,
  );
  return parse<{ items: CertificationDTO[] }>(res);
}

export async function createCertificationApi(body: Record<string, unknown>) {
  const res = await fetch("/api/v1/corporate/certifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<CertificationDTO>(res);
}

export async function updateCertificationApi(
  id: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`/api/v1/corporate/certifications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<CertificationDTO>(res);
}

export async function deleteCertificationApi(id: string) {
  const res = await fetch(`/api/v1/corporate/certifications/${id}`, {
    method: "DELETE",
  });
  return parse<CertificationDTO>(res);
}

/* ── Sustainability ──────────────────────────────────────────────── */

export async function fetchSustainability(opts?: { q?: string }) {
  const params = new URLSearchParams();
  if (opts?.q) params.set("q", opts.q);
  const qs = params.toString();
  const res = await fetch(
    `/api/v1/corporate/sustainability${qs ? `?${qs}` : ""}`,
  );
  return parse<{ items: SustainabilityMetricDTO[] }>(res);
}

export async function createSustainabilityApi(body: Record<string, unknown>) {
  const res = await fetch("/api/v1/corporate/sustainability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<SustainabilityMetricDTO>(res);
}

export async function updateSustainabilityApi(
  id: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`/api/v1/corporate/sustainability/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<SustainabilityMetricDTO>(res);
}

export async function deleteSustainabilityApi(id: string) {
  const res = await fetch(`/api/v1/corporate/sustainability/${id}`, {
    method: "DELETE",
  });
  return parse<SustainabilityMetricDTO>(res);
}

/* ── Customer logos ──────────────────────────────────────────────── */

export async function fetchCustomerLogos(opts?: { q?: string }) {
  const params = new URLSearchParams();
  if (opts?.q) params.set("q", opts.q);
  const qs = params.toString();
  const res = await fetch(
    `/api/v1/corporate/customer-logos${qs ? `?${qs}` : ""}`,
  );
  return parse<{ items: CustomerLogoDTO[] }>(res);
}

export async function createCustomerLogoApi(body: Record<string, unknown>) {
  const res = await fetch("/api/v1/corporate/customer-logos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<CustomerLogoDTO>(res);
}

export async function updateCustomerLogoApi(
  id: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`/api/v1/corporate/customer-logos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<CustomerLogoDTO>(res);
}

export async function deleteCustomerLogoApi(id: string) {
  const res = await fetch(`/api/v1/corporate/customer-logos/${id}`, {
    method: "DELETE",
  });
  return parse<CustomerLogoDTO>(res);
}

/* ── Case studies ────────────────────────────────────────────────── */

export async function fetchCaseStudies(opts?: { q?: string }) {
  const params = new URLSearchParams();
  if (opts?.q) params.set("q", opts.q);
  const qs = params.toString();
  const res = await fetch(
    `/api/v1/corporate/case-studies${qs ? `?${qs}` : ""}`,
  );
  return parse<{ items: CaseStudyDTO[] }>(res);
}

export async function createCaseStudyApi(body: Record<string, unknown>) {
  const res = await fetch("/api/v1/corporate/case-studies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<CaseStudyDTO>(res);
}

export async function updateCaseStudyApi(
  id: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`/api/v1/corporate/case-studies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<CaseStudyDTO>(res);
}

export async function deleteCaseStudyApi(id: string) {
  const res = await fetch(`/api/v1/corporate/case-studies/${id}`, {
    method: "DELETE",
  });
  return parse<CaseStudyDTO>(res);
}

/* ── Testimonials ────────────────────────────────────────────────── */

export async function fetchTestimonials(opts?: { q?: string }) {
  const params = new URLSearchParams();
  if (opts?.q) params.set("q", opts.q);
  const qs = params.toString();
  const res = await fetch(
    `/api/v1/corporate/testimonials${qs ? `?${qs}` : ""}`,
  );
  return parse<{ items: TestimonialDTO[] }>(res);
}

export async function createTestimonialApi(body: Record<string, unknown>) {
  const res = await fetch("/api/v1/corporate/testimonials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<TestimonialDTO>(res);
}

export async function updateTestimonialApi(
  id: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`/api/v1/corporate/testimonials/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<TestimonialDTO>(res);
}

export async function deleteTestimonialApi(id: string) {
  const res = await fetch(`/api/v1/corporate/testimonials/${id}`, {
    method: "DELETE",
  });
  return parse<TestimonialDTO>(res);
}

/* ── Expansion ───────────────────────────────────────────────────── */

export async function fetchExpansionProjects(opts?: { q?: string }) {
  const params = new URLSearchParams();
  if (opts?.q) params.set("q", opts.q);
  const qs = params.toString();
  const res = await fetch(
    `/api/v1/corporate/expansion${qs ? `?${qs}` : ""}`,
  );
  return parse<{ items: ExpansionProjectDTO[] }>(res);
}

export async function createExpansionApi(body: Record<string, unknown>) {
  const res = await fetch("/api/v1/corporate/expansion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<ExpansionProjectDTO>(res);
}

export async function updateExpansionApi(
  id: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`/api/v1/corporate/expansion/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<ExpansionProjectDTO>(res);
}

export async function deleteExpansionApi(id: string) {
  const res = await fetch(`/api/v1/corporate/expansion/${id}`, {
    method: "DELETE",
  });
  return parse<ExpansionProjectDTO>(res);
}
