# ADR 0003 — Dual host: Vercel + Cloudflare OpenNext

## Status

Accepted (Phase 0)

## Context

Architecture locks free hosting except custom domain: Vercel Hobby for staging/previews; Cloudflare Workers (OpenNext) for production budget and eventual cron.

## Decision

- **Vercel**: primary CI/CD preview path (`vercel.json`); PR previews after GitHub link
- **OpenNext Cloudflare**: `open-next.config.ts` + `wrangler.toml` + scripts `preview:cf` / `deploy:cf`
- Phase 0 requires config + at least one Vercel preview when account linked; full CF cron is Phase 10

## Consequences

- Two build pipelines to keep green
- `size-limit` protects OpenNext worker budget as builds mature
- Soft-fail local without Cloudflare login
