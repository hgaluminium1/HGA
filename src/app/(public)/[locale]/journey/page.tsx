import type { Metadata } from "next";

import { CmsPageView } from "@/features/public-site";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Our journey",
  description:
    "From incorporation to a growing extrusion and remelt platform in Gujarat.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <CmsPageView locale={locale} slug="journey" />;
}
