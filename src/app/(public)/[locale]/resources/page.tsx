import type { Metadata } from "next";

import { ResourcesPage } from "@/features/public-site/components/content-pages";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Resources",
  description: "Request datasheets, certificates, and technical packs.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <ResourcesPage locale={locale} />;
}
