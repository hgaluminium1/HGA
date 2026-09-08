import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import { createCategory, listCategoriesFlat } from "@/modules/catalog";

type SeedNode = {
  name: { en: string };
  slug: string;
  description?: { en: string };
  imageUrl?: string;
  children?: SeedNode[];
};

async function seedFlat(node: SeedNode) {
  const existing = (await listCategoriesFlat()).find((c) => c.slug === node.slug);
  if (existing) {
    console.log(`skip existing ${node.slug}`);
    return;
  }
  await createCategory({
    name: node.name,
    slug: node.slug,
    parentId: null,
    description: node.description,
    imageUrl: node.imageUrl,
    status: "published",
  });
  console.log(`created category ${node.slug}`);
}

async function main() {
  const raw = readFileSync(
    resolve(process.cwd(), "config/categories.seed.json"),
    "utf8",
  );
  const nodes = JSON.parse(raw) as SeedNode[];
  for (const node of nodes) {
    await seedFlat(node);
    for (const child of node.children ?? []) {
      await seedFlat(child);
    }
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
