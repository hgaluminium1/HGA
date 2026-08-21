import type { Metadata } from "next";

import { PageShell } from "@/components/templates/page-shell";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Industries & Applications",
  description:
    "Where HG alloys power automotive and engineering supply chains.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <PageShell
      locale={locale}
      title="Industries & Applications"
      description="Where HG alloys power automotive and engineering supply chains."
    />
  );
}
