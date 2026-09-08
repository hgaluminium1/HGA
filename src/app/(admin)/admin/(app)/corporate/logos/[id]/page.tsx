import { CorporateLogosEditor } from "@/features/admin-desk/components/corporate-logos-editor";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CorporateLogosEditor logoId={id} />;
}
