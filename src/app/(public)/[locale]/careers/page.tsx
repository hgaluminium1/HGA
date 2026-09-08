import type { Metadata } from "next";

import { CareersPage } from "@/features/public-site/components/content-pages";
import { CmsOrFallback } from "@/features/public-site/components/cms-or-fallback";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Careers",
  description: "Careers at HG Aluminium.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <CmsOrFallback
      locale={locale}
      slug="careers"
      fallback={<CareersPage locale={locale} />}
    />
  );
}
