# Phase 4 — Proof of Done

**Status:** **COMPLETE — Phase 5 unlocked** (Corporate self-serve + media/CSV)

Date: 2026-08-21

**Scope:** Public site reads **published** CMS Pages and Catalog. Home, corporate shells, product list/PDP. Empty states when unpublished. Tagged cache on public reads.

---

## Checklist (§26.2)

| DoD | Proof |
|---|---|
| Public pages from CMS | `/en` → published `home`; shells → page slug or empty |
| Public catalog | `/en/products` + `/en/products/[slug]` |
| Empty states | Unpublished `about` shows empty copy |
| Playwright | [`e2e/phase-4-public-cms.spec.ts`](../../e2e/phase-4-public-cms.spec.ts) |

---

## Run proofs

```bash
npm run seed:home-page
npm run build
# Tagged cache is on in production; disable for e2e so mid-test seeds are visible:
# Windows PowerShell: $env:DISABLE_CMS_CACHE="1"; npm run start
DISABLE_CMS_CACHE=1 npm run start
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test e2e/phase-4-public-cms.spec.ts
```

Production uses `unstable_cache` with tags `pages` / `products` (invalidated by Admin publish APIs). Development skips that cache for faster iteration.

---

## Key surfaces

| Area | Location |
|---|---|
| Published helpers | `getPublishedPageBySlug`, `listPublishedProducts`, `getPublishedProductBySlug` |
| Cache | [`src/features/public-site/lib/public-cache.ts`](../../src/features/public-site/lib/public-cache.ts) |
| CMS page view | [`src/features/public-site`](../../src/features/public-site) |
| Catalog public | [`src/features/public-catalog`](../../src/features/public-catalog) |

---

## Explicitly deferred

- R2 media / CSV (Phase 5)
- Scheduled publish cron (Phase 6)
- CMS-driven public nav
