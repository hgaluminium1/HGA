import type { Metadata } from "next";

import { SustainabilityPage } from "@/features/public-site/components/content-pages";
import { CmsOrFallback } from "@/features/public-site/components/cms-or-fallback";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Sustainability",
  description: "ESG and sustainability.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <CmsOrFallback
      locale={locale}
      slug="sustainability"
      fallback={<SustainabilityPage locale={locale} />}
    />
  );
}
