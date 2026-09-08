import { auth } from "@/auth";
import { AdminClientProviders } from "@/features/admin-shell/components/admin-client-providers";
import { ResponsiveAdminShell } from "@/features/admin-shell/components/responsive-admin-shell";

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AdminClientProviders>
      <ResponsiveAdminShell userEmail={session?.user?.email ?? null}>
        {children}
      </ResponsiveAdminShell>
    </AdminClientProviders>
  );
}
