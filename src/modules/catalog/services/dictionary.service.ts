import { dbConnect } from "@/lib/db/connect";
import { assertVersionMatch } from "@/lib/http/conflict";
import { Dictionary } from "../repositories/mongo/dictionary.model";
import type { DictionaryDTO, LocalizedString } from "../types";
import {
  DICTIONARY_KEYS,
  addDictionaryItemSchema,
  dictionaryKeySchema,
  upsertDictionarySchema,
  type DictionaryKey,
} from "../validators/catalog.validators";
import type { z } from "zod";

async function requireDb() {
  const conn = await dbConnect();
  if (!conn) throw new Error("MONGODB_URI is not configured");
}

function mapToObj(map: unknown): LocalizedString {
  if (!map) return { en: "" };
  if (map instanceof Map) {
    return { en: String(map.get("en") ?? "") };
  }
  const obj = map as Record<string, string>;
  return { en: String(obj.en ?? "") };
}

function toDTO(doc: Record<string, unknown>): DictionaryDTO {
  const items = ((doc.items as unknown[]) ?? []).map((raw) => {
    const item = raw as Record<string, unknown>;
    return {
      value: String(item.value),
      label: mapToObj(item.label),
      sortOrder: Number(item.sortOrder ?? 0),
      active: Boolean(item.active !== false),
    };
  });
  return {
    id: String(doc._id),
    key: String(doc.key),
    items: items.sort((a, b) => a.sortOrder - b.sortOrder),
    version: Number(doc.version ?? 1),
    updatedAt: new Date(doc.updatedAt as string).toISOString(),
  };
}

export async function listDictionaries() {
  await requireDb();
  const rows = await Dictionary.find().lean();
  const byKey = new Map(
    rows.map((r) => [String((r as { key: string }).key), r]),
  );
  const result: DictionaryDTO[] = [];
  for (const key of DICTIONARY_KEYS) {
    const row = byKey.get(key);
    if (row) {
      result.push(toDTO(row as Record<string, unknown>));
    } else {
      result.push({
        id: "",
        key,
        items: [],
        version: 0,
        updatedAt: new Date(0).toISOString(),
      });
    }
  }
  return result;
}

export async function getDictionary(key: DictionaryKey) {
  await requireDb();
  dictionaryKeySchema.parse(key);
  const doc = await Dictionary.findOne({ key }).lean();
  if (!doc) {
    return {
      id: "",
      key,
      items: [],
      version: 0,
      updatedAt: new Date(0).toISOString(),
    } satisfies DictionaryDTO;
  }
  return toDTO(doc as Record<string, unknown>);
}

export async function upsertDictionary(
  input: z.infer<typeof upsertDictionarySchema>,
) {
  const data = upsertDictionarySchema.parse(input);
  await requireDb();
  const existing = await Dictionary.findOne({ key: data.key });
  if (existing) {
    if (data.version !== undefined) {
      assertVersionMatch(existing.version, data.version);
    }
    existing.items = data.items as never;
    existing.version = (existing.version ?? 1) + 1;
    await existing.save();
    return toDTO(existing.toObject() as Record<string, unknown>);
  }
  const doc = await Dictionary.create({
    key: data.key,
    items: data.items,
    version: 1,
  });
  return toDTO(doc.toObject() as Record<string, unknown>);
}

export async function addDictionaryItem(
  input: z.infer<typeof addDictionaryItemSchema>,
) {
  const data = addDictionaryItemSchema.parse(input);
  await requireDb();
  const existing = await Dictionary.findOne({ key: data.key });
  if (!existing) {
    const doc = await Dictionary.create({
      key: data.key,
      items: [data.item],
      version: 1,
    });
    return toDTO(doc.toObject() as Record<string, unknown>);
  }
  assertVersionMatch(existing.version, data.version);
  const items = [...((existing.items as unknown[]) ?? [])] as Array<{
    value: string;
    label: LocalizedString;
    sortOrder: number;
    active: boolean;
  }>;
  const idx = items.findIndex((i) => i.value === data.item.value);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...data.item, active: true };
  } else {
    items.push(data.item);
  }
  existing.items = items as never;
  existing.version = (existing.version ?? 1) + 1;
  await existing.save();
  return toDTO(existing.toObject() as Record<string, unknown>);
}

export async function deactivateDictionaryItem(
  key: DictionaryKey,
  value: string,
  version: number,
) {
  await requireDb();
  const existing = await Dictionary.findOne({ key });
  if (!existing) return { error: "NOT_FOUND" as const };
  assertVersionMatch(existing.version, version);
  const items = ((existing.items as unknown[]) ?? []).map((raw) => {
    const item = raw as Record<string, unknown>;
    if (String(item.value) === value) {
      return { ...item, active: false };
    }
    return item;
  });
  existing.items = items as never;
  existing.version = (existing.version ?? 1) + 1;
  await existing.save();
  return { dictionary: toDTO(existing.toObject() as Record<string, unknown>) };
}
