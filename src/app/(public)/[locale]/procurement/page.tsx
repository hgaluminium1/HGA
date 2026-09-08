import type { Metadata } from "next";

import { ProcurementPage } from "@/features/public-site/components/content-pages";
import { CmsOrFallback } from "@/features/public-site/components/cms-or-fallback";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Procurement",
  description: "Global procurement and export.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <CmsOrFallback
      locale={locale}
      slug="procurement"
      fallback={<ProcurementPage locale={locale} />}
    />
  );
}
