import type { Metadata } from "next";

import { CareersPage } from "@/features/public-site/components/content-pages";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Careers",
  description: "Join HG Aluminium — contact HR for openings.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <CareersPage locale={locale} />;
}
