import type { Metadata } from "next";

import { SustainabilityPage } from "@/features/public-site/components/content-pages";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Sustainability",
  description: "Recycling, environment, and responsible operations.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <SustainabilityPage locale={locale} />;
}
