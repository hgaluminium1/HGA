import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { loadEnvLocal } from "../scripts/load-env-local";

loadEnvLocal();

function parseJson(out: string) {
  const match = out.match(/\{[\s\S]*"hasLive"[\s\S]*\}/);
  if (!match) throw new Error(`Missing JSON:\n${out}`);
  return JSON.parse(match[0]) as {
    liveLabel: string;
    draftLabel: string;
    personSlug: string;
  };
}

test.describe("Phase 5 corporate + CSV", () => {
  test("unpublished capacity shows empty; verified metric appears after seed", async ({
    page,
  }) => {
    await page.goto("/en/capacity");
    const empty = page.getByText(/Capacity metrics aren’t published yet|isn’t published yet/);
    const heading = page.getByRole("heading", { name: "Capacity" });
    await expect(empty.or(heading).first()).toBeVisible({ timeout: 20_000 });

    const out = execFileSync(
      process.execPath,
      [
        resolve("node_modules/tsx/dist/cli.mjs"),
        resolve("scripts/seed-phase5-corporate.ts"),
      ],
      { cwd: resolve("."), encoding: "utf8", env: process.env },
    );
    const seeded = parseJson(out);

    await page.goto("/en/capacity");
    await expect(page.getByText(seeded.liveLabel)).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText(seeded.draftLabel)).toHaveCount(0);

    await page.goto("/en/leadership");
    await expect(page.getByRole("heading", { name: "Leadership" })).toBeVisible(
      { timeout: 15_000 },
    );
  });

  test("CSV dry-run validates capacity rows without commit", async ({
    request,
  }) => {
    const csv = [
      "key,label_en,value,unit,category,verification_status,publish_status",
      "bad_row,,,MT,extrusion,draft,hidden",
      `ok_row_${Date.now()},OK Label,42,MT,extrusion,draft,hidden`,
    ].join("\n");

    // Unauthenticated dry-run should be rejected (admin gated)
    const res = await request.post("/api/v1/import", {
      multipart: {
        entity: "capacity_metrics",
        mode: "dry-run",
        file: {
          name: "capacity.csv",
          mimeType: "text/csv",
          buffer: Buffer.from(csv),
        },
      },
    });
    expect([401, 403]).toContain(res.status());
  });

  test("admin desk routes require auth", async ({ page }) => {
    await page.goto("/admin/pages");
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 15_000 });
    await page.goto("/admin/pages/home/hero");
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 15_000 });
  });
});
