import type { Metadata } from "next";

import { PageShell } from "@/components/templates/page-shell";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Manufacturing & Infrastructure",
  description: "Plants, capacity, and production infrastructure.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="Manufacturing & Infrastructure"
      description="Plants, capacity, and production infrastructure."
    />
  );
}
