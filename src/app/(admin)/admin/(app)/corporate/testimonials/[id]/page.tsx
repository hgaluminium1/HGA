import { CorporateTestimonialsEditor } from "@/features/admin-desk/components/corporate-testimonials-editor";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CorporateTestimonialsEditor testimonialId={id} />;
}
