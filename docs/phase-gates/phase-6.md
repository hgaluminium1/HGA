# Phase 6 — Proof of Done

**Status:** **COMPLETE — Phase 7 unlocked** (Forms / webhooks / lead capture)

Date: 2026-08-21

**Scope:** ExpansionProject corporate self-serve with INR disclosure gates, public `/expansion` + `expansion-roadmap` block, Page/Product scheduled publish UI + `publishedVersion` snapshots, real `scheduled-publish` / `trash-purge` / `preview-expire` jobs with JobRun audit + dry-run/commit.

**Out of scope:** CapacityMetric scheduling (verify gates stay manual); `webhook-retry` remains stub until Phase 7.

---

## Checklist (§26.2)

| DoD | Proof |
|---|---|
| Expansion + INR disclosure | Public never shows INR unless `publicDisclosureApproved` |
| Scheduled publish job | Dry-run counts due rows; commit publishes without redeploy |
| Playwright | [`e2e/phase-6-expansion-cron.spec.ts`](../../e2e/phase-6-expansion-cron.spec.ts) |

---

## Run proofs

```bash
npm run build
# PowerShell: $env:DISABLE_CMS_CACHE="1"; npm run start
DISABLE_CMS_CACHE=1 npm run start
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test e2e/phase-6-expansion-cron.spec.ts
```

Optional seed (also runs dry-run + commit): `npx tsx scripts/seed-phase6.ts`

CLI:

```bash
npm run jobs:run -- scheduled-publish --dry-run
npm run jobs:run -- scheduled-publish --commit
```

API (Bearer `JOBS_SECRET`):

- `GET /api/v1/jobs/scheduled-publish` → dry-run (default)
- `POST /api/v1/jobs/scheduled-publish?dryRun=0` → commit

---

## Key surfaces

| Area | Location |
|---|---|
| Expansion model/API | [`src/modules/corporate`](../../src/modules/corporate), `/api/v1/corporate/expansion` |
| Admin Expansion | `/admin/corporate/expansion` |
| Public | `/en/expansion`, block `expansion-roadmap` |
| Jobs | [`src/modules/jobs`](../../src/modules/jobs), [`scripts/jobs-run.ts`](../../scripts/jobs-run.ts) |
| Schedule UI | Page / Product Publishing tabs |

---

## Explicitly deferred

- Webhook retry delivery (Phase 7)
- CapacityMetric scheduled publish (never bypass verification)
