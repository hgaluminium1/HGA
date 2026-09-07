import type { Metadata } from "next";

import { CapacityPage } from "@/features/public-corporate";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Capacity",
  description: "Verified production capacity metrics.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <CapacityPage locale={locale} />;
}
