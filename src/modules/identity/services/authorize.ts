import { auth } from "@/auth";
import { respondError } from "@/lib/http/respond";
import {
  hasPermission,
  type Permission,
  type Role,
} from "../permissions";

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: respondError("UNAUTHORIZED", "Sign in required", 401) };
  }
  return { session };
}

export async function authorize(permission: Permission) {
  const result = await requireSession();
  if ("error" in result) return result;
  const role = result.session.user.role as Role;
  if (!hasPermission(role, permission)) {
    return {
      error: respondError("FORBIDDEN", "Insufficient permissions", 403),
    };
  }
  return { session: result.session, role };
}
