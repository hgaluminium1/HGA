# ADR 0002 — CSR ports (Controller → Service → Repository)

## Status

Accepted (Phase 0)

## Context

Admin CRUD and domain logic must stay testable and swapable (Mongo today; possible read models later) without leaking persistence into React features.

## Decision

Each module follows **CSR ports**:

- Controllers / route handlers — HTTP envelope only
- Services — domain rules
- Repositories — ports + `repositories/mongo` adapters
- `di.ts` — wiring (stubs in Phase 0)

Features import `@/modules/<name>` public API only — never `repositories/mongo`.

## Consequences

- Phase 0 ships folder stubs + health/jobs only
- Real Product/Category schemas start Phase 2+
- Unit tests can mock repository ports without Next.js
