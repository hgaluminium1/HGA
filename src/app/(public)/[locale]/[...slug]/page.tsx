import { CmsPageView } from "@/features/public-site";

type PageProps = {
  params: Promise<{ locale: string; slug: string[] }>;
};

export default async function PublicCmsCatchAll({ params }: PageProps) {
  const { locale, slug } = await params;
  return <CmsPageView locale={locale} slug={slug.join("/")} />;
}
