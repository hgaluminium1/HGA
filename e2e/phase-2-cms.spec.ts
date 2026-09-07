import { expect, test } from "@playwright/test";
import path from "node:path";
import { loadEnvLocal } from "../scripts/load-env-local";

loadEnvLocal();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

async function login(page: import("@playwright/test").Page) {
  test.skip(!email || !password, "ADMIN_EMAIL / ADMIN_PASSWORD required");
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email!);
  await page.getByLabel("Password").fill(password!);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin\/pages/, { timeout: 20_000 });
}

test.describe("Phase 2 CMS proof", () => {
  test("publish flow", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: "Create page" }).click();
    const title = `Proof Page ${Date.now()}`;
    await page.getByLabel("Title").fill(title);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/pages\//);

    await page.getByRole("button", { name: "Add section" }).click();
    await page.getByRole("button", { name: "Hero" }).click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("All changes saved")).toBeVisible({
      timeout: 15_000,
    });

    await page.getByRole("button", { name: "Publishing" }).click();
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Publish", exact: true }).click();
    await expect(page.getByText("published").first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("slug change creates 301 redirect", async ({ page, request }) => {
    await login(page);
    await page.getByRole("button", { name: "Create page" }).click();
    const stamp = Date.now();
    const oldSlug = `old-slug-${stamp}`;
    const newSlug = `new-slug-${stamp}`;
    await page.getByLabel("Title").fill(`Redirect Proof ${stamp}`);
    await page.getByLabel("Slug").fill(oldSlug);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/pages\//);

    await page.getByRole("button", { name: "Settings" }).click();
    await page.getByLabel("Slug").fill(newSlug);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("All changes saved")).toBeVisible({
      timeout: 15_000,
    });

    const res = await request.get(`/en/${oldSlug}`, { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(res.headers()["location"]).toContain(`/en/${newSlug}`);
  });

  test("preview token shows banner", async ({ page, context }) => {
    await login(page);
    await page.getByRole("button", { name: "Create page" }).click();
    await page.getByLabel("Title").fill(`Preview Proof ${Date.now()}`);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/pages\//);

    await page.getByRole("button", { name: "Add section" }).click();
    await page.getByRole("button", { name: "Hero" }).click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("All changes saved")).toBeVisible({
      timeout: 15_000,
    });

    const [preview] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("button", { name: "Preview draft" }).click(),
    ]);
    await preview.waitForLoadState("domcontentloaded");
    await expect(preview.getByText("Preview — not public")).toBeVisible();
  });

  test("admin viewport screenshots", async ({ page }) => {
    test.setTimeout(90_000);
    await login(page);
    const out = path.join("docs", "phase-gates", "artifacts");
    for (const width of [375, 768, 1024, 1440] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/admin/pages");
      await expect(page.getByRole("heading", { name: "Pages" })).toBeVisible();
      await page.screenshot({
        path: path.join(out, `admin-pages-${width}.png`),
        fullPage: true,
      });
    }
  });
});
