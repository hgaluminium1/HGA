import { test } from "@playwright/test";

/**
 * Catalogue admin UI was removed in the desk rebuild (Landing → Hero first).
 * Product/category CRUD returns in a later wave — keep this file as a stub so
 * CI docs that reference it do not confuse future work.
 */
test.describe("Phase 3 Catalog proof", () => {
  test.skip(true, "Catalog admin deferred until after landing sections");
  test("placeholder", () => {
    // intentionally empty
  });
});
