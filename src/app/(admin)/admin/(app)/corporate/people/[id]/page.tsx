import { CorporatePeopleEditor } from "@/features/admin-desk/components/corporate-people-editor";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CorporatePeopleEditor personId={id} />;
}
