import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { revalidateCategories } from "@/lib/cms/revalidate-pages";
import {
  createCategory,
  createCategorySchema,
  listCategoriesFlat,
  listCategoriesTree,
} from "@/modules/catalog";

export async function GET(req: Request) {
  const authz = await authorize("catalog.read");
  if ("error" in authz) return authz.error;
  const view = new URL(req.url).searchParams.get("view") ?? "tree";
  const trash = new URL(req.url).searchParams.get("trash") === "1";
  if (trash || view === "flat") {
    const items = await listCategoriesFlat({ includeDeleted: trash });
    return respondSuccess({ items });
  }
  const tree = await listCategoriesTree();
  return respondSuccess({ tree });
}

export async function POST(req: Request) {
  const authz = await authorize("catalog.write");
  if ("error" in authz) return authz.error;
  try {
    const body = await req.json();
    const parsed = createCategorySchema.parse(body);
    const category = await createCategory(parsed);
    revalidateCategories();
    return respondSuccess(category);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
