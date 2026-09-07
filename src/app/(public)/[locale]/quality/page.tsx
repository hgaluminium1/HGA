import type { Metadata } from "next";

import { QualityPage } from "@/features/public-site/components/content-pages";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Quality",
  description: "Quality systems, certifications, and process control.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <QualityPage locale={locale} />;
}
