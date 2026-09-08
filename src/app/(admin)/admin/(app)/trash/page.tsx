import { auth } from "@/auth";
import { TrashList } from "@/features/admin-pages/components/trash-list";

export default async function AdminTrashPage() {
  const session = await auth();
  const canPurge = session?.user?.role === "superadmin";

  return <TrashList canPurge={canPurge} />;
}
