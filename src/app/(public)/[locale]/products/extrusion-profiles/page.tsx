import type { Metadata } from "next";

import { PageShell } from "@/components/templates/page-shell";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Aluminium Extrusion Profiles",
  description: "Extrusion profiles engineered for industrial applications.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="Aluminium Extrusion Profiles"
      description="Extrusion profiles engineered for industrial applications."
    />
  );
}
