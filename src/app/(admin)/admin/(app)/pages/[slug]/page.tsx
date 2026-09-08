import { PageSectionsList } from "@/features/admin-desk/components/page-sections-list";

export default async function AdminPageSectionsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PageSectionsList slug={slug} />;
}
