import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateCategories } from "@/lib/cms/revalidate-pages";
import {
  reorderCategories,
  reorderCategoriesSchema,
} from "@/modules/catalog";

export async function PATCH(req: Request) {
  const authz = await authorize("catalog.write");
  if ("error" in authz) return authz.error;
  try {
    const body = await req.json();
    const parsed = reorderCategoriesSchema.parse(body);
    const tree = await reorderCategories(parsed);
    revalidateCategories();
    return respondSuccess({ tree });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
