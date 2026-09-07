import type { Metadata } from "next";

import { CategoryLandingPage } from "@/features/public-site/components/content-pages";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Extrusion profiles",
  description: "Aluminium extrusion profiles for architectural, industrial and solar use.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <CategoryLandingPage
      locale={locale}
      slug="extrusion-profiles"
      title="Aluminium extrusion profiles"
      description="Architectural, industrial and solar sections from our Gujarat press lines."
      categorySlugs={["extrusion-profiles", "aluminium-extrusions"]}
    />
  );
}
