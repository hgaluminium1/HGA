import {
  IMPORT_MAX_ROWS,
  addDictionaryItem,
  createCategory,
  createProduct,
  getDictionary,
  importEntitySchema,
  listCategoriesFlat,
  schemaForEntity,
  type ImportEntity,
} from "@/modules/catalog";
import {
  createCapacityMetric,
  listCapacityMetrics,
} from "@/modules/corporate";

export type RowResult = {
  row: number;
  ok: boolean;
  errors?: string[];
  data?: Record<string, unknown>;
};

function parseCsv(text: string): Record<string, string>[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]!).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = (cells[i] ?? "").trim();
    });
    return row;
  });
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

export function validateImportRows(
  entity: ImportEntity,
  rows: Record<string, unknown>[],
): { results: RowResult[]; validCount: number; errorCount: number } {
  if (rows.length > IMPORT_MAX_ROWS) {
    throw new Error(`Too many rows (max ${IMPORT_MAX_ROWS})`);
  }
  const schema = schemaForEntity(entity);
  const results: RowResult[] = [];
  let validCount = 0;
  let errorCount = 0;
  rows.forEach((raw, idx) => {
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      errorCount++;
      results.push({
        row: idx + 2,
        ok: false,
        errors: parsed.error.issues.map(
          (i) => `${i.path.join(".")}: ${i.message}`,
        ),
      });
    } else {
      validCount++;
      results.push({
        row: idx + 2,
        ok: true,
        data: parsed.data as Record<string, unknown>,
      });
    }
  });
  return { results, validCount, errorCount };
}

export async function commitImportRows(
  entity: ImportEntity,
  rows: Record<string, unknown>[],
) {
  const { results } = validateImportRows(entity, rows);
  const committed: number[] = [];
  const failed: RowResult[] = [];

  for (const r of results) {
    if (!r.ok || !r.data) {
      failed.push(r);
      continue;
    }
    try {
      switch (entity) {
        case "products": {
          const d = r.data as {
            sku: string;
            name_en: string;
            slug: string;
            status?: "draft" | "published";
            description?: string;
          };
          await createProduct({
            sku: d.sku,
            name: { en: d.name_en },
            slug: d.slug,
            status: d.status,
            description: d.description,
            categoryIds: [],
            alloyGrades: [],
            tempers: [],
            surfaceFinishes: [],
            anodizingColors: [],
            ralColors: [],
            toleranceStandards: [],
            packaging: [],
            blocks: [],
          });
          break;
        }
        case "categories": {
          const d = r.data as {
            name_en: string;
            slug: string;
            parent_slug?: string;
          };
          let parentId: string | null = null;
          if (d.parent_slug) {
            const items = await listCategoriesFlat({});
            const parent = items.find((c) => c.slug === d.parent_slug);
            if (!parent) throw new Error(`parent_slug not found: ${d.parent_slug}`);
            parentId = parent.id;
          }
          await createCategory({
            name: { en: d.name_en },
            slug: d.slug,
            parentId,
          });
          break;
        }
        case "capacity_metrics": {
          const d = r.data as {
            key: string;
            label_en: string;
            value: string;
            unit?: string;
            category:
              | "extrusion"
              | "billet"
              | "ingot"
              | "melting"
              | "press"
              | "dimension"
              | "commercial";
            verification_status?: "draft" | "needs_verification" | "verified";
            publish_status?: "hidden" | "published";
          };
          await createCapacityMetric({
            key: d.key,
            label: { en: d.label_en },
            value: d.value,
            unit: d.unit ?? "",
            category: d.category,
            verificationStatus: d.verification_status ?? "draft",
            publishStatus: d.publish_status ?? "hidden",
            sourceNote: "CSV import",
            displayOrder: 0,
          });
          break;
        }
        case "dictionary_items": {
          const d = r.data as {
            dictionary_key:
              | "alloy_grade"
              | "temper"
              | "surface_finish"
              | "anodizing_color"
              | "ral_color"
              | "tolerance_standard"
              | "packaging";
            value: string;
            label_en: string;
            sort_order?: number;
          };
          const dict = await getDictionary(d.dictionary_key);
          if (!dict) throw new Error(`Dictionary not found: ${d.dictionary_key}`);
          const result = await addDictionaryItem({
            key: d.dictionary_key,
            version: dict.version,
            item: {
              value: d.value,
              label: { en: d.label_en },
              sortOrder: d.sort_order ?? 0,
              active: true,
            },
          });
          if ("error" in result) throw new Error(String(result.error));
          break;
        }
      }
      committed.push(r.row);
    } catch (err) {
      failed.push({
        row: r.row,
        ok: false,
        errors: [err instanceof Error ? err.message : "Commit failed"],
      });
    }
  }

  return { committed: committed.length, failed, results };
}

export function parseCsvText(text: string) {
  return parseCsv(text);
}

export { importEntitySchema, IMPORT_MAX_ROWS };
export type { ImportEntity };

export async function exportEntityCsv(entity: ImportEntity): Promise<string> {
  switch (entity) {
    case "capacity_metrics": {
      const { items } = await listCapacityMetrics({});
      const header = "key,label_en,value,unit,category,verification_status,publish_status";
      const lines = items.map(
        (m) =>
          `${csv(m.key)},${csv(m.label.en)},${csv(m.value)},${csv(m.unit)},${csv(m.category)},${csv(m.verificationStatus)},${csv(m.publishStatus)}`,
      );
      return [header, ...lines].join("\n");
    }
    default:
      return "message\nExport for this entity uses current admin list filters — implement filter export in UI.";
  }
}

function csv(v: string) {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}
