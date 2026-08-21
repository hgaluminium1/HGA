import type { Metadata } from "next";

import { PageShell } from "@/components/templates/page-shell";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Quality & Certifications",
  description: "Quality systems, labs, and certifications.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="Quality & Certifications"
      description="Quality systems, labs, and certifications."
    />
  );
}
