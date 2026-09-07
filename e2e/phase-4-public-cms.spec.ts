import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { loadEnvLocal } from "../scripts/load-env-local";

loadEnvLocal();

function parseSeedOutput(out: string) {
  const match = out.match(/\{[\s\S]*"liveSlug"[\s\S]*\}/);
  if (!match) throw new Error(`Seed output missing JSON:\n${out}`);
  return JSON.parse(match[0]) as {
    liveSlug: string;
    liveName: string;
    draftName: string;
  };
}

test.describe("Phase 4 public CMS", () => {
  test("published home shows CMS content", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("div[data-block='hero']").first()).toBeVisible({
      timeout: 30_000,
    });
  });

  test("unpublished corporate shell shows empty state", async ({ page }) => {
    await page.goto("/en/about");
    await expect(
      page.getByText("This page isn’t published yet."),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("published product on public catalog; draft absent", async ({
    page,
  }) => {
    const out = execFileSync(
      process.execPath,
      [
        resolve("node_modules/tsx/dist/cli.mjs"),
        resolve("scripts/seed-phase4-products.ts"),
      ],
      {
        cwd: resolve("."),
        encoding: "utf8",
        env: process.env,
      },
    );
    const seeded = parseSeedOutput(out);

    await page.goto("/en/products");
    await expect(page.getByText(seeded.liveName)).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText(seeded.draftName)).toHaveCount(0);

    await page.goto(`/en/products/${seeded.liveSlug}`);
    await expect(
      page.getByRole("heading", { name: seeded.liveName }),
    ).toBeVisible({ timeout: 15_000 });
  });
});
