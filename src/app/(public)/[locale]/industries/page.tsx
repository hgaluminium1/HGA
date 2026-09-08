import type { Metadata } from "next";

import { IndustriesPage } from "@/features/public-site/components/content-pages";
import { CmsOrFallback } from "@/features/public-site/components/cms-or-fallback";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Industries",
  description: "Markets and applications we serve.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <CmsOrFallback
      locale={locale}
      slug="industries"
      fallback={<IndustriesPage locale={locale} />}
    />
  );
}
