import type { BlockType } from "@/modules/cms/browser";

/** Block types with editable CMS payload in the page document. */
export const EDITABLE_CMS_BLOCK_TYPES = new Set<BlockType>([
  "hero",
  "capability",
  "products",
  "upcoming-products",
  "mission",
  "cta-banner",
  "testimonials",
  "customers",
  "joint-ventures",
  "careers-teaser",
  "faq",
]);

/** Blocks hydrated from catalogue / corporate entities — honesty panel only. */
export function isEntityHydratedBlock(type: BlockType): boolean {
  return !EDITABLE_CMS_BLOCK_TYPES.has(type);
}
