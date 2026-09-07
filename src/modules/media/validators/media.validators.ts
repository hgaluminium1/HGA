import { z } from "zod";

export const mediaKindSchema = z.enum([
  "image",
  "video",
  "pdf",
  "profile_drawing",
]);

export const mediaLocationSchema = z.enum([
  "hg_factory",
  "metal_touch",
  "office",
  "other",
]);

export const updateMediaSchema = z.object({
  kind: mediaKindSchema.optional(),
  tags: z.array(z.string()).optional(),
  alt: z.object({ en: z.string() }).optional(),
  caption: z.object({ en: z.string() }).optional(),
  videoUrl: z.string().nullable().optional(),
  location: mediaLocationSchema.optional(),
  version: z.number().int(),
});
