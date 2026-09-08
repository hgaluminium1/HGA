import { CorporateSustainabilityEditor } from "@/features/admin-desk/components/corporate-sustainability-editor";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CorporateSustainabilityEditor metricId={id} />;
}
