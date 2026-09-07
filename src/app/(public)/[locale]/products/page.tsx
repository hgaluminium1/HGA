import type { Metadata } from "next";

import { ProductsIndex } from "@/features/public-catalog";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Products",
  description: "Explore our recycled aluminium and zinc product lines.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <ProductsIndex locale={locale} />;
}
