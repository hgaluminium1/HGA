import { unstable_cache } from "next/cache";

import {
  getPublishedPageBySlug,
  type PageDTO,
} from "@/modules/cms";
import {
  getPublishedProductBySlug,
  listPublishedProducts,
  type ProductDTO,
} from "@/modules/catalog";

const cacheDisabled =
  process.env.DISABLE_CMS_CACHE === "1" ||
  process.env.NODE_ENV === "development";

export function getCachedPublishedPage(
  slug: string,
  locale = "en",
): Promise<PageDTO | null> {
  if (cacheDisabled) return getPublishedPageBySlug(slug, locale);
  return unstable_cache(
    () => getPublishedPageBySlug(slug, locale),
    ["published-page", slug, locale],
    { tags: ["pages"], revalidate: 60 },
  )();
}

export function getCachedPublishedProducts(opts: {
  q?: string;
  cursor?: string;
  limit?: number;
  categoryId?: string;
  categoryIds?: string[];
  upcoming?: boolean | "all";
} = {}): Promise<{ items: ProductDTO[]; nextCursor: string | null }> {
  if (cacheDisabled) {
    return listPublishedProducts(opts).then((result) => ({
      items: result.items,
      nextCursor: result.nextCursor ?? null,
    }));
  }
  const key = [
    "published-products",
    opts.q ?? "",
    opts.cursor ?? "",
    String(opts.limit ?? 20),
    opts.categoryId ?? "",
    (opts.categoryIds ?? []).join(","),
    String(opts.upcoming ?? false),
  ];
  return unstable_cache(
    async () => {
      const result = await listPublishedProducts(opts);
      return {
        items: result.items,
        nextCursor: result.nextCursor ?? null,
      };
    },
    key,
    { tags: ["products"], revalidate: 60 },
  )();
}

export function getCachedUpcomingProducts(opts: { limit?: number } = {}) {
  return getCachedPublishedProducts({ ...opts, upcoming: true });
}

export function getCachedPublishedProductBySlug(
  slug: string,
): Promise<ProductDTO | null> {
  if (cacheDisabled) return getPublishedProductBySlug(slug);
  return unstable_cache(
    () => getPublishedProductBySlug(slug),
    ["published-product", slug],
    { tags: ["products"], revalidate: 60 },
  )();
}
