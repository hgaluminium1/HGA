import type { Metadata } from "next";

import { ProductDetail } from "@/features/public-catalog";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug,
    description: "Product details from the HG catalogue.",
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;
  return <ProductDetail locale={locale} slug={slug} />;
}
