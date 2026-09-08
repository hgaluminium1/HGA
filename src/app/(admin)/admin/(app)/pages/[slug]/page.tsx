import { redirect } from "next/navigation";

import { PageSectionsList } from "@/features/admin-desk/components/page-sections-list";
import { PAGE_EDIT_DESTINATION } from "@/features/admin-desk/lib/page-edit-destinations";
import { getPageTemplate } from "@/modules/cms/browser";

export default async function AdminPageSectionsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = getPageTemplate(slug);
  const dest = PAGE_EDIT_DESTINATION[slug];

  // Entity / composite pages: skip the poster — open the real editor.
  if (
    (template?.mode === "entity" || dest?.kind === "composite") &&
    dest
  ) {
    redirect(dest.href);
  }

  return <PageSectionsList slug={slug} />;
}
