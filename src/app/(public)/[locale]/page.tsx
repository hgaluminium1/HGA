import { CmsPageView } from "@/features/public-site";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PublicHomeRoute({ params }: PageProps) {
  const { locale } = await params;
  return <CmsPageView locale={locale} slug="home" />;
}
