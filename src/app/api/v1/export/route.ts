import { authorize } from "@/modules/identity";
import { respondError } from "@/lib/http/respond";
import {
  exportEntityCsv,
  importEntitySchema,
} from "@/modules/import";

export async function GET(req: Request) {
  const authz = await authorize("import.write");
  if ("error" in authz) return authz.error;
  try {
    const url = new URL(req.url);
    const entity = importEntitySchema.parse(url.searchParams.get("entity"));
    const csv = await exportEntityCsv(entity);
    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${entity}.csv"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
