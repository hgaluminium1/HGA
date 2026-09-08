import { CareersOpeningEditor } from "@/features/admin-desk/components/careers-opening-editor";

export default async function AdminCareersDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CareersOpeningEditor openingId={id} />;
}
