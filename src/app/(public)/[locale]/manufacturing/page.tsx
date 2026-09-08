import type { Metadata } from "next";

import { ManufacturingPage } from "@/features/public-site/components/content-pages";
import { CmsOrFallback } from "@/features/public-site/components/cms-or-fallback";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Manufacturing",
  description: "Plant and infrastructure.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <CmsOrFallback
      locale={locale}
      slug="manufacturing"
      fallback={<ManufacturingPage locale={locale} />}
    />
  );
}
