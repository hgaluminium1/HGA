import type { ProductDTO, CategoryDTO } from "@/modules/catalog";
import { productNavAllowlist } from "@/config/nav.config";
import {
  CATALOGUE_PLACEHOLDER,
  resolveMediaUrlSync,
} from "@/lib/media/resolve-media-url";

/**
 * Product hero / card image — CMS `imageUrl` only (R2 via MediaPicker).
 * No hardcoded slug→local photo maps; placeholder when unset.
 */
export function productImageUrl(
  product: Pick<ProductDTO, "slug" | "imageUrl" | "name" | "imageMediaId">,
): string {
  return (
    resolveMediaUrlSync({
      imageUrl: product.imageUrl,
      imageMediaId: product.imageMediaId,
    }) ?? CATALOGUE_PLACEHOLDER
  );
}

/**
 * Category image — prefer CMS Category.imageUrl; else placeholder.
 * Landing href keys still used only for nav teaser when category DTO unavailable.
 */
export function categoryImageUrl(
  slugOrHref: string,
  category?: Pick<CategoryDTO, "imageUrl"> | null,
): string {
  if (category?.imageUrl?.trim()) return category.imageUrl.trim();
  void slugOrHref;
  return CATALOGUE_PLACEHOLDER;
}

/** Public path for a category — flat catalogue only. */
export function categoryLandingHref(categorySlug: string): string {
  return `products/category/${categorySlug}`;
}

export function catalogueCategoryNav(
  categories?: Pick<CategoryDTO, "slug" | "imageUrl" | "name" | "description">[],
) {
  if (categories?.length) {
    return categories.map((c) => ({
      label: c.name.en,
      href: categoryLandingHref(c.slug),
      description: c.description?.en,
      imageSrc: categoryImageUrl(c.slug, c),
    }));
  }
  return productNavAllowlist.map((item) => ({
    ...item,
    imageSrc: categoryImageUrl(item.href),
  }));
}

export function formatDimensionMm(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return null;
  return `${value.toLocaleString("en-IN")} mm`;
}

export function formatWeightKg(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return null;
  return `${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })} kg/m`;
}

export { CATALOGUE_PLACEHOLDER };
