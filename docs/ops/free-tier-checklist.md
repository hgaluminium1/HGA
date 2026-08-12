# Free-tier account checklist (Phase 0)
#
# Soft-fail: app boots without these; `/api/v1/health` reports `mongo: false` until MONGODB_URI is set.
#
# 1. GitHub repo (private) — link for Vercel + CI
# 2. MongoDB Atlas M0 — cluster + connection string → MONGODB_URI
# 3. Cloudflare account — create R2 bucket now (upload API Phase 5)
# 4. Upstash Redis REST — URL + token
# 5. Resend — API key (domain verify later)
# 6. Sentry — project DSN
# 7. Vercel Hobby — project linked to repo (preview URL required for Phase 0 PoD)
# 8. Cloudflare Workers / OpenNext — `wrangler login`; full CF cron Phase 10
#
# Copy `.env.example` → `.env.local` and fill values as accounts are ready.
