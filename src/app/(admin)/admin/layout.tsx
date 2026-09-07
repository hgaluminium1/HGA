import { AdminClientProviders } from "@/features/admin-shell/components/admin-client-providers";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminClientProviders>{children}</AdminClientProviders>;
}
