import { expect, test } from "@playwright/test";
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
  await expect(page).toHaveURL(/\/admin\/(pages|products)/, {
    timeout: 20_000,
  });
}

test.describe("Phase 3 Catalog proof", () => {
  test("category + product CRUD with dictionary alloy", async ({ page }) => {
    await login(page);

    await page.goto("/admin/dictionaries");
    await page.getByRole("button", { name: "Alloy grades" }).click();
    const alloy = `ALLOY-${Date.now()}`;
    await page.getByPlaceholder("e.g. 6005A").fill(alloy);
    await page.getByPlaceholder("Display label").fill(alloy);
    const addResp = page.waitForResponse(
      (r) =>
        r.url().includes("/api/v1/dictionaries") && r.request().method() === "POST",
    );
    await page.getByRole("button", { name: "Add item" }).click();
    const resp = await addResp;
    expect(resp.ok()).toBeTruthy();
    await expect(page.getByText(alloy, { exact: true }).first()).toBeVisible({
      timeout: 15_000,
    });

    await page.goto("/admin/categories");
    await page.getByRole("button", { name: "Create root category" }).click();
    const catName = `Cat ${Date.now()}`;
    await page.getByPlaceholder("Category name").fill(catName);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page.getByText(catName)).toBeVisible({ timeout: 15_000 });

    await page.goto("/admin/products");
    await page.getByRole("button", { name: "Create product" }).click();
    const productName = `Product ${Date.now()}`;
    await page.getByLabel("Name").fill(productName);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/products\//, { timeout: 15_000 });

    await page.getByRole("button", { name: "Specs" }).click();
    await page.getByRole("checkbox", { name: alloy }).check();
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

  test("stale version returns 409", async ({ page }) => {
    await login(page);
    await page.goto("/admin/products");
    await page.getByRole("button", { name: "Create product" }).click();
    const productName = `Conflict ${Date.now()}`;
    await page.getByLabel("Name").fill(productName);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/products\//);

    const id = page.url().split("/").pop()!;
    const getRes = await page.request.get(`/api/v1/products/${id}`);
    const getJson = await getRes.json();
    expect(getJson.success).toBe(true);
    const version = getJson.data.version as number;

    const ok = await page.request.patch(`/api/v1/products/${id}`, {
      data: {
        name: { en: `${productName} v2` },
        version,
      },
    });
    expect(ok.status()).toBe(200);

    const conflict = await page.request.patch(`/api/v1/products/${id}`, {
      data: {
        name: { en: `${productName} stale` },
        version,
      },
    });
    expect(conflict.status()).toBe(409);
    const body = await conflict.json();
    expect(body.error.code).toBe("CONFLICT");
  });
});
