import type { Metadata } from "next";

import { PageShell } from "@/components/templates/page-shell";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Sustainability / ESG",
  description: "Recycling impact, ESG commitments, and responsible growth.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="Sustainability / ESG"
      description="Recycling impact, ESG commitments, and responsible growth."
    />
  );
}
