import type { Metadata } from "next";

import { PageShell } from "@/components/templates/page-shell";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "About HG",
  description:
    "Company overview, leadership, and what HG Aluminium stands for.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="About HG"
      description="Company overview, leadership, and what HG Aluminium stands for."
    />
  );
}
