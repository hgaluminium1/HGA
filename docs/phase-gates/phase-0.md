# Phase 0 — Proof of Done

**Gate rule:** Phase 1 does not start until this document is complete.  
**Status:** **COMPLETE — Phase 1 unlocked**

Date: 2026-08-13

---

## Checklist

| DoD | Proof |
|---|---|
| Next.js TS App Router boots locally | `npm run build` green; live site [https://hgaluminium.vercel.app/en](https://hgaluminium.vercel.app/en) |
| Tree matches §6 skeleton | See [Folder tree excerpt](#folder-tree-excerpt) |
| ESLint boundaries + Knip + size-limit + typecheck + unit smoke | Local scripts green; CI: [run 31667823196](https://github.com/hgaluminium1/HGA/actions/runs/31667823196) (success, Node 22) |
| shadcn `components/ui` initialized | [`src/components/ui/button.tsx`](../../src/components/ui/button.tsx); Button on `/en` |
| Env template + free-tier accounts | [`.env.example`](../../.env.example); accounts filled in Vercel + `.env.local` (secrets not committed) |
| Vercel + OpenNext deploy stubs | [`vercel.json`](../../vercel.json); [`wrangler.toml`](../../wrangler.toml); [`open-next.config.ts`](../../open-next.config.ts); `wrangler login` succeeded |
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

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run lint` | pass (boundaries + unused-imports) |
| `npm run test` | 1 passed (`respondSuccess` shape) |
| `npm run knip` | clean (hints only) |
| `npm run size` | **853 B** brotlied / **50 kB** limit (Phase 0 smoke on `package.json`; OpenNext worker budget re-baselined after first CF build) |
| `npm run build` | pass (Next.js 15 App Router) |
| Husky | `.husky/pre-commit` → lint-staged; `.husky/commit-msg` → commitlint |
| Playwright | Deferred to Phase 1 CI minutes (optional per plan) |
| Node | CI + `engines`: **>=22** (size-limit needs `fs.promises.glob`) |

**CI:** [https://github.com/hgaluminium1/HGA/actions/runs/31667823196](https://github.com/hgaluminium1/HGA/actions/runs/31667823196) — success.

---

## API curls

Production Hobby (Vercel), 2026-08-13:

**Health** — [GET /api/v1/health](https://hgaluminium.vercel.app/api/v1/health)

```json
{
  "success": true,
  "data": {
    "ok": true,
    "mongo": true,
    "ts": "2026-08-13T04:45:26.328Z"
  }
}
```

**Jobs unauthorized** — [GET /api/v1/jobs/trash-purge](https://hgaluminium.vercel.app/api/v1/jobs/trash-purge) (no Bearer)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing JOBS_SECRET"
  }
}
```

**Jobs authorized (dryRun)** — `Authorization: Bearer ${JOBS_SECRET}`

```json
{
  "success": true,
  "data": {
    "ok": true,
    "dryRun": true,
    "name": "trash-purge",
    "stats": {
      "processed": 0
    }
  }
}
```

**CLI dryRun (local)**

```json
{"ok":true,"dryRun":true,"name":"trash-purge","stats":{"processed":0}}
```

---

## Deploy

| Target | Phase 0 status |
|---|---|
| Vercel Hobby | **Live:** [https://hgaluminium.vercel.app/en](https://hgaluminium.vercel.app/en) — env vars set in Vercel (not in git). `NEXT_PUBLIC_SITE_URL=https://hgaluminium.vercel.app` |
| OpenNext Cloudflare | Config present; **`npx wrangler login` succeeded** 2026-08-13. Full CF cron / `deploy:cf` = Phase 10. |

---

## `/en` smoke

Live page [https://hgaluminium.vercel.app/en](https://hgaluminium.vercel.app/en):

- Brand line: HG Aluminium Smelters
- Headline: HG — Phase 0
- Copy: Scaffold ready. Landing UI lands in Phase 1.
- shadcn `Button`: Continue to Phase 1 (`data-slot="button"`)

---

## Free-tier accounts (ops)

Documented in [`docs/ops/free-tier-checklist.md`](../ops/free-tier-checklist.md). All eight items complete for Phase 0:

1. GitHub private repo — `hgaluminium1/HGA`
2. MongoDB Atlas M0 — health `mongo: true`
3. Cloudflare R2 bucket `hg-media` (upload API Phase 5)
4. Upstash Redis REST
5. Resend (onboarding from-address; domain verify later)
6. Sentry DSN
7. Vercel Hobby preview URL
8. `wrangler login` once

Secrets live in Vercel env + local `.env.local` only.

---

## Sign-off

**Phase 0 complete. Phase 1 unlocked.**

Landing HTML→TSX migration and public UI begin under Phase 1 gates.
