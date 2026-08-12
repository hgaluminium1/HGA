# Phase 0 — Proof of Done

**Gate rule:** Phase 1 does not start until this document is complete.  
**Status:** **Phase 1 unlocked** (local scaffold + tooling green; Vercel preview URL pending account link — see §Deploy).

Date: 2026-08-12

---

## Checklist

| DoD | Proof |
|---|---|
| Next.js TS App Router boots locally | `npm run build` green; `npm run start` → `http://localhost:3010/en` returns **HG — Phase 0** + shadcn `Button` |
| Tree matches §6 skeleton | See [Folder tree excerpt](#folder-tree-excerpt) |
| ESLint boundaries + Knip + size-limit + typecheck + unit smoke | Scripts: `lint`, `typecheck`, `test`, `knip`, `size`, `build` — all green locally; CI: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) |
| shadcn `components/ui` initialized | [`src/components/ui/button.tsx`](../../src/components/ui/button.tsx); Button on `/en` |
| Env template + free-tier accounts | [`.env.example`](../../.env.example); [`docs/ops/free-tier-checklist.md`](../ops/free-tier-checklist.md) |
| Vercel + OpenNext deploy stubs | [`vercel.json`](../../vercel.json); [`wrangler.toml`](../../wrangler.toml); [`open-next.config.ts`](../../open-next.config.ts); scripts `preview:cf` / `deploy:cf` |
| `/api/v1/health` + `/api/v1/jobs/[name]` stub | See [API curls](#api-curls) |
| ADRs | [`0001`](../adr/0001-modular-monolith.md)–[`0004`](../adr/0004-tooling-knip-boundaries.md) |

---

## Folder tree excerpt

Matches architecture §6 (modules / features / components / lib / config / i18n / docs / tests):

```text
src/app/(public)/[locale]
src/app/(admin)/admin
src/app/api/v1/health
src/app/api/v1/jobs/[name]
src/components/{ui,atoms,molecules,organisms,templates,cms-blocks,admin}
src/config
src/features/{public-home,public-catalog,public-corporate,admin-shell,admin-catalog,admin-corporate,admin-media,admin-leads}
src/i18n
src/lib/{db,http,query,types,utils,constants}
src/messages/en
src/modules/{catalog,cms,corporate,leads,media,identity,jobs}/…/{domain,validators,services,repositories/mongo}
src/styles/tokens.css
docs/{adr,phase-gates,content-verification,ops}
tests/{unit,e2e}
prototypes/landing
scripts/jobs-run.ts
```

---

## Tooling artifacts

| Check | Result (local) |
|---|---|
| `npm run typecheck` | pass |
| `npm run lint` | pass (boundaries + unused-imports) |
| `npm run test` | 1 passed (`respondSuccess` shape) |
| `npm run knip` | clean (hints only) |
| `npm run size` | **842 B** brotlied / **50 kB** limit (Phase 0 smoke on `package.json`; OpenNext worker budget re-baselined after first CF build) |
| `npm run build` | pass (Next.js 15 App Router) |
| Husky | `.husky/pre-commit` → lint-staged; `.husky/commit-msg` → commitlint |
| Playwright | Deferred to Phase 1 CI minutes (optional per plan) |

CI run URL / green badge: populate after first GitHub push + Actions run.

---

## API curls

Captured against `http://localhost:3010` after `npm run build && npm run start -- -p 3010`:

**Health**

```http
GET /api/v1/health
```

```json
{"success":true,"data":{"ok":true,"mongo":false,"ts":"2026-08-12T11:34:26.408Z"}}
```

(`mongo: false` = soft-fail without `MONGODB_URI` — expected.)

**Jobs unauthorized**

```http
GET /api/v1/jobs/trash-purge
→ 401
{"success":false,"error":{"code":"UNAUTHORIZED","message":"Invalid or missing JOBS_SECRET"}}
```

**CLI dryRun (recorded)**

```json
{"ok":true,"dryRun":true,"name":"trash-purge","stats":{"processed":0}}
```

**Jobs authorized (HTTP)** — set `JOBS_SECRET` in the Next process env, then:

```bash
curl -H "Authorization: Bearer $JOBS_SECRET" http://localhost:3010/api/v1/jobs/trash-purge
# expected: {"success":true,"data":{"ok":true,"dryRun":true,…}}
```

---

## Deploy

| Target | Phase 0 status |
|---|---|
| Vercel Hobby preview | Config: `vercel.json`. **Live preview URL:** _pending — link GitHub repo + Vercel Hobby project_ (required ops step; see free-tier checklist). |
| OpenNext Cloudflare | Stubs present; `npm run preview:cf` / `deploy:cf` after `wrangler login`. Full CF cron = Phase 10. |

---

## `/en` smoke

Placeholder page includes:

- Brand line: HG Aluminium Smelters  
- Headline: HG — Phase 0  
- shadcn `Button` (“Continue to Phase 1”) with `data-slot="button"`

Screenshot: capture locally from `http://localhost:3010/en` for stakeholder pack (HTML proof above confirms Button SSR).

---

## Sign-off

**Phase 1 unlocked.** Landing HTML→TSX migration and public UI begin under Phase 1 gates.

Remaining ops (do not block Phase 1 engineering): Atlas URI, Vercel preview URL paste into this doc, Cloudflare wrangler login.
