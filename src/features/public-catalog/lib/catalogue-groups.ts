import type { CategoryDTO, ProductDTO } from "@/modules/catalog";

export type CategoryWithProducts = {
  category: CategoryDTO;
  products: ProductDTO[];
};

/** Flat catalogue: each published category owns its products (Category → N). */
export function groupProductsByCategory(
  categories: CategoryDTO[],
  products: ProductDTO[],
): CategoryWithProducts[] {
  const published = categories
    .filter((c) => c.status === "published" && !c.deletedAt)
    .sort((a, b) => a.order - b.order || a.name.en.localeCompare(b.name.en));

  return published.map((category) => ({
    category,
    products: products.filter((p) => p.categoryIds.includes(category.id)),
  }));
}

export function categoryPublicHref(slug: string) {
  return `products/category/${slug}`;
}

/** Prefer first assigned category — catalogue is one category per product. */
export function primaryCategoryId(product: Pick<ProductDTO, "categoryIds">) {
  return product.categoryIds[0] ?? null;
}
