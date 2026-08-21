import type { Metadata } from "next";

import { PageShell } from "@/components/templates/page-shell";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Global Procurement & Export",
  description: "Procurement partnerships and export capability.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="Global Procurement & Export"
      description="Procurement partnerships and export capability."
    />
  );
}
