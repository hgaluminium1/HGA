import { LeadDetail } from "@/features/admin-desk/components/lead-detail";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminLeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <LeadDetail id={id} />;
}
