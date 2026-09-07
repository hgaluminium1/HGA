# Phase 2 — Proof of Done

**Status:** **COMPLETE — Phase 3 unlocked** (Catalog / Dictionary)

Date: 2026-08-21

**Scope:** Auth.js-guarded admin CMS for Pages + Phase-1 home blocks, Redirect CRUD + middleware 301/302, draft Preview tokens. Public `/en` remains on `homeContentEn` until Phase 4.

---

## Checklist (§26.2)

| DoD | Proof |
|---|---|
| Page CRUD + blocks | Admin Pages list/editor; Zod registry for 10 home block types |
| Redirects | Admin Redirects UI + middleware resolution; auto-301 on slug change |
| Preview token | `POST /api/v1/preview` → `/en/preview/[token]` with “Preview — not public” |
| Auth | Credentials + roles; `/admin` and CMS APIs gated |
| Playwright | `e2e/phase-2-cms.spec.ts` — publish, 301, preview, viewport shots |

---

## Artifacts

| Artifact | Path |
|---|---|
| Publish / 301 / preview e2e | [`e2e/phase-2-cms.spec.ts`](../../e2e/phase-2-cms.spec.ts) |
| Admin 375 | [`docs/phase-gates/artifacts/admin-pages-375.png`](./artifacts/admin-pages-375.png) |
| Admin 768 | [`docs/phase-gates/artifacts/admin-pages-768.png`](./artifacts/admin-pages-768.png) |
| Admin 1024 | [`docs/phase-gates/artifacts/admin-pages-1024.png`](./artifacts/admin-pages-1024.png) |
| Admin 1440 | [`docs/phase-gates/artifacts/admin-pages-1440.png`](./artifacts/admin-pages-1440.png) |

Run proofs:

```bash
# once: set ADMIN_EMAIL / ADMIN_PASSWORD in .env.local, then:
npm run seed:admin
npm run seed:home-page
npm run build
npm run start   # in one terminal
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run test:e2e
```

**Proof run (2026-08-21):** `4 passed` — publish flow, 301 redirect, preview banner, admin viewport screenshots.

---

## Key surfaces

| Area | Location |
|---|---|
| Auth | [`src/auth.ts`](../../src/auth.ts), [`src/middleware.ts`](../../src/middleware.ts) |
| Identity | [`src/modules/identity`](../../src/modules/identity) |
| CMS services | [`src/modules/cms`](../../src/modules/cms) |
| APIs | `/api/v1/pages`, `/api/v1/redirects`, `/api/v1/preview` |
| Admin UI | [`src/features/admin-pages`](../../src/features/admin-pages), [`src/features/admin-shell`](../../src/features/admin-shell) |
| Block registry | [`src/features/public-home/lib/block-registry.tsx`](../../src/features/public-home/lib/block-registry.tsx) |
| Preview route | [`src/app/(public)/[locale]/preview/[token]/page.tsx`](../../src/app/(public)/[locale]/preview/[token]/page.tsx) |

---

## Env (new)

| Variable | Purpose |
|---|---|
| `ADMIN_EMAIL` | Seed superadmin email (`npm run seed:admin`) |
| `ADMIN_PASSWORD` | Seed superadmin password (plain; hashed at seed) |
| `ADMIN_NAME` | Optional display name |

Documented in [`.env.example`](../../.env.example).

---

## Explicitly deferred

- Public CMS-driven URLs (Phase 4)
- Catalog / Dictionary (Phase 3)
- R2 media library (Phase 5)
- Scheduled-publish cron (Phase 6)
- Full §8.1 corporate block types
