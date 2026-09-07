import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { loadEnvLocal } from "../scripts/load-env-local";

loadEnvLocal();

function parseSeedOutput(out: string) {
  const match = out.match(/\{[\s\S]*"pageSlug"[\s\S]*\}/);
  if (!match) throw new Error(`Seed output missing JSON:\n${out}`);
  return JSON.parse(match[0]) as {
    pageSlug: string;
    pageTitle: string;
    stamp: number;
    dryRun: { stats: Record<string, number>; dryRun: boolean };
    commit: { stats: Record<string, number>; dryRun: boolean };
  };
}

test.describe("Phase 6 expansion + scheduled publish", () => {
  test("expansion: published with/without INR disclosure; draft absent", async ({
    page,
  }) => {
    const out = execFileSync(
      process.execPath,
      [
        resolve("node_modules/tsx/dist/cli.mjs"),
        resolve("scripts/seed-phase6.ts"),
      ],
      {
        cwd: resolve("."),
        encoding: "utf8",
        env: { ...process.env, DISABLE_CMS_CACHE: "1" },
      },
    );
    const seeded = parseSeedOutput(out);

    expect(seeded.dryRun.dryRun).toBe(true);
    expect(seeded.dryRun.stats.pagesDue).toBeGreaterThanOrEqual(1);
    expect(seeded.commit.dryRun).toBe(false);
    expect(seeded.commit.stats.pagesPublished).toBeGreaterThanOrEqual(1);

    await page.goto("/en/expansion");
    await expect(
      page.getByText(`Disclosed Expansion ${seeded.stamp}`),
    ).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText("₹250 Cr")).toBeVisible();
    await expect(
      page.getByText(`Hidden INR Expansion ${seeded.stamp}`),
    ).toBeVisible();
    await expect(page.getByText("₹999 Cr")).toHaveCount(0);
    await expect(
      page.getByText(`Draft Expansion ${seeded.stamp}`),
    ).toHaveCount(0);

    await page.goto(`/en/${seeded.pageSlug}`);
    await expect(
      page.getByText(`Scheduled content ${seeded.stamp}`),
    ).toBeVisible({ timeout: 20_000 });
  });
});
