import type { Metadata } from "next";

import { AboutPage } from "@/features/public-site/components/content-pages";
import { CmsOrFallback } from "@/features/public-site/components/cms-or-fallback";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "About HG",
  description:
    "Company overview, identity, and what HG Aluminium stands for.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <CmsOrFallback
      locale={locale}
      slug="about"
      fallback={<AboutPage locale={locale} />}
    />
  );
}
