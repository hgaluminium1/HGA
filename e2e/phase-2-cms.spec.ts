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
  await expect(page).toHaveURL(/\/admin\/(pages)?\/?$/, { timeout: 20_000 });
}

test.describe("Admin desk — Pages IA", () => {
  test("login opens Pages and Hero section", async ({ page }) => {
    await login(page);
    await page.goto("/admin/pages");
    await expect(page.getByRole("heading", { name: "Pages" })).toBeVisible();
    await page.getByRole("link", { name: /^Home/ }).click();
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
    await page.getByRole("link", { name: /Hero carousel/i }).click();
    await expect(
      page.getByRole("heading", { name: /Hero carousel/i }),
    ).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole("button", { name: "Save draft" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Publish" })).toBeVisible();
  });

  test("unauthenticated admin routes redirect to login", async ({ page }) => {
    await page.goto("/admin/pages/home/hero");
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 15_000 });
  });

  test("legacy landing redirects", async ({ page }) => {
    await login(page);
    await page.goto("/admin/landing/hero");
    await expect(page).toHaveURL(/\/admin\/pages\/home\/hero/, {
      timeout: 20_000,
    });
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
