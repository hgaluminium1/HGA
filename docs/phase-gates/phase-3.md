# Phase 3 — Proof of Done

**Status:** **COMPLETE — Phase 4 unlocked** (Public pages/catalog from CMS)

Date: 2026-08-21

**Scope:** Admin Catalog (N-level categories + Products), Dictionary CMS, optimistic `version` / **409** on catalog + Pages retrofit. Public `/en` and product shells remain static until Phase 4.

---

## Checklist (§26.2)

| DoD | Proof |
|---|---|
| Catalog CRUD | Admin Categories tree + Products list/editor |
| Dictionary CMS | Settings → Dictionaries; add alloy without code |
| version / 409 | PATCH with stale version → **409** `CONFLICT` |
| Playwright | [`e2e/phase-3-catalog.spec.ts`](../../e2e/phase-3-catalog.spec.ts) |

---

## Run proofs

```bash
npm run seed:dictionaries
npm run seed:categories   # optional template tree
npm run build
npm run start
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run test:e2e -- e2e/phase-3-catalog.spec.ts
```

**Proof run (2026-08-21):** `2 passed` — dictionary alloy + product publish; stale version **409**.

---

## Key surfaces

| Area | Location |
|---|---|
| Catalog module | [`src/modules/catalog`](../../src/modules/catalog) |
| APIs | `/api/v1/products`, `/api/v1/categories`, `/api/v1/dictionaries` |
| Admin UI | [`src/features/admin-catalog`](../../src/features/admin-catalog) |
| Soft max depth | [`src/config/categories.config.ts`](../../src/config/categories.config.ts) |
| Seeds | `npm run seed:categories` / `seed:dictionaries` |
| 409 helper | [`src/lib/http/conflict.ts`](../../src/lib/http/conflict.ts) |

---

## Explicitly deferred

- Public CMS-driven Home/catalog (Phase 4)
- R2 Media / drawings (Phase 5)
- CSV import (Phase 5)
