/**
 * Seed draft + published products for Phase 4 public catalog proofs.
 * Usage: npx tsx scripts/seed-phase4-products.ts
 */
import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import {
  createProduct,
  listPublishedProducts,
  publishProduct,
} from "@/modules/catalog";

async function main() {
  const stamp = Date.now();
  const draft = await createProduct({
    name: { en: `Draft Pub ${stamp}` },
    sku: `DRAFT-${stamp}`,
    slug: `draft-pub-${stamp}`,
    categoryIds: [],
    alloyGrades: [],
    tempers: [],
    surfaceFinishes: [],
    anodizingColors: [],
    ralColors: [],
    toleranceStandards: [],
    packaging: [],
    blocks: [],
  });
  const live = await createProduct({
    name: { en: `Live Pub ${stamp}` },
    sku: `LIVE-${stamp}`,
    slug: `live-pub-${stamp}`,
    description: "Phase 4 public catalog proof product.",
    categoryIds: [],
    alloyGrades: [],
    tempers: [],
    surfaceFinishes: [],
    anodizingColors: [],
    ralColors: [],
    toleranceStandards: [],
    packaging: [],
    blocks: [],
  });
  const published = await publishProduct(live.id, live.version);
  if ("error" in published) {
    console.error(published);
    process.exit(1);
  }
  const { revalidateProducts } = await import("@/lib/cms/revalidate-pages");
  try {
    revalidateProducts();
  } catch {
    // Outside Next.js runtime — tag bust is a no-op; use DISABLE_CMS_CACHE=1 for e2e.
  }
  const { items } = await listPublishedProducts({ limit: 50 });
  const hasLive = items.some((p) => p.slug === live.slug);
  const hasDraft = items.some((p) => p.slug === draft.slug);
  console.log(
    JSON.stringify(
      {
        draftSlug: draft.slug,
        liveSlug: live.slug,
        liveName: live.name.en,
        draftName: draft.name.en,
        hasLive,
        hasDraft,
      },
      null,
      2,
    ),
  );
  if (!hasLive || hasDraft) {
    process.exit(1);
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
