import type { Metadata } from "next";

import { ProcurementPage } from "@/features/public-site/components/content-pages";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Procurement",
  description: "Buyer path for domestic and export aluminium programmes.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <ProcurementPage locale={locale} />;
}
