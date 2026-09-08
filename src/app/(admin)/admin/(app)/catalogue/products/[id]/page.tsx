import { CatalogueProductEditor } from "@/features/admin-desk/components/catalogue-product-editor";

export default async function CatalogueProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CatalogueProductEditor productId={id} />;
}
