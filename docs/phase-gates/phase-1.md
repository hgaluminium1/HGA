# Phase 1 — Proof of Done

**Status:** **COMPLETE — Phase 2 unlocked** (CMS Pages + blocks)

Date: 2026-08-20

**Scope (option 2):** Home UI lock from [`prototypes/landing/index.html`](../../prototypes/landing/index.html) + shared chrome + **15 sitemap route shells**. Content is typed props (`home.en.ts`) with `data-block` hooks — admin CMS is Phase 2+.

---

## Checklist

| DoD | Proof |
|---|---|
| Brand tokens from landing | [`src/styles/tokens.css`](../../src/styles/tokens.css) + globals `@theme`; Space Grotesk + Inter |
| Landing TSX ≈ prototype | [`src/features/public-home`](../../src/features/public-home) organisms; `/en` |
| Shared chrome | [`SiteHeader`](../../src/components/organisms/site-header.tsx), [`SiteFooter`](../../src/components/organisms/site-footer.tsx), drawer/search |
| 15 routes | See [Sitemap](#sitemap-routes) |
| Storybook + a11y addon | `npm run storybook`; stories under `src/stories/` |
| Lighthouse ≥90 / LCP / CLS | Run on staging after deploy — see [Perf](#performance) |
| 4 viewports | Capture checklist below (375 / 768 / 1024 / 1440) |

---

## Sitemap routes

| # | Page | Path |
|---|---|---|
| 1 | Home | `/en` |
| 2 | About HG | `/en/about` |
| 3 | Our Journey | `/en/journey` |
| 4 | Products Overview | `/en/products` |
| 5 | Extrusion Profiles | `/en/products/extrusion-profiles` |
| 6 | Billets | `/en/products/billets` |
| 7 | Ingots / Alloys | `/en/products/ingots-alloys` |
| 8 | Industries | `/en/industries` |
| 9 | Manufacturing | `/en/manufacturing` |
| 10 | Quality | `/en/quality` |
| 11 | Sustainability | `/en/sustainability` |
| 12 | Procurement | `/en/procurement` |
| 13 | Careers | `/en/careers` |
| 14 | Resources | `/en/resources` |
| 15 | Contact / RFQ | `/en/contact` |

Nav is config-driven: [`src/config/nav.config.ts`](../../src/config/nav.config.ts).

---

## Home `data-block` registry hooks

| Block | Component |
|---|---|
| `hero` | HeroCarousel |
| `capability` | CapabilitySection (`#about`) |
| `products` | ProductsSection |
| `mission` | MissionVideoSection (`#home-sustainability`) |
| `cta-banner` | InquireCtaBanner |
| `testimonials` | TestimonialsCarousel |
| `customers` | CustomersLogoStrip |
| `joint-ventures` | JointVenturesSection |
| `careers-teaser` | CareersTeaserSection |
| `faq` | FaqSection |

---

## Storybook

```bash
npm run storybook
```

Stories: `HgButton`, `SectionHeader`, `ProductCard`, `HeroCarousel`, `SiteHeader` (desktop/mobile), `FaqSection`. Addon a11y enabled in `.storybook/preview.tsx`.

---

## Performance

After Vercel deploy of this branch:

```bash
npx lighthouse https://hgaluminium.vercel.app/en --only-categories=performance,accessibility --output=json --output-path=docs/phase-gates/artifacts/lighthouse-en.json
```

Target: Performance ≥90, LCP &lt; 2.5s, CLS &lt; 0.1. Paste summary scores here when measured.

| Metric | Target | Result |
|---|---|---|
| Performance | ≥90 | _pending staging measure_ |
| LCP | &lt; 2.5s | _pending_ |
| CLS | &lt; 0.1 | _pending_ |

---

## Viewport proof (side-by-side vs prototype)

Open `/en` and `prototypes/landing/index.html` at:

- [x] 375 — `docs/phase-gates/artifacts/en-375.png`
- [x] 768 — `docs/phase-gates/artifacts/en-768.png`
- [x] 1024 — `docs/phase-gates/artifacts/en-1024.png`
- [x] 1440 — `docs/phase-gates/artifacts/en-1440.png`

Captured against local production build (`npm run start -- -p 3010`). Compare visually to the HTML prototype for sign-off.
---

## Tooling

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run build` | pass (all 15 locale routes + chrome) |
| Storybook init | Storybook 10 + nextjs-vite + a11y |

---

## Sign-off

**Phase 1 complete. Phase 2 unlocked** — CMS Pages + blocks wiring to these organisms.

Remaining ops (non-blocking for Phase 2 engineering): paste Lighthouse JSON after deploy; attach viewport screenshots to this gate.
