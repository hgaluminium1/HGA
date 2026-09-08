import type { Metadata } from "next";

import { CmsPageView } from "@/features/public-site";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Request datasheets, certificate samples and technical packs for your RFQ.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <CmsPageView locale={locale} slug="resources" />;
}
