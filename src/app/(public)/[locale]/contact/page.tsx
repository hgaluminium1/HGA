import type { Metadata } from "next";

import { PageShell } from "@/components/templates/page-shell";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Contact Us / RFQ",
  description: "Reach HG Aluminium or submit an RFQ.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="Contact Us / RFQ"
      description="Reach HG Aluminium or submit an RFQ."
    />
  );
}
