import type { Metadata } from "next";

import { CmsPageView } from "@/features/public-site";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Procurement & Export",
  description:
    "Buyer path for domestic programmes and export enquiries — contacts and next steps.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <CmsPageView locale={locale} slug="procurement" />;
}
