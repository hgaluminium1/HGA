import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateCareers } from "@/lib/cms/revalidate-pages";
import {
  createOpening,
  createOpeningSchema,
  listOpenings,
} from "@/modules/careers";

export async function GET(req: Request) {
  const authz = await authorize("corporate.read");
  if ("error" in authz) return authz.error;
  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");
  const status =
    statusParam === "draft" ||
    statusParam === "published" ||
    statusParam === "all"
      ? statusParam
      : "all";
  const data = await listOpenings({
    q: url.searchParams.get("q") ?? undefined,
    department: url.searchParams.get("department") ?? undefined,
    status,
    includeDeleted: url.searchParams.get("trash") === "1",
  });
  return respondSuccess(data);
}

export async function POST(req: Request) {
  const authz = await authorize("corporate.write");
  if ("error" in authz) return authz.error;
  try {
    const body = await req.json();
    const parsed = createOpeningSchema.parse(body);
    const opening = await createOpening(parsed);
    revalidateCareers();
    return respondSuccess(opening);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
