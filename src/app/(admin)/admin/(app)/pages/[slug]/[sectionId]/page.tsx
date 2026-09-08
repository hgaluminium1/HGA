import { SectionWorkspace } from "@/features/admin-desk/components/section-workspace";

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ slug: string; sectionId: string }>;
}) {
  const { slug, sectionId } = await params;
  return <SectionWorkspace slug={slug} sectionId={sectionId} />;
}
