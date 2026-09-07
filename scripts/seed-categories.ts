import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import { createCategory, listCategoriesFlat } from "@/modules/catalog";

type SeedNode = {
  name: { en: string };
  slug: string;
  children?: SeedNode[];
};

async function seedNode(node: SeedNode, parentId: string | null) {
  const existing = (await listCategoriesFlat()).find((c) => c.slug === node.slug);
  let id = existing?.id ?? null;
  if (!existing) {
    const created = await createCategory({
      name: node.name,
      slug: node.slug,
      parentId,
      status: "published",
    });
    id = created.id;
    console.log(`created category ${node.slug}`);
  } else {
    console.log(`skip existing ${node.slug}`);
  }
  for (const child of node.children ?? []) {
    await seedNode(child, id);
  }
}

async function main() {
  const raw = readFileSync(
    resolve(process.cwd(), "config/categories.seed.json"),
    "utf8",
  );
  const tree = JSON.parse(raw) as SeedNode[];
  for (const root of tree) {
    await seedNode(root, null);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect().catch(() => undefined);
    process.exit(0);
  });
