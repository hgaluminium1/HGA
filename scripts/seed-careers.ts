/**
 * Seed career openings only (idempotent by slug).
 * Usage: pnpm exec tsx scripts/seed-careers.ts
 */
import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import {
  createOpening,
  listOpenings,
  publishOpening,
} from "@/modules/careers";

async function main() {
  const openings = [
    {
      title: "Extrusion Press Operator",
      slug: "extrusion-press-operator",
      department: "operations" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Run 7\" / mid-size press cycles with die change discipline, temperature control and lot traceability.",
      description:
        "Operate extrusion presses to plan; first-piece with QC; shift handovers.\n\nRequirements: 2+ years extrusion or heavy process plant preferred.",
      sortOrder: 10,
      publish: true,
    },
    {
      title: "Quality Assurance Inspector",
      slug: "quality-assurance-inspector",
      department: "quality" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Own dimensional checks, surface finish gates and mill certificate prep for extrusion and billet lots.",
      description:
        "Inspect against drawings/CCD; NCR holds; MTC packs.\n\nRequirements: Diploma/B.Tech metallurgy or mechanical; 1–3 years QA metals preferred.",
      sortOrder: 20,
      publish: true,
    },
    {
      title: "Maintenance Technician — Hydraulics & Utilities",
      slug: "maintenance-technician-hydraulics",
      department: "maintenance" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Keep press hydraulics, furnaces and plant utilities reliable across planned and breakdown work.",
      description:
        "PM on hydraulic packs; furnace utilities; spares discipline.\n\nRequirements: ITI/Diploma mechanical; 3+ years industrial maintenance.",
      sortOrder: 30,
      publish: true,
    },
    {
      title: "Sales Executive — Western India",
      slug: "sales-executive-western-india",
      department: "commercial" as const,
      location: "Ahmedabad / field (Gujarat & West)",
      employmentType: "full_time" as const,
      summary:
        "Grow extrusion and billet programmes with OEMs, fabricators and project buyers across Western India.",
      description:
        "RFQ ownership; account plans; site visits.\n\nRequirements: 3–6 years B2B metals or industrial sales.",
      sortOrder: 40,
      publish: true,
    },
    {
      title: "Process Engineer — Extrusion",
      slug: "process-engineer-extrusion",
      department: "engineering" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Stabilise press recipes, die performance and yield for architectural and industrial sections.",
      description:
        "Process windows; yield projects; die trials.\n\nRequirements: B.E./B.Tech mechanical or metallurgy; 2–5 years process.",
      sortOrder: 50,
      publish: true,
    },
    {
      title: "Homogenising Furnace Operator",
      slug: "homogenising-furnace-operator",
      department: "operations" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Run homogenising cycles for extrusion billets with heat-treat discipline and lot identity.",
      description:
        "Charge identity; soak profiles; coordinate with casting and press planning.",
      sortOrder: 15,
      publish: true,
    },
    {
      title: "Die Corrector / Tool Room Assistant",
      slug: "die-corrector-tool-room",
      department: "engineering" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Support die correction, polishing and tool-room readiness for the press programme.",
      description:
        "Assist bearing/pocket work; die ID and polish standards.\n\nRequirements: ITI fitter / tool & die.",
      sortOrder: 55,
      publish: true,
    },
    {
      title: "HR Executive — Plant",
      slug: "hr-executive-plant",
      department: "hr" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Own plant hiring coordination, attendance hygiene and onboarding for shop-floor and staff roles.",
      description:
        "Screen candidates; attendance; safety induction.\n\nRequirements: Graduate; 2+ years plant HR.",
      sortOrder: 60,
      publish: true,
    },
    {
      title: "Stores & Logistics Coordinator",
      slug: "stores-logistics-coordinator",
      department: "operations" as const,
      location: "Kadi, Gujarat",
      employmentType: "full_time" as const,
      summary:
        "Keep billets, dies, packing materials and finished goods moving with accurate stock identity.",
      description:
        "Receive/issue; cycle counts; dispatch with QC release.\n\nRequirements: 2+ years stores in manufacturing.",
      sortOrder: 25,
      publish: true,
    },
    {
      title: "Graduate Engineer Trainee — Manufacturing",
      slug: "graduate-engineer-trainee",
      department: "engineering" as const,
      location: "Kadi, Gujarat",
      employmentType: "internship" as const,
      summary:
        "12-month rotational exposure across press, QC and process — draft role pending campus calendar.",
      description:
        "Draft — not open until campus/lateral window is confirmed.",
      sortOrder: 90,
      publish: false,
    },
  ];

  const existing = await listOpenings({ status: "all" });
  for (const o of openings) {
    if (existing.items.some((x) => x.slug === o.slug)) {
      console.log(`  = ${o.slug}`);
      continue;
    }
    const { publish, ...rest } = o;
    const created = await createOpening({ ...rest, status: "draft" });
    if (publish) {
      await publishOpening(created.id, "publish", created.version);
    }
    console.log(`  + ${o.slug}${publish ? " (published)" : " (draft)"}`);
  }
  console.log("Done.");
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
