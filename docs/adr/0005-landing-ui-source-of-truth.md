# ADR 0005 — Landing UI is source of truth

## Status

Accepted (Phase 1)

## Context

Public and admin chrome must share one visual language. The approved HTML prototype in `prototypes/landing/index.html` defines brand, type, spacing, and interaction patterns.

## Decision

1. Extract tokens once into `src/styles/tokens.css` (Stylelint allows raw values only there).
2. Rebuild Home as `features/public-home` organisms on shadcn/Radix — no parallel button/input systems.
3. Organism props + `data-block` attributes are the contract for Phase 2 Zod blocks / CMS.
4. Fifteen sitemap routes ship as shells under the same locale layout chrome.

## Consequences

- Phase 2+ swaps data sources without re-theming.
- Pixel fidelity is proven via Storybook + viewport reviews against the prototype.
- Admin will densify tokens via `--admin-*` aliases later without a second theme.
