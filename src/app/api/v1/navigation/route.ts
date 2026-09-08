import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { isConflictError } from "@/lib/http/conflict";
import { listNavMenus, upsertNavMenu, upsertNavMenuSchema } from "@/modules/navigation";
import { revalidatePath } from "next/cache";

export async function GET() {
  const authz = await authorize("pages.read");
  if ("error" in authz) return authz.error;
  const items = await listNavMenus();
  return respondSuccess({ items });
}

export async function PUT(req: Request) {
  const authz = await authorize("pages.write");
  if ("error" in authz) return authz.error;
  try {
    const body = await req.json();
    const parsed = upsertNavMenuSchema.parse(body);
    const menu = await upsertNavMenu(parsed);
    revalidatePath("/", "layout");
    return respondSuccess(menu);
  } catch (err) {
    if (isConflictError(err)) {
      return respondError(err.code, err.message, err.status);
    }
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
