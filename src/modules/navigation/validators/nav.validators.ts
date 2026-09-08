import { z } from "zod";

export const navMenuKeySchema = z.enum([
  "footer-products",
  "footer-company",
  "footer-support",
  "primary",
]);

export const navMenuItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().nonnegative().default(0),
});

export const upsertNavMenuSchema = z.object({
  key: navMenuKeySchema,
  title: z.string().min(1),
  locale: z.string().default("en"),
  items: z.array(navMenuItemSchema),
  status: z.enum(["draft", "published"]).optional(),
  version: z.number().int().optional(),
});
