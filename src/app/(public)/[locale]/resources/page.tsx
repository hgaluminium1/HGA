import type { Metadata } from "next";

import { PageShell } from "@/components/templates/page-shell";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Resources / Downloads",
  description: "Spec sheets, brochures, and downloadable resources.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="Resources / Downloads"
      description="Spec sheets, brochures, and downloadable resources."
    />
  );
}
