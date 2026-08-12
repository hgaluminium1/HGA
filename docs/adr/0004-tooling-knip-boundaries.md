# ADR 0004 — Tooling: Knip + ESLint boundaries

## Status

Accepted (Phase 0)

## Context

Dead code and layer leaks compound in a modular monolith. Architecture §4.3 / §45 require early enforcement.

## Decision

- **ESLint `boundaries`**: `app` / `feature` / `module` / `module-internal` / `components` / `lib` policies
- **Knip**: unused files/deps fail CI
- **size-limit**, Prettier, Stylelint (tokens-only raw colors), Husky + lint-staged, commitlint (Conventional Commits)
- Vitest smoke on `respondSuccess`; Playwright deferred to Phase 1 CI minutes

## Consequences

- Phase 0 stubs registered as Knip entries so intentional scaffolds are not false positives
- Boundaries deprecate legacy rule names — use `boundaries/dependencies` + `policies`
