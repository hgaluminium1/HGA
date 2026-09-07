import type { Metadata } from "next";

import { CustomersPage } from "@/features/public-corporate";

type PageProps = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Customers",
  description: "Customer logos, case studies, and testimonials.",
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <CustomersPage locale={locale} />;
}
