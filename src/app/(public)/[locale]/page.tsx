import { HomePage } from "@/features/public-home";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PublicHomeRoute({ params }: PageProps) {
  const { locale } = await params;
  return <HomePage locale={locale} />;
}
