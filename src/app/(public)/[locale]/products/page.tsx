import type { Metadata } from "next";

import { PageShell } from "@/components/templates/page-shell";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Products – Overview",
  description: "Explore our recycled aluminium and zinc product lines.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="Products – Overview"
      description="Explore our recycled aluminium and zinc product lines."
    />
  );
}
