import { auth } from "@/auth";
import { DeskProviders } from "@/features/admin-desk/components/desk-providers";
import { DeskShell } from "@/features/admin-desk/components/desk-shell";

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <DeskProviders>
      <DeskShell userEmail={session?.user?.email ?? null}>{children}</DeskShell>
    </DeskProviders>
  );
}
