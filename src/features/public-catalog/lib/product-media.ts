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

/** Map CMS category slug → public landing href when one exists. */
export function categoryLandingHref(categorySlug: string): string | null {
  const legacy: Record<string, string> = {
    "remelt-ingots": "products/category/ingots-alloys",
    "ingots-alloys": "products/category/ingots-alloys",
    cubes: "products/category/ingots-alloys",
    shots: "products/category/ingots-alloys",
    deoxidizer: "products/category/ingots-alloys",
    "homogenised-billets": "products/category/billets",
    billets: "products/category/billets",
    "extrusion-profiles": "products/category/extrusion-profiles",
    "aluminium-extrusions": "products/category/extrusion-profiles",
  };
  if (legacy[categorySlug]) return legacy[categorySlug];
  return `products/category/${categorySlug}`;
}

export function catalogueCategoryNav(
  categories?: Pick<CategoryDTO, "slug" | "imageUrl" | "name">[],
) {
  return productNavAllowlist.map((item) => {
    const slugTail = item.href.replace(/^products\//, "");
    const match = categories?.find(
      (c) =>
        categoryLandingHref(c.slug) === item.href ||
        c.slug === slugTail ||
        c.name.en.toLowerCase().includes(item.label.toLowerCase().slice(0, 6)),
    );
    return {
      ...item,
      imageSrc: categoryImageUrl(item.href, match),
    };
  });
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
