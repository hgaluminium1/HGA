import type { Metadata } from "next";

import { PageShell } from "@/components/templates/page-shell";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Careers",
  description: "Life at HG and open opportunities.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="Careers"
      description="Life at HG and open opportunities."
    />
  );
}
