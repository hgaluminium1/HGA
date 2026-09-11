import { unstable_cache } from "next/cache";

import { publicPages } from "@/config/nav.config";
import { categoryLandingHref } from "@/features/public-catalog/lib/product-media";
import type { SearchIndexItem } from "@/features/public-site/lib/search-index-shared";
import { listPublishedOpenings } from "@/modules/careers";
import { listCategoriesFlat, listPublishedProducts } from "@/modules/catalog";
import { getPublishedPageBySlug } from "@/modules/cms";

export type { SearchIndexItem, SearchResultType } from "@/features/public-site/lib/search-index-shared";
export { filterSearchIndex } from "@/features/public-site/lib/search-index-shared";

const cacheDisabled =
  process.env.DISABLE_CMS_CACHE === "1" ||
  process.env.NODE_ENV === "development";

async function buildSearchIndex(locale: string): Promise<SearchIndexItem[]> {
  const items: SearchIndexItem[] = [];

  const pageChecks = await Promise.all(
    publicPages.map(async (page) => {
      if (!page.slug) {
        return {
          id: `page-home`,
          type: "page" as const,
          title: page.title,
          description: page.description,
          href: "",
          keywords: ["home", "hg", "aluminium"],
        };
      }
      const corporateOnly = new Set([
        "leadership",
        "capacity",
        "customers",
        "expansion",
        "products",
        "chairmans-message",
        "contact",
        "careers",
      ]);
      if (corporateOnly.has(page.slug)) {
        return {
          id: `page-${page.slug}`,
          type: "page" as const,
          title: page.title,
          description: page.description,
          href: page.slug,
          keywords: [page.slug, page.title.toLowerCase()],
        };
      }
      const live = await getPublishedPageBySlug(page.slug, locale).catch(
        () => null,
      );
      if (!live) return null;
      return {
        id: `page-${page.slug}`,
        type: "page" as const,
        title: page.title,
        description: page.description,
        href: page.slug,
        keywords: [page.slug, page.title.toLowerCase()],
      };
    }),
  );
  for (const p of pageChecks) {
    if (p) items.push(p);
  }

  if (!items.some((i) => i.href === "chairmans-message")) {
    items.push({
      id: "page-chairmans-message",
      type: "page",
      title: "Chairman’s Message",
      description: "Message from the Chairman",
      href: "chairmans-message",
      keywords: ["chairman", "message", "leadership"],
    });
  }

  const [products, categories, openingsResult] = await Promise.all([
    listPublishedProducts({ upcoming: "all", limit: 100 }).catch(() => ({
      items: [] as Awaited<ReturnType<typeof listPublishedProducts>>["items"],
    })),
    listCategoriesFlat().catch(() => []),
    listPublishedOpenings().catch(() => ({ items: [] })),
  ]);

  for (const product of products.items) {
    const name = product.name?.en?.trim() || product.slug;
    items.push({
      id: `product-${product.id}`,
      type: "product",
      title: name,
      description: product.sku
        ? `SKU ${product.sku}${product.isUpcoming ? " · Coming soon" : ""}`
        : product.isUpcoming
          ? "Coming soon"
          : "Product",
      href: `products/${product.slug}`,
      keywords: [
        product.slug,
        product.sku ?? "",
        name.toLowerCase(),
        "product",
        "catalogue",
      ].filter(Boolean),
    });
  }

  for (const cat of categories) {
    if (cat.status !== "published" || cat.deletedAt) continue;
    const name = cat.name?.en?.trim() || cat.slug;
    items.push({
      id: `category-${cat.id}`,
      type: "category",
      title: name,
      description: cat.description?.en?.trim() || "Product category",
      href: categoryLandingHref(cat.slug),
      keywords: [cat.slug, name.toLowerCase(), "category", "catalogue"],
    });
  }

  for (const role of openingsResult.items) {
    items.push({
      id: `career-${role.id}`,
      type: "career",
      title: role.title,
      description: `${String(role.department).replace(/_/g, " ")} · Open role`,
      href: "careers#open-roles",
      keywords: [
        role.slug,
        role.title.toLowerCase(),
        String(role.department),
        "career",
        "job",
        "hiring",
      ],
    });
  }

  return items;
}

export function getCachedSearchIndex(locale = "en") {
  if (cacheDisabled) return buildSearchIndex(locale);
  return unstable_cache(
    () => buildSearchIndex(locale),
    ["public-search-index", locale],
    {
      tags: ["pages", "products", "careers", "corporate"],
      revalidate: 60,
    },
  )();
}
