import type { Metadata } from "next";

import { ContactPage } from "@/features/public-site/components/content-pages";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
};

export const metadata: Metadata = {
  title: "Contact / RFQ",
  description: "Enquire about alloys, capacity, or partnerships.",
};

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { product } = await searchParams;
  return <ContactPage locale={locale} defaultProduct={product} />;
}
