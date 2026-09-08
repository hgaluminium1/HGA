import { CmsPageView } from "@/features/public-site/components/cms-page-view";
import { getCachedPublishedPage } from "@/features/public-site/lib/public-cache";

/**
 * Marketing routes prefer a published CMS page by slug.
 * Falls back to built-in React content while the client migrates copy into Admin → Pages.
 */
export async function CmsOrFallback({
  locale,
  slug,
  fallback,
}: {
  locale: string;
  slug: string;
  fallback: React.ReactNode;
}) {
  const page = await getCachedPublishedPage(slug, locale);
  if (page && page.blocks.length > 0) {
    return <CmsPageView locale={locale} slug={slug} />;
  }
  return <>{fallback}</>;
}
