import type { Metadata } from "next";

import { ResourcesPage } from "@/features/public-site/components/content-pages";
import { CmsOrFallback } from "@/features/public-site/components/cms-or-fallback";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Resources",
  description: "Downloads and resources.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <CmsOrFallback
      locale={locale}
      slug="resources"
      fallback={<ResourcesPage locale={locale} />}
    />
  );
}
