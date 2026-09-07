import type { Metadata } from "next";

import { CategoryLandingPage } from "@/features/public-site/components/content-pages";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Ingots & alloys",
  description: "Remelt aluminium ingots and upcoming cubes, shots and deoxidizer.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <CategoryLandingPage
      locale={locale}
      slug="ingots-alloys"
      title="Ingots & alloys"
      description="Secondary remelt ingots today — cubes, shots and deoxidizer in the pipeline."
      categorySlugs={["remelt-ingots", "ingots-alloys"]}
    />
  );
}
