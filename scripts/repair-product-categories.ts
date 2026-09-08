/**
 * Repair: attach all published products to Category "aluminium"
 * and ensure public/products images are set.
 */
import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import {
  listCategoriesFlat,
  listProducts,
  updateProduct,
} from "@/modules/catalog";

const IMAGE_BY_SLUG: Record<string, string> = {
  "aluminium-extrusion-profiles": "/products/extrusion-profiles.jpg",
  "aluminium-homogenized-billets": "/products/aluminium-billets.jpg",
  "aluminium-ingots": "/products/aluminium-ingots.jpg",
  "aluminium-cubes": "/products/aluminium-cubes.jpg",
  "aluminium-shots": "/products/aluminium-shots.jpg",
  "aluminium-deoxidizer": "/products/aluminium-deoxidizer.jpg",
};

async function main() {
  const cats = await listCategoriesFlat();
  const aluminium = cats.find((c) => c.slug === "aluminium");
  if (!aluminium) throw new Error("Missing category aluminium — run seed first");

  const { items } = await listProducts({ limit: 200 });
  for (const p of items) {
    const imageUrl = IMAGE_BY_SLUG[p.slug] ?? p.imageUrl ?? undefined;
    const result = await updateProduct(p.id, {
      version: p.version,
      categoryIds: [aluminium.id],
      ...(imageUrl ? { imageUrl } : {}),
      isUpcoming: false,
    });
    if ("error" in result) {
      console.error(`FAIL ${p.slug}`, result);
      continue;
    }
    console.log(
      `linked ${p.slug} → aluminium (${result.product.categoryIds.join(",")}) img=${result.product.imageUrl}`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect().catch(() => undefined);
    process.exit(0);
  });
