import { permanentRedirect } from "next/navigation";

type PageProps = { params: Promise<{ locale: string }> };

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/products/category/ingots-alloys`);
}
