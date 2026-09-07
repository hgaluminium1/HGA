import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateCorporate } from "@/lib/cms/revalidate-pages";
import {
  createSustainabilityMetric,
  createSustainabilityMetricSchema,
  listSustainabilityMetrics,
} from "@/modules/corporate";

export async function GET(req: Request) {
  const authz = await authorize("corporate.read");
  if ("error" in authz) return authz.error;
  const url = new URL(req.url);
  const data = await listSustainabilityMetrics({
    q: url.searchParams.get("q") ?? undefined,
    includeDeleted: url.searchParams.get("trash") === "1",
  });
  return respondSuccess(data);
}

export async function POST(req: Request) {
  const authz = await authorize("corporate.write");
  if ("error" in authz) return authz.error;
  try {
    const body = await req.json();
    const parsed = createSustainabilityMetricSchema.parse(body);
    const metric = await createSustainabilityMetric(parsed);
    revalidateCorporate();
    return respondSuccess(metric);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
