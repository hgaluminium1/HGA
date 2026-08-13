# Free-tier account checklist (Phase 0)

Soft-fail: app boots without these; `/api/v1/health` reports `mongo: false` until `MONGODB_URI` is set.

Copy `.env.example` → `.env.local` and fill values as accounts are ready. **Never commit secrets.**

| # | Account | Phase 0 status |
|---|---|---|
| 1 | GitHub private repo (Vercel + CI) | Done — `hgaluminium1/HGA` |
| 2 | MongoDB Atlas M0 | Done — health `mongo: true` |
| 3 | Cloudflare R2 bucket | Done — `hg-media` (upload API Phase 5) |
| 4 | Upstash Redis REST | Done — keys in Vercel / `.env.local` |
| 5 | Resend | Done — `RESEND_FROM=onboarding@resend.dev` (verify domain later) |
| 6 | Sentry project DSN | Done |
| 7 | Vercel Hobby | Done — https://hgaluminium.vercel.app |
| 8 | Cloudflare Workers / OpenNext | Done — `wrangler login` 2026-08-13; full CF cron Phase 10 |
