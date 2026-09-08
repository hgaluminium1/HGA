import type { Metadata } from "next";

import { QualityPage } from "@/features/public-site/components/content-pages";
import { CmsOrFallback } from "@/features/public-site/components/cms-or-fallback";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Quality",
  description: "Quality systems and certifications.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <CmsOrFallback
      locale={locale}
      slug="quality"
      fallback={<QualityPage locale={locale} />}
    />
  );
}
