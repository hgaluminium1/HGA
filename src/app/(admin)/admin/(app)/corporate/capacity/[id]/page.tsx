import { CorporateCapacityEditor } from "@/features/admin-desk/components/corporate-capacity-editor";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CorporateCapacityEditor metricId={id} />;
}
