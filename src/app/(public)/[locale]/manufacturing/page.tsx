import type { Metadata } from "next";

import { CmsPageView } from "@/features/public-site";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Infrastructure",
  description:
    "Integrated melting, casting and extrusion at the Kadi / Mahesana campus.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <CmsPageView locale={locale} slug="manufacturing" />;
}
