import type { Metadata } from "next";

import { PageShell } from "@/components/templates/page-shell";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Our Journey / Company Profile",
  description: "The HG story — milestones, growth, and company profile.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="Our Journey / Company Profile"
      description="The HG story — milestones, growth, and company profile."
    />
  );
}
