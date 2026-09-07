import { ProductEditor } from "@/features/admin-catalog/components/product-editor";

type Props = { params: Promise<{ id: string }> };

export default async function AdminProductEditorRoute({ params }: Props) {
  const { id } = await params;
  return <ProductEditor productId={id} />;
}
