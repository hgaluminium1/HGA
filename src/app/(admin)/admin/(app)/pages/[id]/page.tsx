import { PageEditor } from "@/features/admin-pages/components/page-editor";

type Props = { params: Promise<{ id: string }> };

export default async function AdminPageEditorRoute({ params }: Props) {
  const { id } = await params;
  return <PageEditor pageId={id} />;
}
