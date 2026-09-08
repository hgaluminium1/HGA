import type { Metadata } from "next";

import { JourneyPage } from "@/features/public-site/components/content-pages";
import { CmsOrFallback } from "@/features/public-site/components/cms-or-fallback";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Our journey",
  description: "Company journey and milestones.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <CmsOrFallback
      locale={locale}
      slug="journey"
      fallback={<JourneyPage locale={locale} />}
    />
  );
}
