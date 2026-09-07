import { authorize } from "@/modules/identity";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { isConflictError } from "@/lib/http/conflict";
import {
  addDictionaryItem,
  addDictionaryItemSchema,
  deactivateDictionaryItem,
  dictionaryKeySchema,
  getDictionary,
  listDictionaries,
  upsertDictionary,
  upsertDictionarySchema,
} from "@/modules/catalog";

export async function GET(req: Request) {
  const authz = await authorize("dictionaries.read");
  if ("error" in authz) return authz.error;
  const key = new URL(req.url).searchParams.get("key");
  if (key) {
    const parsed = dictionaryKeySchema.safeParse(key);
    if (!parsed.success) {
      return respondError("VALIDATION_ERROR", "Invalid dictionary key", 400);
    }
    const dictionary = await getDictionary(parsed.data);
    return respondSuccess(dictionary);
  }
  const items = await listDictionaries();
  return respondSuccess({ items });
}

export async function POST(req: Request) {
  const authz = await authorize("dictionaries.write");
  if ("error" in authz) return authz.error;
  try {
    const body = await req.json();
    if (body?.action === "addItem") {
      const parsed = addDictionaryItemSchema.parse({
        key: body.key,
        item: body.item,
        version: body.version,
      });
      const dictionary = await addDictionaryItem(parsed);
      return respondSuccess(dictionary);
    }
    if (body?.action === "deactivate") {
      const key = dictionaryKeySchema.parse(body.key);
      const value = String(body.value ?? "");
      const version = Number(body.version);
      const result = await deactivateDictionaryItem(key, value, version);
      if ("error" in result) {
        return respondError("NOT_FOUND", "Dictionary not found", 404);
      }
      return respondSuccess(result.dictionary);
    }
    const parsed = upsertDictionarySchema.parse(body);
    const dictionary = await upsertDictionary(parsed);
    return respondSuccess(dictionary);
  } catch (err) {
    if (isConflictError(err)) {
      return respondError(err.code, err.message, err.status);
    }
    const message = err instanceof Error ? err.message : "Invalid payload";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
