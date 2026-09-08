import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import {
  revalidateCapacity,
  revalidateCorporate,
  revalidateProducts,
} from "@/lib/cms/revalidate-pages";
import {
  commitImportRows,
  importEntitySchema,
  parseCsvText,
  validateImportRows,
  type ImportEntity,
} from "@/modules/import";

export async function POST(req: Request) {
  const authz = await authorize("import.write");
  if ("error" in authz) return authz.error;
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let entity: ImportEntity;
    let mode: "dry-run" | "commit";
    let rows: Record<string, unknown>[];

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      entity = importEntitySchema.parse(form.get("entity"));
      mode = form.get("mode") === "commit" ? "commit" : "dry-run";
      const file = form.get("file");
      if (!(file instanceof File)) {
        return respondError("VALIDATION_ERROR", "file is required", 400);
      }
      const text = await file.text();
      rows = parseCsvText(text);
    } else {
      const body = await req.json();
      entity = importEntitySchema.parse(body.entity);
      mode = body.mode === "commit" ? "commit" : "dry-run";
      rows = Array.isArray(body.rows) ? body.rows : [];
    }

    if (mode === "dry-run") {
      const preview = validateImportRows(entity, rows);
      return respondSuccess({ mode, entity, ...preview });
    }

    const result = await commitImportRows(entity, rows);
    if (entity === "products" || entity === "categories") revalidateProducts();
    if (entity === "capacity_metrics") {
      revalidateCorporate();
      revalidateCapacity();
    }
    return respondSuccess({ mode, entity, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Import failed";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
