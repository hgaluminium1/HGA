/**
 * Seed Phase 6 expansion + scheduled page for cron proof.
 */
import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import {
  createExpansionProject,
} from "@/modules/corporate";
import { createPage, updatePage } from "@/modules/cms";
import { runJob } from "@/modules/jobs";

async function main() {
  const stamp = Date.now();
  const slug = `phase6-sched-${stamp}`;

  const disclosed = await createExpansionProject({
    title: { en: `Disclosed Expansion ${stamp}` },
    slug: `exp-disclosed-${stamp}`,
    status: "confirmed",
    description: { en: "Public with INR." },
    locationNote: "India",
    expectedStart: "",
    expectedCommissioning: "",
    projectCostInr: 250,
    estimatedRevenueInr: 400,
    publicDisclosureApproved: true,
    publishStatus: "published",
    sortOrder: 1,
  });

  const hiddenInr = await createExpansionProject({
    title: { en: `Hidden INR Expansion ${stamp}` },
    slug: `exp-hidden-${stamp}`,
    status: "proposed",
    description: { en: "Published but INR withheld." },
    locationNote: "",
    expectedStart: "",
    expectedCommissioning: "",
    projectCostInr: 999,
    estimatedRevenueInr: 1111,
    publicDisclosureApproved: false,
    publishStatus: "published",
    sortOrder: 2,
  });

  const draft = await createExpansionProject({
    title: { en: `Draft Expansion ${stamp}` },
    slug: `exp-draft-${stamp}`,
    status: "planned",
    description: { en: "" },
    locationNote: "",
    expectedStart: "",
    expectedCommissioning: "",
    publishStatus: "draft",
    projectCostInr: 50,
    publicDisclosureApproved: true,
    sortOrder: 99,
  });

  const page = await createPage({
    title: `Phase 6 Scheduled ${stamp}`,
    slug,
    locale: "en",
    blocks: [
      {
        id: `b-${stamp}`,
        type: "faq",
        order: 0,
        appearance: "default",
        data: {
          eyebrow: "Phase 6",
          title: `Scheduled content ${stamp}`,
          items: [
            {
              question: `Proof question ${stamp}`,
              answer: `Scheduled content ${stamp}`,
            },
          ],
        },
      },
    ],
  });

  const past = new Date(Date.now() - 60_000).toISOString();
  const scheduled = await updatePage(page.id, {
    status: "scheduled",
    scheduledPublishAt: past,
    version: page.version,
  });
  if ("error" in scheduled) {
    throw new Error(String(scheduled.error));
  }

  const dry = await runJob("scheduled-publish", { dryRun: true });
  const commit = await runJob("scheduled-publish", { dryRun: false });

  console.log(
    JSON.stringify(
      {
        pageSlug: slug,
        pageTitle: page.title,
        stamp,
        disclosedId: disclosed.id,
        hiddenInrId: hiddenInr.id,
        draftId: draft.id,
        dryRun: dry,
        commit,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
