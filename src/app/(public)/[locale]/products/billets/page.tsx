import type { Metadata } from "next";

import { CategoryLandingPage } from "@/features/public-site/components/content-pages";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Billets",
  description: "Homogenised aluminium billets for downstream extrusion.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <CategoryLandingPage
      locale={locale}
      slug="billets"
      title="Homogenised billets"
      description="Cast and homogenised extrusion billets for captive and merchant programmes."
      categorySlugs={["homogenised-billets", "billets"]}
    />
  );
}
