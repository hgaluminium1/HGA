import type { Metadata } from "next";

import { JourneyPage } from "@/features/public-site/components/content-pages";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Our journey",
  description: "Milestones in HG Aluminium’s growth story.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <JourneyPage locale={locale} />;
}
