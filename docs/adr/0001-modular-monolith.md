# ADR 0001 — Modular monolith

## Status

Accepted (Phase 0)

## Context

HG Aluminium needs a custom CMS + public site with multiple domains (catalog, corporate content, leads, media, identity, jobs). Team size and free-tier hosting favor one deployable app over a monorepo of packages or microservices.

## Decision

Ship a **modular monolith** under `src/modules/*` with public barrels (`index.ts`). Features under `src/features/*` compose UI. Cross-module access goes through public APIs only; ESLint boundaries enforce this.

## Consequences

- Single Next.js deploy (Vercel + OpenNext Cloudflare)
- Clear ownership per module without package-version churn
- Risk of soft boundaries if boundaries lint is bypassed — CI must keep `boundaries/dependencies` on
