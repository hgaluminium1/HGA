import { CmsPageBlocks } from "@/features/public-home/lib/block-registry";
import { CmsEmptyState } from "@/features/public-site/components/cms-empty-state";
import { getCachedPublishedPage } from "@/features/public-site/lib/public-cache";

type CmsPageViewProps = {
  locale: string;
  slug: string;
};

export async function CmsPageView({ locale, slug }: CmsPageViewProps) {
  const page = await getCachedPublishedPage(slug, locale);
  if (!page || page.blocks.length === 0) {
    return <CmsEmptyState locale={locale} />;
  }
  return <CmsPageBlocks blocks={page.blocks} locale={locale} />;
}
