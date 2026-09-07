import type { Metadata } from "next";

import { ManufacturingPage } from "@/features/public-site/components/content-pages";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Manufacturing",
  description: "Plant, process, and production infrastructure.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <ManufacturingPage locale={locale} />;
}
