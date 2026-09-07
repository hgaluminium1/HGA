/**
 * Patch published catalogue products with plant photos + full spec fields.
 * Usage: npx tsx scripts/patch-product-catalogue.ts
 */
import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import {
  listCategoriesFlat,
  listProducts,
  publishProduct,
  updateProduct,
} from "@/modules/catalog";

const PATCHES = [
  {
    slug: "aluminium-extrusion-profiles",
    imageUrl: "/products/extrusion-profiles.jpg",
    alloyGrades: ["6063", "6061", "6005", "6082"],
    tempers: ["T5", "T6"],
    surfaceFinishes: ["mill", "anodized", "powder_coated"],
    anodizingColors: ["natural", "bronze", "black"],
    ralColors: ["RAL9016", "RAL7016", "RAL9005"],
    toleranceStandards: ["IS", "EN"],
    packaging: ["bundle", "stretch_wrap", "crate"],
    maxLengthMm: 6000,
    maxWidthMm: 386,
    weightPerMeterKg: 2.4,
    categorySlugs: ["extrusion-profiles"],
    description:
      "Architectural, industrial and solar extrusion profiles with die development support, CCD control and mill certificates on every lot.",
    isUpcoming: false,
  },
  {
    slug: "aluminium-homogenized-billets",
    imageUrl: "/products/aluminium-billets.jpg",
    alloyGrades: ["6063", "6061", "6082"],
    tempers: ["F"],
    surfaceFinishes: ["mill"],
    anodizingColors: [] as string[],
    ralColors: [] as string[],
    toleranceStandards: ["IS", "ASTM"],
    packaging: ["bundle"],
    maxLengthMm: 6000,
    categorySlugs: ["homogenised-billets"],
    description:
      "Cast and homogenised extrusion billets for captive and merchant press programmes — chemistry and homogenising certificates supplied.",
    isUpcoming: false,
  },
  {
    slug: "aluminium-ingots",
    imageUrl: "/products/aluminium-ingots.jpg",
    alloyGrades: ["1050", "1100"],
    tempers: ["F"],
    surfaceFinishes: ["mill"],
    anodizingColors: [] as string[],
    ralColors: [] as string[],
    toleranceStandards: ["IS"],
    packaging: ["bundle", "pallet"],
    categorySlugs: ["remelt-ingots"],
    description:
      "Secondary remelt aluminium ingots for foundry and captive melting. Lot chemistry certificates with each consignment.",
    isUpcoming: false,
  },
  {
    slug: "aluminium-cubes",
    imageUrl: "/products/aluminium-cubes.jpg",
    alloyGrades: ["1050"],
    tempers: ["F"],
    surfaceFinishes: ["mill"],
    packaging: ["bag", "pallet"],
    toleranceStandards: ["IS"],
    categorySlugs: ["cubes"],
    description:
      "Upcoming cube product for foundry and steel applications. Register interest for early allocation.",
    isUpcoming: true,
  },
  {
    slug: "aluminium-shots",
    imageUrl: "/products/aluminium-shots.jpg",
    alloyGrades: ["1050"],
    tempers: ["F"],
    surfaceFinishes: ["mill"],
    packaging: ["bag", "pallet"],
    toleranceStandards: ["IS"],
    categorySlugs: ["shots"],
    description:
      "Upcoming aluminium shots for melt additions. Specs publish at commercial release.",
    isUpcoming: true,
  },
  {
    slug: "aluminium-deoxidizer",
    imageUrl: "/products/aluminium-deoxidizer.jpg",
    alloyGrades: ["1050"],
    tempers: ["F"],
    surfaceFinishes: ["mill"],
    packaging: ["bag", "pallet"],
    toleranceStandards: ["IS"],
    categorySlugs: ["deoxidizer"],
    description:
      "Upcoming deoxidizer line for steelmaking applications. Register interest to prioritise development.",
    isUpcoming: true,
  },
] as const;

async function main() {
  const cats = await listCategoriesFlat();
  const bySlug = (slug: string) => cats.find((c) => c.slug === slug)?.id;
  const { items } = await listProducts({ limit: 200 });

  for (const patch of PATCHES) {
    const found = items.find((p) => p.slug === patch.slug);
    if (!found) {
      console.log(`  ! missing ${patch.slug}`);
      continue;
    }
    const categoryIds = patch.categorySlugs
      .map(bySlug)
      .filter((id): id is string => Boolean(id));

    const payload: Record<string, unknown> = {
      imageUrl: patch.imageUrl,
      alloyGrades: [...patch.alloyGrades],
      tempers: [...patch.tempers],
      surfaceFinishes: [...patch.surfaceFinishes],
      anodizingColors: [...("anodizingColors" in patch ? patch.anodizingColors : [])],
      ralColors: [...("ralColors" in patch ? patch.ralColors : [])],
      toleranceStandards: [...patch.toleranceStandards],
      packaging: [...patch.packaging],
      description: patch.description,
      isUpcoming: patch.isUpcoming,
      categoryIds,
      seo: {
        title: found.name.en,
        description: patch.description,
      },
      version: found.version,
    };
    if ("maxLengthMm" in patch && patch.maxLengthMm != null) {
      payload.maxLengthMm = patch.maxLengthMm;
    }
    if ("maxWidthMm" in patch && patch.maxWidthMm != null) {
      payload.maxWidthMm = patch.maxWidthMm;
    }
    if ("weightPerMeterKg" in patch && patch.weightPerMeterKg != null) {
      payload.weightPerMeterKg = patch.weightPerMeterKg;
    }

    const updated = await updateProduct(found.id, payload as never);
    if ("error" in updated) {
      console.error(updated);
      process.exit(1);
    }
    let product = updated.product;
    if (product.status !== "published") {
      const published = await publishProduct(product.id, product.version);
      if ("error" in published) throw new Error(JSON.stringify(published));
      product = published.product;
    }
    console.log(`  ✓ ${patch.slug} alloys=${product.alloyGrades.join(",")}`);
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
