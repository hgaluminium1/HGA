import type { Metadata } from "next";

import { IndustriesPage } from "@/features/public-site/components/content-pages";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Industries",
  description: "Markets and applications we serve with aluminium.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <IndustriesPage locale={locale} />;
}
