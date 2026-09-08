/**
 * Idempotent enrichment for sustainability metrics used on the public ESG page.
 * Usage: pnpm exec tsx scripts/seed-sustainability-extra.ts
 */
import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import {
  createSustainabilityMetric,
  listSustainabilityMetrics,
  updateSustainabilityMetric,
} from "@/modules/corporate";

async function main() {
  const rows = [
    {
      key: "specific_energy_intensity",
      label: "Specific melt energy intensity (indexed)",
      value: "100",
      unit: "baseline",
      disclosureTier: "verified_metric" as const,
      methodologyNote:
        "Indexed to FY baseline for remelt furnaces — absolute kWh/t on enquiry.",
    },
    {
      key: "zero_liquid_discharge_path",
      label: "ZLD pathway study",
      value: null as string | null,
      unit: "",
      disclosureTier: "initiative" as const,
      methodologyNote: "Engineering study for tighter water loop closure.",
    },
    {
      key: "supplier_code_rollout",
      label: "Supplier code of conduct rollout",
      value: null as string | null,
      unit: "",
      disclosureTier: "commitment" as const,
      methodologyNote: "Rolling to key scrap and alloy suppliers through FY.",
    },
  ];

  const existing = await listSustainabilityMetrics();
  for (const r of rows) {
    if (existing.items.some((x) => x.key === r.key)) {
      console.log(`  = ${r.key}`);
      continue;
    }
    const row = await createSustainabilityMetric({
      key: r.key,
      label: { en: r.label },
      value: r.value,
      unit: r.unit,
      disclosureTier: r.disclosureTier,
      methodologyNote: r.methodologyNote,
      evidenceMediaIds: [],
      verificationStatus: "draft",
      publishStatus: "hidden",
    });
    await updateSustainabilityMetric(row.id, {
      verificationStatus: "verified",
      publishStatus: "published",
      version: row.version,
    });
    console.log(`  + ${r.key}`);
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
