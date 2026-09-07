import { ResponsiveAdminShell } from "@/features/admin-shell/components/responsive-admin-shell";

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ResponsiveAdminShell>{children}</ResponsiveAdminShell>;
}
