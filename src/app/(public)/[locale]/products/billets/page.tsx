import { permanentRedirect } from "next/navigation";

type PageProps = { params: Promise<{ locale: string }> };

/** Legacy landing → dynamic category route */
export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/products/category/billets`);
}
