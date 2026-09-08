import type { Metadata } from "next";

import { CmsPageView } from "@/features/public-site";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "Secondary pathways, responsible operations and disclosure-tiered metrics.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <CmsPageView locale={locale} slug="sustainability" />;
}
