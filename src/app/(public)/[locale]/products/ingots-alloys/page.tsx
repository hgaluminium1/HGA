import type { Metadata } from "next";

import { PageShell } from "@/components/templates/page-shell";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Aluminium Ingots / Alloys",
  description: "Liquid and solid alloy products to LME-grade specs.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="Aluminium Ingots / Alloys"
      description="Liquid and solid alloy products to LME-grade specs."
    />
  );
}
