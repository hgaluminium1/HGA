import { z } from "zod";

export const IMPORT_MAX_ROWS = 500;

export const importEntitySchema = z.enum([
  "products",
  "categories",
  "capacity_metrics",
  "dictionary_items",
]);

export type ImportEntity = z.infer<typeof importEntitySchema>;

export const productRowSchema = z.object({
  sku: z.string().min(1),
  name_en: z.string().min(1),
  slug: z.string().min(1),
  status: z.enum(["draft", "published"]).optional(),
  description: z.string().optional(),
});

export const categoryRowSchema = z.object({
  name_en: z.string().min(1),
  slug: z.string().min(1),
  parent_slug: z.string().optional(),
});

export const capacityMetricRowSchema = z.object({
  key: z.string().min(1),
  label_en: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().optional(),
  category: z.enum([
    "extrusion",
    "billet",
    "ingot",
    "melting",
    "press",
    "dimension",
    "commercial",
  ]),
  verification_status: z
    .enum(["draft", "needs_verification", "verified"])
    .optional(),
  publish_status: z.enum(["hidden", "published"]).optional(),
});

export const dictionaryItemRowSchema = z.object({
  dictionary_key: z.enum([
    "alloy_grade",
    "temper",
    "surface_finish",
    "anodizing_color",
    "ral_color",
    "tolerance_standard",
    "packaging",
  ]),
  value: z.string().min(1),
  label_en: z.string().min(1),
  sort_order: z.coerce.number().optional(),
});

export function schemaForEntity(entity: ImportEntity) {
  switch (entity) {
    case "products":
      return productRowSchema;
    case "categories":
      return categoryRowSchema;
    case "capacity_metrics":
      return capacityMetricRowSchema;
    case "dictionary_items":
      return dictionaryItemRowSchema;
  }
}
