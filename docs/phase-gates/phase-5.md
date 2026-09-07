# Phase 5 — Proof of Done

**Status:** **COMPLETE — Phase 6 unlocked** (Expansion + scheduled publish)

Date: 2026-08-21

**Scope:** Media (R2) library + picker, full corporate self-serve (CompanyProfile, Person, CapacityMetric, Certification, SustainabilityMetric, CustomerLogo, CaseStudy, Testimonial), CSV import/export dry-run+commit, publish/verification gates, public leadership/capacity/customers + corporate blocks.

**Out of scope:** ExpansionProject + cron (Phase 6).

---

## Checklist (§26.2)

| DoD | Proof |
|---|---|
| Corporate self-serve | Admin Corporate + Company + Media (no code for content) |
| CSV import | `/admin/import` dry-run + Zod preview; APIs `/api/v1/import` + `/api/v1/export` |
| Publish gates | Unverified capacity absent from `/en/capacity` |
| Playwright | [`e2e/phase-5-corporate-media.spec.ts`](../../e2e/phase-5-corporate-media.spec.ts) |

---

## Self-serve checklist (without code)

- [ ] Upload / tag media in **Admin → Media** (requires `R2_*` env)
- [ ] Edit **Company** profile
- [ ] Create / publish **People**
- [ ] Create capacity metric → verify → publish
- [ ] Create certification / sustainability / logos / case studies / testimonials
- [ ] CSV dry-run for capacity or products under **CSV import**

---

## Run proofs

```bash
npm run build
# PowerShell: $env:DISABLE_CMS_CACHE="1"; npm run start
DISABLE_CMS_CACHE=1 npm run start
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test e2e/phase-5-corporate-media.spec.ts
```

Optional seed: `npx tsx scripts/seed-phase5-corporate.ts`

---

## Key surfaces

| Area | Location |
|---|---|
| Media module | [`src/modules/media`](../../src/modules/media) |
| Corporate module | [`src/modules/corporate`](../../src/modules/corporate) |
| R2 client | [`src/lib/r2/client.ts`](../../src/lib/r2/client.ts) |
| Admin Media / Corporate / Import | `/admin/media`, `/admin/corporate/*`, `/admin/import` |
| Public | `/en/leadership`, `/en/capacity`, `/en/customers` |
| CSV | [`src/features/admin-import`](../../src/features/admin-import) |

---

## Explicitly deferred

- Expansion projects + `expansion-roadmap` (Phase 6)
- Scheduled publish cron (Phase 6)
- Virus scanning (paid)
