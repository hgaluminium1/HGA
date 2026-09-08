import { CorporateCertificationsEditor } from "@/features/admin-desk/components/corporate-certifications-editor";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CorporateCertificationsEditor certificationId={id} />;
}
