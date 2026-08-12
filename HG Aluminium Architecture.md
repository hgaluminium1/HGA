# HG Aluminium Smelters — Website & CMS Architecture Document

**Stack:** Next.js (App Router, TypeScript) · MongoDB + Mongoose · Custom Admin CMS
**Deployment model:** Single deployable app (modular monolith) — domain modules with enforced boundaries; not a monorepo, not microservices
**Cost model:** **$0 for staging and production except custom domain.** All platform deps stay on permanent free tiers; paid only when a *usage* limit is hit (storage, email volume, worker size) — not as a go-live tax.
**Reference:** cmr.co.in (structural/IA reference, not visual)
**Status:** v1.7 — living document
**v1.7 focus:** Close remaining scale/dynamic gaps — jobs/cron · redirects · preview · CSV · form fields CMS · dictionary CMS · concurrent edit · public cache · observability/DR · entity scaffold · search ladder · consent · bundle CI
**v1.6 carry-over:** State model · CSR · feature frontend · phase gates · Knip · responsive matrix · PWA · landing UI source · CMS self-serve
**v1.5–v1.4 carry-over:** A–I corporate · Radix/shadcn · N-level categories · trash · free prod · email leads · i18n

**Evidence base (no invented claims):** TanStack Query Advanced SSR; bulletproof-react; ports-and-adapters repos; Knip; Serwist; RHF validation modes; MongoDB Array of Ancestors + cursor pagination; Shopify modular monolith; Cloudflare Workers Cron Triggers (documented free-tier scheduled jobs); Next.js `revalidateTag` / ISR; industry IR/CMS redirect + draft-preview patterns.

---

## 1. Goals & Constraints (from requirements gathering)

| Constraint | Decision it drives |
|---|---|
| Client self-manages all pages, any device | Mobile-usable admin UI |
| Multi-language (export) later | Locale-aware content model + **single-craft locale registry** from day one; ship **English only** now |
| Full SEO | SSR/ISR, structured data, dynamic sitemap |
| No post-launch maintenance contract | Genuinely self-serve admin |
| Requirements will change | Registries + config over hardcoding |
| Brand assets pending | Tokens first; swap later |
| Reference cmr.co.in | IA/patterns only, not visuals |
| **Production free except domain** | Hosting path that **allows commercial use on free tier** (§3, §16). Vercel Hobby is staging/preview only |
| Landing page first | You design in **HTML/CSS/JS**; then migrate to TSX on Radix/shadcn (§18) |
| Every component syncs with structure | Tooling-enforced conventions |
| Global UI/UX, page-level override | Token + closed `appearance` variants |
| **Products & Categories effortless CRUD** | Catalog module; **N-level** category tree |
| Non-technical client | Forgiving CRUD, responsive shell |
| **No custom atomic UI from scratch** | **Radix primitives + shadcn/ui** owned in-repo; compose HG atoms/molecules on top |
| Leads | **Email only** — all leads in CMS + Resend notification; no CRM webhook now |
| Trash | **30-day auto purge** + **admin can purge/restore anytime** |
| **Client content brief (A–I)** | Full site IA driven by supplied checklist — legal, leadership, capacity, expansion, products, quality, proof, ESG, media (§23) |
| **HG is a Public Limited Company** | Leadership + governance + optional investor section must be first-class CMS content, not hardcoded pages (§23.2, §23.11) |
| **Draft ≠ publishable** | Handwritten / projection numbers stay **draft** until client verifies; CMS blocks publish gate (§23.12) |
| **CMS owns the whole site** | Products, quality, sustainability, media, leadership, capacity, expansion, legal — all CRUD in admin. **Developer not required for content/expansion after launch** (§24) |
| **Landing page = UI source of truth** | Entire public + admin chrome tokens/spacing/type extracted from your landing HTML; no second visual language (§18, §7) |
| **DB must be swappable** | Controller → Service → Repository port; Mongo is one adapter (§25) |
| **Feature-based frontend** | UI colocated by feature; `app/` stays thin routes (§6, §25.3) |
| **PWA** | Installable public site + offline fallback; admin network-first (§29) |
| **Phase gates** | Each phase has Definition of Done **and** Proof of Done artifacts before next phase starts (§26) |
| **Scale / dynamic gaps closed** | Jobs, redirects, preview, CSV, dictionaries CMS, concurrency, cache, observability — decided §22, §32–§48 |
| **Legal / leadership / capacity change later** | CMS-editable; architecture does not freeze those values. Client will supply legal. Leadership + production figures change in admin anytime. |

### 1.1 Guiding engineering principles

1. **Composition over duplication**
2. **Additive change over modification** (registries)
3. **Server-first rendering**
4. **Schema at the boundary** (Zod)
5. **Boring, provable infra**
6. **Convention enforced by machine** (lint + boundaries)
7. **Domain modules** (Shopify-style modular monolith)
8. **Admin learnability** (one list + one editor pattern)
9. **Own accessible primitives, don't reinvent them** — Radix for behavior/a11y; shadcn for owned source; tokens for brand
10. **Config > hardcode** — locales, nav, block types, seed categories, retention days, feature flags live in config/registries
11. **Verified content only on public site** — metrics, ESG figures, financial projections, customer logos require explicit approval flags before SSR/ISR serves them
12. **Server Components own public data; TanStack Query owns admin server-state** — do not duplicate both on every page (§27)
13. **Repository ports, not Mongoose in services** — swap DB by writing a new adapter (§25)
14. **Landing tokens first** — every later page inherits the same system; deviation = `appearance` / `themeOverride` only

---

## 2. Tech Stack

| Layer | Choice | Why | Free? |
|---|---|---|---|
| Framework | Next.js (App Router) | SSR + ISR + RSC | ✅ |
| Language | TypeScript (strict) | Contracts across CMS/API/UI | ✅ |
| Database | MongoDB Atlas + Mongoose | Document CMS + catalog trees | ✅ Atlas M0 |
| Styling | Tailwind + CSS tokens | Utility-first, one token source | ✅ |
| **UI primitives** | **Radix UI** | Headless a11y (focus, keyboard, ARIA) — do **not** rebuild Dialog/Select/Popover | ✅ |
| **UI scaffolding** | **shadcn/ui** (CLI → `components/ui`) | Copy-owned source on Radix+Tailwind+CVA; enterprise pattern (own code, no black-box library) | ✅ |
| Variant system | CVA | Variants on shadcn/HG components | ✅ |
| Forms | React Hook Form + Zod | Shared client/server validation | ✅ |
| Admin server-state | **TanStack Query v5** | Caching, optimistic CRUD, invalidation — **admin only** (TanStack SSR docs: skip Query on public RSC unless client interactivity needed) | ✅ |
| Public data | **RSC + module services** | HTML from server; ISR revalidate on publish | ✅ |
| UI / ephemeral state | React state + **URL searchParams** | Filters, pagination cursor, sidebar open — shareable, no Redux | ✅ |
| Forms | React Hook Form + Zod | Same schema client + server; `mode: onTouched`, `reValidateMode: onChange` | ✅ |
| PWA | **Serwist** (`@serwist/next`) | Maintained successor to `next-pwa`; SW + manifest + offline page | ✅ |
| Dead code | **Knip** + unused-imports ESLint | CI fails on unused files/exports/deps | ✅ |
| Drag / reorder | dnd-kit | Blocks, category siblings, images | ✅ |
| Command palette | cmdk | Admin jump-to | ✅ |
| Auth | Auth.js v5 | Credentials + JWT + roles | ✅ |
| Media | Cloudflare R2 | Zero egress | ✅ 10GB |
| Video | YouTube/Vimeo unlisted | Zero bandwidth | ✅ |
| Email | Resend | Lead notifications | ✅ 3k/mo |
| Rate limit / cache | Upstash Redis | Rate limits + short-lived locks / cache keys | ✅ |
| **Jobs / cron** | **Cloudflare Cron Triggers** (prod) + **GitHub Actions schedule** (staging fallback) | Trash purge, scheduled publish, stale preview cleanup — see §32 | ✅ free tier* |
| i18n | next-intl | Locale routing; add language = config + messages file | ✅ |
| Analytics | GA4 + Search Console | Required analytics | ✅ |
| Monitoring | Sentry | Errors | ✅ 5k/mo |
| Testing | Vitest + Playwright | Unit + e2e | ✅ |
| Workshop | Storybook + a11y | Component states + a11y | ✅ |
| Lint gate | ESLint + Prettier + Stylelint + Husky + lint-staged + commitlint + eslint-plugin-boundaries + **Knip** | Structure + module boundaries + dead code | ✅ |
| CI/CD | GitHub Actions | Gate every PR | ✅ |
| **Staging / preview host** | **Vercel Hobby** | Best Next DX, PR previews — **non-commercial only** per Vercel fair use | ✅ staging |
| **Production host** | **Cloudflare Workers + OpenNext** (`@opennextjs/cloudflare`) | **Commercial use allowed on free tier**; custom domain attaches; App Router / SSR / ISR supported per Cloudflare+OpenNext docs | ✅ production* |

\*Honest free-tier ceilings (not go-live fees): Workers free plan has a **compressed Worker size limit** (documented ~3 MiB). If the production bundle exceeds it, Workers Paid (~$5/mo) is a *usage* upgrade — disclose to client; prefer keeping bundle lean. Atlas M0 / Resend / R2 / Upstash / Sentry stay free until their own usage triggers.

---

## 3. Free Stack — Staging AND Production ($0 Except Domain)

| Service | Free tier role | Staging | Production commercial? | Upgrade trigger |
|---|---|---|---|---|
| **Vercel Hobby** | Preview deploys, PR URLs, staging demos | ✅ | ❌ **Forbidden** (personal/non-commercial only — Vercel fair use) | N/A for prod |
| **Cloudflare Workers + OpenNext** | Live commercial site + custom domain | Optional | ✅ **Allowed** | Worker size / request limits |
| **MongoDB Atlas M0** | All envs DB | ✅ | ✅ until storage/CPU pain | → M10 when needed |
| **Cloudflare R2** | Media | ✅ | ✅ | >10GB storage |
| **Resend** | Lead emails | ✅ | ✅ | >100/day or 3k/mo |
| **Upstash Redis** | Rate limits | ✅ | ✅ | command volume |
| **Sentry Developer** | Errors | ✅ | ✅ | 2nd seat / volume |
| **GitHub Actions** | CI | ✅ | ✅ | rare |
| **GA4 / GSC** | Analytics | ✅ | ✅ | never |
| Open-source libs | App code | ✅ | ✅ | never |

### What you pay at go-live

1. **Custom domain only** (e.g. `hgaluminium.com`) → DNS to Cloudflare.
2. Nothing else **required** for launch if free-tier ceilings hold.

### Staging vs production split (decided)

```
PR / staging  → Vercel Hobby  (*.vercel.app)     [non-commercial OK]
Production    → Cloudflare Workers (OpenNext)    [commercial OK] + custom domain
```

Same codebase; deploy adapters differ (`vercel` vs `opennextjs-cloudflare`). CI can deploy staging to Vercel on PR and production to Cloudflare on `main`.

---

## 4. Development Standards & Conventions

### 4.1 Naming & file conventions

| What | Convention | Example |
|---|---|---|
| shadcn primitives | `components/ui/*` (CLI-owned) | `components/ui/button.tsx` |
| HG composed UI | PascalCase folders under atoms/molecules/organisms | `components/molecules/FormField/` |
| Hooks | `use` prefix | `useProducts.ts` |
| Routes | kebab-case | `/admin/catalog/products` |
| Models | Singular PascalCase | `Product.ts` |
| API | `route.ts` in resource folder | `/api/v1/products/route.ts` |
| Zod | `*Schema` | `productSchema` |
| Types | `z.infer<>` only | — |
| Modules | `/src/modules/<domain>` | `modules/catalog` |
| Public module API | `index.ts` only | `@/modules/catalog` |

### 4.2 Component layers (strict — no reinventing primitives)

```
Layer 0  Radix primitives          (dependency — behavior + a11y)
Layer 1  components/ui/*           (shadcn CLI output — OWNED source)
Layer 2  atoms / molecules         (HG wrappers: brand tokens, CVA variants, FormField)
Layer 3  organisms / templates     (Header, ProductCard, admin shell pieces)
Layer 4  pages / CMS blocks        (compose only)
```

**Rule:** Never hand-roll Dialog, Dropdown, Select, Tabs, Checkbox, Switch, Popover, Tooltip, Accordion, Toast, Sheet from scratch. Add via `npx shadcn@latest add …`, then theme via tokens. Build HG molecules/organisms **on top**.

File shape for Layer 2+:

```
/components/molecules/FormField/
  FormField.tsx
  FormField.stories.tsx
  FormField.test.tsx
  index.ts
```

### 4.3 Enforcement

- ESLint + Prettier + Stylelint (no raw hex/px / arbitrary brackets outside tokens)
- **eslint-plugin-boundaries** — modular-monolith + feature import rules
- **Knip** — unused files/exports/deps fail CI
- Husky + lint-staged + commitlint (Conventional Commits)
- Trunk-based short branches; CI green required

### 4.4 Frontend standards

| Rule | Practice |
|---|---|
| Primitives | Radix via shadcn only |
| Tokens | Semantic CSS vars → Tailwind map |
| Appearance | Closed variant enums |
| A11y | WCAG AA; Storybook a11y |
| Responsive | §7.4 matrix — Playwright 375/768/1024/1440 |
| States | loading / empty / error required |
| Touch | ~44px min admin targets |

### 4.5 Backend — Controller / Service / Repository (locked)

Every HTTP mutation/read follows the same stack. **Mongoose never appears in controllers or services.**

| Layer | File | Owns | Must not own |
|---|---|---|---|
| **Controller** | `app/api/v1/.../route.ts` | Parse request, Zod, auth, call service, map `ApiResponse` | Business rules, DB queries |
| **Service** | `modules/<d>/services/*.ts` | Invariants, orchestration, events (revalidate, audit, email) | HTTP, Mongoose, ObjectId |
| **Repository (port)** | `modules/<d>/repositories/*.port.ts` | Interface: `findById`, `listCursor`, `save`, `softDelete` using **domain IDs (`string`)** | Mongo types |
| **Repository (adapter)** | `modules/<d>/repositories/mongo/*.ts` | Mongoose mapping, indexes, `$in` queries | Business rules |

Swap database later: implement `PostgresProductRepository` (or other) against the **same port**. Wire in `modules/<d>/di.ts`. Services unchanged. This is ports-and-adapters (hexagonal) applied at module scale — not a second framework.

**In-memory adapter** for Vitest: `InMemoryProductRepository` — proves services without Atlas.

### 4.6 Database standards

- Index real query shapes
- Soft delete = `deletedAt` (+ `deletedBy`)
- **Optimistic concurrency** = `version` number on all mutable entities (§42)
- Partial unique indexes on active rows
- Central `notDeleted` filter in services
- Cursor pagination for admin lists
- **N-level categories:** Array of Ancestors + `parentId` + `level` (MongoDB official pattern) — §9.2
- Trash retention: config `TRASH_RETENTION_DAYS=30` + admin force-purge

### 4.7 API envelope

```ts
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string; fields?: Record<string, string> } };

type CursorPage<T> = { items: T[]; nextCursor: string | null; total?: number };
```

### 4.8 ADRs

`/docs/adr/` — include: modular monolith, CSR ports, TanStack-admin-only, Serwist PWA, Knip, jobs/cron, dictionary CMS, redirects, preview, optimistic locking, cache tags, free commercial hosting, N-level categories, shadcn-not-custom-atoms, trash, email-only leads, i18n single-craft, landing-as-UI-source.

### 4.9 Definition of Done (every PR)

- [ ] Correct layer (ui vs composed vs organism vs feature)
- [ ] Tokens only; no raw hex/px
- [ ] Module + feature boundaries OK (`eslint-plugin-boundaries`)
- [ ] Controller thin; service DB-agnostic; repo behind port
- [ ] Storybook + a11y (composed components)
- [ ] Tests for core behavior (service + at least one RTL or Playwright path for CRUD)
- [ ] Registry/config — not hard-wired
- [ ] Admin: confirm + soft-delete + responsive at 375 / 768 / 1024 / 1440
- [ ] Knip clean (no new unused exports/files)
- [ ] Forms: Zod shared; validation timing per §28
- [ ] Pagination: cursor in URL for lists

**Phase-level DoD + Proof of Done:** §26. A PR DoD is necessary but not sufficient to start the next **phase**.

---

## 5. High-Level Architecture — Modular Monolith

One Next.js deployable. Domains: `catalog`, `cms`, `corporate`, `leads`, `media`, `identity`. Public API only via `modules/*/index.ts`. Platform code in `/lib` (db, types, email, rate-limit) — no domain rules.

**`corporate` module (v1.5):** company profile (A), people/leadership (B), capacity metrics (C), expansion projects (D), certifications (F), customer proof (G), sustainability metrics (H). Keeps “about the company” data out of generic Page blocks and out of `catalog`.

```
CDN / Edge
    → Next.js
        Public RSC  → feature UI → module **service** → **repository port** → Mongo adapter
        Admin client → TanStack Query → /api/v1 **controller** → service → repository port → Mongo adapter
            → media → R2
            → identity → Auth.js
```

`eslint-plugin-boundaries` encodes: app → module public API only; no cross-module deep imports; components never import Mongoose models.

---

## 6. Repository Structure

```
/docs/adr
/prototypes                          # YOUR HTML/CSS/JS landing designs (source of truth before TSX)
  /landing
    index.html
    styles.css
    main.js

/src
  /app
    /(public)/[locale]/
      page.tsx                          # landing / home
      about/page.tsx
      leadership/page.tsx
      capacity/page.tsx                   # §C
      expansion/page.tsx                  # §D
      quality/page.tsx                    # §F
      sustainability/page.tsx             # §H
      customers/page.tsx                  # §G
      investors/page.tsx                  # §B (feature-flag until content ready)
      products/...
      contact/page.tsx
      [...catchall]/page.tsx              # CMS pages
    /(admin)/admin/
      layout.tsx
      /dashboard
      /catalog/products/...
      /catalog/categories/...         # N-level tree UI
        /pages/...
        /corporate
          /company/page.tsx             # A: legal + contact (from CompanyProfile)
          /leadership/page.tsx          # B: directors grid
          /investors/page.tsx           # B: governance, reports (if client enables)
          /capacity/page.tsx            # C: current production
          /expansion/page.tsx           # D: future projects (disclosure-gated)
          /quality/page.tsx             # F: certs + policy
          /sustainability/page.tsx      # H: ESG (tier-labelled metrics)
          /customers/page.tsx           # G: logos, case studies, testimonials
        /corporate/people/...           # CRUD editors (shared shell)
        /corporate/capacity-metrics/...
        /corporate/expansion/...
        /corporate/certifications/...
        /corporate/case-studies/...
        /corporate/testimonials/...
        /corporate/customer-logos/...
        /corporate/sustainability/...
        /media
        /leads                          # email-notified leads inbox
        /trash
        /settings                       # CompanyProfile shortcut + retention + locales
        /users
    /api/v1/...
    sitemap.ts
    robots.ts

  /modules
    /catalog
      index.ts                          # public API only
      /domain                           # entities + types (string ids, no mongoose)
      /validators                       # Zod
      /services                         # productService, categoryTreeService
      /repositories
        product.repository.ts           # PORT (interface)
        category.repository.ts
        /mongo                          # ADAPTER
          product.mongo.ts
          category.mongo.ts
          Product.model.ts              # Mongoose schema lives HERE only
      /di.ts                            # bind port → mongo adapter
    /cms ...
    /corporate ...                      # same CSR shape
    /leads ...
    /media ...
    /identity ...
    /jobs                               # job registry + runners (§32)
      index.ts
      trashPurge.ts
      scheduledPublish.ts
      previewExpire.ts
      webhookRetry.ts

  /features                             # FRONTEND by feature (bulletproof-react)
    /public-home                        # landing organisms wired to CMS later
    /public-catalog
    /public-corporate                   # about, leadership, quality, sustainability
    /admin-shell
    /admin-catalog
    /admin-corporate
    /admin-media
    /admin-leads
    Each feature:
      components/  hooks/  api/ (TanStack keys)  index.ts
      # no cross-feature deep imports; no mongoose

  /components                           # SHARED UI only (used by 2+ features)
    /ui                                 # shadcn
    /atoms /molecules /organisms /templates
    /cms-blocks
    /admin                              # DataTable, SaveBar, shell — shared admin chrome

  /lib
    /query                              # QueryClient factory (per-request server, singleton client)
    /db/connect.ts                      # adapter infra only
    /http                               # respondSuccess / respondError
    /types/api.ts

  /components
    /ui                               # shadcn CLI output ONLY (Button, Dialog, Sheet, Table, Tabs…)
    /atoms                            # thin HG wrappers over /ui when needed
    /molecules
    /organisms
    /templates
    /cms-blocks
    /admin
      DataTable/
      CategoryTree/                   # expandable N-level tree (Radix Accordion/Collapsible + dnd-kit)
      ConfirmDialog.tsx               # wraps ui/alert-dialog
      UndoToast.tsx
      ContextualSaveBar.tsx
      CommandPalette.tsx
      ResponsiveAdminShell.tsx
      TabbedForm.tsx
      InlineCreateModal.tsx
      EmptyState.tsx
      BulkActionBar.tsx
      MobileRowActionSheet.tsx

  /lib
    /db/connect.ts
    /types/api.ts
    /email
    /rate-limit
    /utils
    /constants

  /i18n
    routing.ts                        # locales[] + defaultLocale — ADD LANGUAGE HERE
    request.ts
  /messages
    /en
      common.json
      admin.json
      catalog.json
    # /hi /ar … added later: copy folder + add to routing.locales

  /styles/tokens.css
  /config
    site.config.ts                    # brand name, domain, feature flags
    admin-nav.config.ts
    trash.config.ts                   # retentionDays: 30
    i18n.config.ts                    # re-export routing locales
    categories.seed.json              # initial tree (client-editable)
    specs.dictionary.seed.ts          # one-time seed → Dictionary CMS (§33)
    media-tags.seed.ts
    disclosure.config.ts              # H + D defaults
    size-limit.json                   # bundle budget (§45)

/public
/tests
/docs
  /content-intake                     # client brief A–I checklist (reference only)
  /content-verification               # sign-off log per metric before publish
```

---

## 7. Global Design System — Radix + shadcn + Tokens

### 7.1 Decision (locked)

**Do not build a custom atomic primitive library.** Use:

1. **Radix** — accessible behavior
2. **shadcn/ui** — owned React source in `components/ui`
3. **HG tokens + CVA** — brand skin and variants
4. **Molecules/organisms** — product-specific composition

This matches the documented shadcn model (copy source, theme with CSS variables) used by serious product teams who need control without maintaining Dialog/Select from zero.

### 7.2 Tokens

```css
:root {
  --background: …;
  --foreground: …;
  --primary: …;
  --radius: …;
  /* map into Tailwind / shadcn CSS variable contract */
  --font-display: …; /* placeholder until brand fonts */
  --font-body: …;
  --admin-touch-min: 2.75rem;
}
```

Stylelint blocks raw values outside `tokens.css` / CVA maps.

### 7.3 Page-level customization

Closed `appearance`: `default | inverted | tinted | compact`. Optional `themeOverride` on Page/Product. No ad-hoc page CSS.

### 7.4 Responsive strategy — every page, every layout

**One layout contract.** No page invents its own breakpoints. Tokens + `ResponsiveLayout` primitives only.

**Viewport tokens** (aligned to Tailwind defaults; values live in `tokens.css`):

| Token | Width | Typical device |
|---|---|---|
| `--bp-sm` | 640px | large phone |
| `--bp-md` | 768px | tablet portrait |
| `--bp-lg` | 1024px | tablet landscape / small laptop |
| `--bp-xl` | 1280px | desktop |
| `--bp-2xl` | 1536px | wide |

**Playwright proof viewports (required):** `375`, `768`, `1024`, `1440`.

#### Public site (landing-derived)

| Region | <640 | 768 | 1024 | ≥1280 |
|---|---|---|---|---|
| Header | Hamburger + logo | Same | Full nav + CTA | Full nav + CTA |
| Hero | Stacked; type scale down | Stacked | Split if landing has split | Match landing desktop |
| Stats / metric row | 1 col | 2 col | 3–4 col | 4 col; container query if inside narrow column |
| Product grid | 1 | 2 | 3 | 3–4 |
| Leadership cards | 1 | 2 | 3 | 3–4 |
| Cert / logo strip | Horizontal scroll snap **or** wrap | wrap | wrap | wrap |
| Gallery | 1 | 2 | 3 | 4 |
| Footer | Stack | 2 col | 4 col | 4 col |
| Forms (contact) | 1 col; 44px targets | 1–2 | 2 | 2 max-width |
| Tables (spec sheets) | Card transform | Card or reduced cols | Table | Table |

**Container queries:** `ProductCard`, `StatCard`, `MediaTile` — react to **parent width**, not only viewport (card in sidebar vs main grid).

**Safe areas:** `env(safe-area-inset-*)` on sticky header/footer/save bar.

#### Admin (viewport-driven chrome)

| Region | <768 | 768–1023 | ≥1024 |
|---|---|---|---|
| Sidebar | Drawer (Sheet) | Icon rail | Fixed labels |
| Navbar | Hamburger + title + avatar | Condensed search | Breadcrumb + search + user |
| DataTable | Card list + bottom sheet actions | Drop priority-3 cols | Full table + sticky header |
| Filters | Full-screen sheet | Drawer | Inline toolbar |
| Forms | 1 col + sticky SaveBar | 2 col | 2–3 col; SaveBar top or bottom |
| Category tree | Accordion | Scroll tree | Full tree + drag |
| Bulk bar | Sticky bottom | Sticky bottom | Sticky top of table |
| Dialogs | Full-screen Sheet | Dialog | Dialog |
| Pagination | Prev/Next + “Load more” optional | Cursor controls | Cursor + page size |

**Rule:** Page files never write `@media` with raw px. They compose `PageShell`, `Section`, `Grid` from the design system. Stylelint + review catch exceptions.

**Reduced motion:** `prefers-reduced-motion` — disable carousel autoplay, drawer slide, toast motion.

**Touch vs pointer:** `@media (pointer: coarse)` — larger hit areas on admin row actions.

---

## 8. Dynamic CMS — Block-Based Content Model

Unchanged core: Page = ordered Blocks (`type`, `order`, `data`, `appearance`). Zod validates `data`. Registry adds/removes section types without core edits. Soft-delete on Page. Partial unique `{ slug, locale }` among active docs.

### 8.1 Block registry (v1.5 — aligned to client brief A–I)

Blocks **compose** pages; structured facts live in `corporate` / `catalog` modules and are **referenced** by blocks (by id or auto-fetch), not duplicated in free text.

| Block type | Client section | Data source | Notes |
|---|---|---|---|
| `hero` | Landing / any | Block payload | Phase 1 landing |
| `stats` | **C** capacity | `CapacityMetric[]` where `publishStatus=verified` | Never hardcode MT figures in block JSON |
| `leadership-grid` | **B** | `Person[]` | Director photos + bios |
| `chairman-message` | **B** | `Person` or block rich text | Single featured leader |
| `company-facts` | **A** | `CompanyProfile` singleton | CIN, GST, addresses, dept emails |
| `expansion-roadmap` | **D** | `ExpansionProject[]` where `publicDisclosureApproved=true` | Label proposed vs confirmed |
| `product-grid` | **E** | `Product[]` from catalog | Filter by category |
| `cert-grid` | **F** | `Certification[]` | PDF + validity badge |
| `quality-process` | **F** | Block + linked Media samples | Spectro/hardness sample PDFs |
| `logo-strip` | **G** | `CustomerLogo[]` where `approvedForWebsite=true` | Permission gate |
| `testimonial-carousel` | **G** | `Testimonial[]` | |
| `case-study-list` | **G** | `CaseStudy[]` | |
| `sustainability-metrics` | **H** | `SustainabilityMetric[]` | **Must render disclosure tier** (§23.8) |
| `gallery` | **I** | `Media[]` by tag | Drone, furnace, extrusion, METAL TOUCH, etc. |
| `video-embed` | **I** | YouTube/Vimeo URL | Press / drone video |
| `enquiry-form` | Contact | Leads module | Routes to CMS + email |
| `investor-doc-list` | **B** | Media + metadata | Annual report, governance PDFs — only if client supplies |

**Add block** → registry entry + renderer + Zod schema. **Remove block** → delist from picker; existing pages fail soft.

---

## 9. Products & Categories — N-Level Catalog

### 9.1 Product = structured fields + CMS blocks

Queryable specs + rich blocks. Same as v1.3 intent.

### 9.2 Category model — N-level (decided)

**Requirement:** unlimited depth (N-level), optimized for read-heavy public catalog + admin tree ops.

**Chosen pattern (MongoDB official — Array of Ancestors):**

Research summary (MongoDB docs + hierarchy literature):

| Pattern | Reads (subtree) | Writes / moves | Fit for HG |
|---|---|---|---|
| Adjacency only (`parentId`) | Slow / recursive / `$graphLookup` | Fast | Too weak for public “all under Series 6xxx” |
| Nested sets | Fast | Painful on insert/move | Bad for client-edited trees |
| Closure table | Fast | Extra collection | Overkill at this catalog size |
| **Array of Ancestors + parentId + level** | **Fast indexed subtree** | Medium on move (update descendants) | **Best fit** — MongoDB documented |

```ts
// modules/catalog/models/Category.ts
const CategorySchema = new Schema(
  {
    name: { type: Map, of: String, required: true }, // { en: "6xxx Series" }
    slug: { type: String, required: true, index: true },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    /** Root → … → parent ids (excludes self). Indexed for subtree queries. */
    ancestorIds: [{ type: Schema.Types.ObjectId, ref: "Category", index: true }],
    /** Depth from root: root = 0. Denormalized for UI / soft caps. */
    level: { type: Number, required: true, default: 0, index: true },
    /** Optional string path for breadcrumbs/debug: "/id1/id2/" */
    path: { type: String, index: true },
    description: { type: Map, of: String },
    image: { type: Schema.Types.ObjectId, ref: "Media" },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    deletedAt: { type: Date, default: null, index: true },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

CategorySchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);
CategorySchema.index(
  { parentId: 1, order: 1 },
  { partialFilterExpression: { deletedAt: null } }
);
CategorySchema.index({ ancestorIds: 1 }); // subtree: { ancestorIds: parentId }
```

**Soft UX cap (not a hard schema limit):** `config/categories.config.ts` → `softMaxLevel: 8`. Admin warns above soft max; schema still allows N. Prevents accidental 20-deep trees while staying N-level capable.

**Write path (service):**

1. Create under parent → copy `parent.ancestorIds + [parent._id]`, set `level = parent.level + 1`, build `path`.
2. Move node → bulk-update node + all docs with `ancestorIds: nodeId` (rewrite ancestors/path/level). Rare for this business; OK cost.
3. Reorder → update `order` among same `parentId` only (dnd-kit).
4. Delete → block if children or products; else soft-delete.

**Read path (hot):**

- Children of X: `{ parentId: X, deletedAt: null }` sorted by `order`
- Entire subtree under X: `{ ancestorIds: X, deletedAt: null }` — **one indexed query**
- Breadcrumbs: map `ancestorIds` + self (or split `path`)
- Products in subtree: find category ids in subtree, then `{ categoryIds: { $in: ids }, status: "published", deletedAt: null }`

### 9.3 Seed / initial tree (template — client replaces)

Initial list is **config-driven**, not hardcoded in UI. File: `config/categories.seed.json`. Example structure for aluminium extrusion (illustrative until client confirms names):

```json
[
  {
    "name": { "en": "Aluminium Extrusions" },
    "slug": "aluminium-extrusions",
    "children": [
      {
        "name": { "en": "6xxx Series" },
        "slug": "6xxx-series",
        "children": [
          { "name": { "en": "6063" }, "slug": "6063" },
          { "name": { "en": "6061" }, "slug": "6061" },
          { "name": { "en": "6082" }, "slug": "6082" }
        ]
      },
      {
        "name": { "en": "7xxx Series" },
        "slug": "7xxx-series",
        "children": [
          { "name": { "en": "7075" }, "slug": "7075" }
        ]
      },
      {
        "name": { "en": "Profiles by Application" },
        "slug": "profiles-by-application",
        "children": [
          { "name": { "en": "Architectural" }, "slug": "architectural" },
          { "name": { "en": "Industrial" }, "slug": "industrial" },
          { "name": { "en": "Automotive" }, "slug": "automotive" }
        ]
      }
    ]
  }
]
```

Admin can add/remove/reparent any depth after seed. **Client must confirm final names** — seed is a starting template only.

### 9.4 Product model (extended from client brief §E)

Structured fields on `Product` (admin dropdowns driven by **Dictionary CMS** §33 — seeded once, then client-editable):

| Field group | Client §E items | Admin UX |
|---|---|---|
| Identity | SKU, name, slug, categories | Tab: Basic |
| Specs | Alloy grades (6063, 6061, 6082, 6351, **1050**, …) | Multi-select from dictionary |
| Specs | Temper (T5, T6, …) | Multi-select |
| Specs | Surface finish, anodizing colors, powder coating RAL | Multi-select / color refs |
| Specs | Tolerance standards (IS, ASTM, EN, DIN, JIS) | Multi-select |
| Specs | Max/min dimensions, max profile width/length, weight/m | Numbers — **must match verified CapacityMetric where applicable** |
| Specs | Packaging method | Text / enum |
| Process | Custom profile process, die development time, sample approval | Rich text or structured steps |
| Media | Product photos, **profile drawings** | Media picker; `Media.kind = drawing` |
| Content | Description, certifications, galleries | CMS blocks (§8) |
| SEO | meta | Tab: SEO |

**Standard sections list:** either separate `Product` rows under a “Standard Sections” category branch, or dedicated `Product.type = standard_section` flag — client chooses during catalog setup. Architecture supports both via category tree (§9.2).

**Complete catalogue:** populated via admin CRUD + optional CSV import (post-MVP). No assumed product list in code.

Partial unique indexes + soft-delete unchanged from §9.2–§9.3.

### 9.5 Service invariants

| Action | Rule |
|---|---|
| Create/update product | Unique active sku/slug; default draft |
| Soft-delete product | `deletedAt`; Undo toast; Trash |
| Duplicate | Clone → draft; SKU suffix `-COPY` |
| Bulk | Per-id errors in envelope |
| Create category | Parent exists; maintain ancestors/level/path; respect softMax warning |
| Reorder | Same parent only |
| Move category | Rewrite ancestors for subtree |
| Delete category | Block if children OR products; offer reassign |
| Restore | Clear `deletedAt`; re-check uniqueness |
| Purge | Admin explicit **or** job after retention days |

### 9.6 Admin CRUD — Categories (N-level UI)

| Flow | Behavior |
|---|---|
| List | **Expandable tree** (`CategoryTree`) — indent by `level`; expand/collapse; product-count badge |
| Add child | Row action “Add subcategory” pre-fills parent |
| Reorder | Drag within siblings (same parent) |
| Edit | Drawer or edit page: name, slug, parent (searchable tree picker), image, status |
| Delete | Guarded; explain reassignment |
| Mobile | Nested cards / accordion — large touch targets; actions in bottom sheet |

Products flows unchanged in spirit: DataTable, tabbed editor, inline create category modal, Contextual Save Bar, duplicate, bulk publish/delete.

### 9.7 API

| Method | Path | Purpose |
|---|---|---|
| GET/POST | `/api/v1/products` | List/create |
| GET/PATCH/DELETE | `/api/v1/products/[id]` | CRUD soft-delete |
| POST | `/api/v1/products/[id]/duplicate` | Clone |
| POST | `/api/v1/products/bulk` | Bulk |
| GET | `/api/v1/categories?view=tree\|flat` | Tree or flat |
| POST | `/api/v1/categories` | Create |
| GET/PATCH/DELETE | `/api/v1/categories/[id]` | Read/update/soft-delete |
| PATCH | `/api/v1/categories/reorder` | Sibling order |
| PATCH | `/api/v1/categories/[id]/move` | Change parent |
| POST | `/api/v1/trash/:entity/:id/restore` | Restore |
| DELETE | `/api/v1/trash/:entity/:id/purge` | Hard delete (admin) |
| GET/POST | `/api/v1/jobs/[name]` | Cron jobs (secret) |
| GET | `/api/v1/health` | DB ping |
| GET | `/api/v1/forms/[key]` | FormDefinition schema |
| GET/POST | `/api/v1/preview` | Draft preview tokens |
| GET/POST | `/api/v1/dictionaries` | Dictionary CMS |
| GET/POST | `/api/v1/redirects` | Redirect map |

---

## 10. Admin Panel — Responsive Non-Tech CRUD

### 10.1 DataTable

Config-driven; priority columns; mobile **card transform**; bottom-sheet row actions; sticky bulk bar. Built on shadcn `Table` / `Checkbox` / `DropdownMenu` / `Sheet`.

### 10.2 Shell

| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| Sidebar | Fixed labels; Catalog group | Icon rail | Drawer |
| Navbar | Breadcrumb + search + user | Condensed | Hamburger + title |
| Forms | Multi-col | Two-col | Single + sticky ContextualSaveBar |
| Category tree | Full tree | Full tree scroll | Accordion tree |
| DataTable | Table | Column drop | Cards |

### 10.3 Safety

1. Contextual Save Bar (Polaris pattern) — Save / Discard / leave guard  
2. Confirm destructive actions  
3. Soft-delete + ~10s Undo → Trash  
4. Action-matched toasts  
5. Optimistic toggles/reorder with rollback  
6. Empty states with CTA  
7. Command palette  
8. Visible draft/published badges  

### 10.4 Trash policy (locked)

| Rule | Detail |
|---|---|
| Soft delete always | Client “Delete” never hard-removes immediately |
| Retention default | **30 days** (`config/trash.config.ts` → `retentionDays: 30`) |
| Auto purge | Cron/scheduled function daily: hard-delete where `deletedAt < now - 30d` |
| Admin override | Trash UI: **Restore** or **Delete permanently** anytime (superadmin purge; editor restore) |
| Audit | Purge + restore logged |

---

## 11. Rendering & Performance

- RSC default; client only for interactive islands  
- ISR + `revalidatePath`/`revalidateTag` on publish  
- Streaming below fold  
- `next/image` + R2; on Cloudflare prod use documented OpenNext/Cloudflare Images path  
- Cursor pagination; list DTOs omit heavy `blocks`  
- Category subtree via `ancestorIds` index — no recursive client walks for catalog filters  

---

## 12. SEO & Multi-Language — English Now, Single-Craft Later

### 12.1 Locked approach

**Ship English (`en`) only.** Architecture must allow new languages **without rewriting app code**.

### 12.2 Single-craft add-language checklist

To add e.g. Hindi:

1. Add `"hi"` to `i18n/routing.ts` → `locales` array  
2. Copy `messages/en/*.json` → `messages/hi/*.json` and translate  
3. Ensure CMS/Product `Map` fields get `hi` values in admin (locale tabs driven by **same** `locales` config)  
4. Sitemap / hreflang read `routing.locales` — no hardcoded list elsewhere  

**One source of truth:** `i18n/routing.ts` (or `config/i18n.config.ts` re-export). Ban scattered `['en']` literals — ESLint `no-restricted-syntax` or shared import only.

### 12.3 Content model

- UI chrome: next-intl message files  
- CMS/catalog: `Map<locale, string>` already  
- Admin locale switcher lists `routing.locales`  
- Partial translation: fallback to `defaultLocale` (`en`) — never crash  

### 12.4 SEO

`generateMetadata`, dynamic sitemap (published + not deleted), robots exclude `/admin`, JSON-LD Organization/Product, canonical + hreflang from locale registry.

---

## 13. Enquiry / RFQ → Leads (Email Only — Locked)

1. RHF + Zod (client + server)  
2. Honeypot + reCAPTCHA v3  
3. Upstash rate limit  
4. Persist `Lead` in MongoDB  
5. **Resend email** to configured inbox(es) from `site.config.ts` / settings  
6. Admin **Leads** page = DataTable (status: new/read/archived)  
7. **No CRM webhook** in v1 — adapter interface may exist as no-op for future, but **not wired**  

```ts
// Future-proof seam (unused now)
export interface LeadNotifier {
  notify(lead: Lead): Promise<void>;
}
// ResendLeadNotifier — active
// CrmWebhookLeadNotifier — not implemented
```

---

## 14. Auth, Roles & Security

Auth.js + roles `superadmin | editor | viewer`. RBAC before CRUD. Audit log on mutations. CSRF + security headers. Secrets in env.

| Role | Catalog | Corporate (A–H) | Pages | Leads | Users | Trash purge |
|---|---|---|---|---|---|---|
| superadmin | full | full | full | full | full | yes |
| editor | full | full | full | read/update | no | restore only |
| viewer | read | read | read | read | no | no |

---

## 15. Testing & CI/CD

- Vitest: category tree create/move/subtree query, soft-delete uniqueness, trash purge  
- RTL + Storybook a11y on composed components  
- Playwright: product CRUD; N-level category add-child; guarded delete; mobile shell; dirty form  
- CI: lint (boundaries) + typecheck + unit + Playwright smoke  
- Deploy: PR → Vercel preview; `main` → Cloudflare Workers (OpenNext)  

---

## 16. Hosting & Environments — Free Prod Except Domain

| | Staging / Preview | Production |
|---|---|---|
| Host | Vercel Hobby | **Cloudflare Workers (OpenNext)** |
| Commercial | Not allowed (Hobby) | **Allowed (CF free)** |
| Domain | `*.vercel.app` free | **Purchased domain only** → CF |
| Database | Atlas M0 | Atlas M0 (upgrade only if needed) |
| Media | R2 free | R2 free |
| Email | Resend free | Resend free |
| Deploy | PR previews | Merge to `main` |

```ts
// lib/db/connect.ts — serverless-safe cached connection
import mongoose from "mongoose";
let cached = (global as any).mongoose ?? { conn: null, promise: null };
export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(process.env.MONGODB_URI!).then((m) => m);
  cached.conn = await cached.promise;
  (global as any).mongoose = cached;
  return cached.conn;
}
```

**Honesty note:** If Worker bundle exceeds Cloudflare free size limit, budget ~$5/mo Workers Paid — treat as capacity upgrade, not architecture change. Monitor in CI (bundle size report).

---

## 17. cmr.co.in + Client Brief A–I — Structural Mapping

cmr.co.in remains **layout/IA reference only** (not visuals). Client brief A–I is the **authoritative content checklist** for HG-specific data.

| Client section | Public site area | CMS / module home | cmr.co.in pattern (if any) |
|---|---|---|---|
| **A** Legal & corporate | Footer, Contact, About | `CompanyProfile` singleton | Legal footer density |
| **B** Leadership & public co. | About, Leadership, **Investors** (if enabled) | `Person`, investor Page + doc Media | Director bios + experience |
| **C** Current production | Capacity / Technology page | `CapacityMetric` + `stats` block | Data-dense capacity presentation |
| **D** Future expansion | Expansion / Growth page | `ExpansionProject` + disclosure flags | Only if client approves public numbers |
| **E** Product technical | Catalog + product detail | `catalog` Product + drawings Media | Structured spec tables |
| **F** Quality & certifications | Quality page | `Certification` + sample Media | Cert grid + downloadable PDFs |
| **G** Customer proof | Customers / Projects | CaseStudy, Testimonial, CustomerLogo | Logo strip + testimonials |
| **H** Sustainability / ESG | Sustainability page | `SustainabilityMetric` + tiers | Metric-driven — **verified only** |
| **I** Photos & videos | Galleries across site | `Media` + tags from `media-tags.config.ts` | Plant photo galleries |

---

## 18. Landing Page — UI Source of Truth for Entire Site (Locked)

Your HTML/CSS/JS landing is **not a throwaway mock**. It is the **visual contract** for every public page and the token source for admin (admin may be denser, same tokens).

### Pass 0 — Your design (you)

1. Design landing in **`/prototypes/landing`** with HTML / CSS / JS  
2. Use **real HG narrative structure** (capacity, extrusion, quality, export) — placeholders OK until CMS filled  
3. Mark regions that will become blocks (`data-block="hero"`, `data-block="stats"`, etc.)  
4. When brand assets arrive (§A), drop into prototype then extract to tokens  

### Pass 1 — Token extraction (engineering)

From landing CSS, extract **once** into `styles/tokens.css`:

- Color (map to shadcn `--primary`, `--background`, `--foreground`, …)
- Type scale (display / h1–h6 / body / caption)
- Space scale (4/8/12/16/24/32/48/64)
- Radius, shadow, max content width, section padding
- Motion durations

**Sync rule:** Public Header, Footer, buttons, cards, section padding **must match landing**. New pages compose the same organisms. No “admin look” leaking onto public; no second public theme.

### Pass 2 — Migrate to TSX

1. Init shadcn + required `components/ui`  
2. Rebuild landing as `features/public-home` organisms — **no one-off page CSS**  
3. Storybook stories = visual baseline  
4. Lighthouse ≥90 / LCP < 2.5s / CLS < 0.1  
5. Playwright screenshots at 375 / 768 / 1024 / 1440 vs prototype (manual or pixel-diff later)  
6. Deploy staging (Vercel Hobby)  

### Pass 3 — Site-wide inheritance

| Later page | How it stays in sync |
|---|---|
| About / Leadership / Quality / Sustainability | Same `PageShell`, `Section`, type, Header/Footer |
| Product listing / detail | Same cards, grids, tokens |
| Contact | Same form fields as landing CTA if present |
| Admin | Same tokens; denser type/space via `--admin-*` aliases, not new palette |

### Pass 4 — CMS

Landing sections register as blocks. Client can reorder/replace content **without** changing visual system.

**Do not** invent a parallel Button/Input system — wrap shadcn/Radix.

---

## 19. Decisions Lock + Remaining Open Items

### Locked this version

| Item | Decision |
|---|---|
| UI primitives | Radix + shadcn; no custom atomic from scratch |
| Landing workflow | HTML/CSS/JS prototype → TSX migration |
| Category depth | **N-level** via Array of Ancestors + parentId + level |
| Trash | **30 days auto** + **admin purge/restore anytime** |
| Production cost | **Free tiers except domain**; CF Workers prod + Vercel staging |
| Leads / CRM | **Email only** via Resend; leads live in CMS; no CRM webhook now |
| Languages | **English now**; add language = routing locales + messages folder + Map fields |

### Still open (client) — from brief A–I

**§A — Legal & corporate**

- [ ] CIN, registered office, factory address, GST  
- [ ] Emails: sales, export, purchase, investor, HR, quality  
- [ ] Contact numbers  
- [ ] Logo PNG / SVG / PDF  
- [ ] Brand colors  
- [ ] **Final legal name spelling everywhere**  
- [ ] **Naming on site:** HG Aluminium Smelters Limited only — or also HG Extrusion LLP / MetalTech Industries history? (client decision)

**§B — Leadership & public company**

- [ ] Director photos, bios, designations, years of experience  
- [ ] Chairman / MD message  
- [ ] Company secretary (if applicable)  
- [ ] Auditor name (if public disclosure required)  
- [ ] Corporate governance policies (PDFs)  
- [ ] Annual report / audited financials (if investor section desired)  
- [ ] Confirm whether **stock-exchange listed** (BSE/NSE) or **Public Ltd structure only** — drives investor page scope

**§C — Current production (verify before publish)**

- [ ] Confirm all capacity figures (handwritten draft ≠ approved)  
- [ ] **Furnace capacity:** report said “6,500 MT” × 3 — client note says **7 MT per batch × 3 Nos.** — **must reconcile before website**  
- [ ] Crossed-out values (e.g. 900 MT monthly, 6500 mm length → **6000 mm**) — use final approved only  
- [ ] Export capacity wording: conditional on export order — exact approved phrasing  
- [ ] Utilization %, lead time, MOQ — client sign-off  

**§D — Future expansion**

- [ ] Confirm each line: **confirmed vs proposed** (9" press = **planned**; formwork = **no**; secondary ingot = **yes**)  
- [ ] Timelines: start within 24 months; commissioning 12–18 months; location ~2 km  
- [ ] **May ₹327 crore project cost be public?** (yes/no)  
- [ ] **May ₹1551.40 crore estimated revenue be public?** (yes/no)  

**§E — Products**

- [ ] Complete catalogue, photos, profile drawings, standard sections list  
- [ ] Full alloy list (incl. 1050), tempers, finishes, RAL colors, tolerances, packaging, custom profile / die / sample process  

**§F — Quality**

- [ ] ISO PDFs + validity dates, quality policy, sample cert formats  
- [ ] Standards list (IS, ASTM, EN, DIN, JIS), batch traceability yes/no  
- [ ] Rejection rate — only if client comfortable sharing  

**§G — Proof**

- [ ] Customer list approved for web, logos with permission, testimonials, case studies  
- [ ] Industries / regions served, export regions, repeat order %, major projects  

**§H — Sustainability**

- [ ] **Verified numbers only** for public metrics; biomass / CO₂ / fuel reduction  
- [ ] Label unverified items as initiative/commitment in CMS — never as fact  
- [ ] ETP, permissions, solar, carbon credit — evidence + disclosure tier  

**§I — Media**

- [ ] Full asset list: drone, exterior, furnace, billet, extrusion video, toolroom, dies, QC lab, dispatch, **METAL TOUCH** finishing, director portraits, team PPE photos  

**Previously open (still)**

- [ ] Final category seed names  
- [ ] Go-live date (domain timing)  
- [ ] Admin roles at handover  
- [ ] Lead notification email(s)  

---

## 20. Suggested Build Order

Each phase **cannot start** until previous phase **Proof of Done** is filed (§26).

**Phase 0:** Tooling (boundaries, shadcn, Knip, size-limit, CSR folders) + Atlas/R2/Upstash/Resend/Sentry + dual deploy stubs + **jobs route stub** (§32).

**Phase 1:** Landing HTML → tokens → TSX → Storybook → Vercel staging. **Locks UI.**

**Phase 2:** CMS Pages + blocks + CSR + **Redirect + Preview** middleware hooks (§36–§37).

**Phase 3:** Catalog N-level + Products + **Dictionary CMS** + optimistic `version` (§33, §42).

**Phase 4:** Public catalog + corporate pages from CMS.

**Phase 5:** Quality, sustainability, media, leadership, capacity — full self-serve + **CSV import** for products/metrics (§38).

**Phase 6:** Expansion + remaining blocks + **scheduled publish** cron (§35).

**Phase 7:** Enquiry + **FormDefinition** fields + Leads + Resend + optional webhooks (§39, §41).

**Phase 8:** Locales (single-craft).

**Phase 9:** PWA + SEO + JSON-LD + **consent** (§46) + cache headers proof (§43) + observability (§44).

**Phase 10:** Playwright soak + Knip + size-limit + domain + CF prod + **Cron Triggers** live + backup drill.

---

## 21. Traceability — Requirement → Architecture

| Requirement | Section |
|---|---|
| No custom atoms — Radix/shadcn | §2, §4.2, §7, §18 |
| HTML→TSX landing | §18 |
| N-level categories + perf | §9.2–§9.6 |
| Trash 30d + admin purge | §10.4 |
| Free prod except domain | §3, §16 |
| Email-only leads in CMS | §13 |
| EN now / easy add language | §12 |
| Effortless catalog CRUD | §9, §10 |
| Modular monolith | §5–§6 |
| Responsive admin | §10 |
| Client content brief A–I | §23 |
| Public Ltd / investor readiness | §23.2, §23.11 |
| Verified metrics only | §23.12 |
| Landing = UI source of truth | §18 |
| CMS self-serve (no dev for content) | §24 |
| Controller–Service–Repository | §25 |
| Feature-based frontend | §25.3 |
| State / server-state | §27 |
| Phase DoD + Proof of Done | §26 |
| Dead code / hygiene | §26.3 |
| Responsive every layout | §7.4 |
| Pagination + on-change validation | §28 |
| PWA | §29 |
| DSA / data design | §30 |
| Gap closures (jobs, redirects, preview, …) | §32–§47 |
| Dynamic / less hardcoding | §22 |

---

## 22. Dynamic Scaling — Closed Decisions (was gap register)

Previous “plan later” items are **decided** below. Client content still open (§19) — that is data intake, not architecture debt.

### 22.1 Config / registry — single sources (no scatter)

| Factor | Mechanism | Runtime CMS? |
|---|---|---|
| Locales | `i18n/routing.ts` only | No — add locale = tiny config PR (§12) |
| Admin + public nav | `NavigationItem` in CMS + `admin-nav.config.ts` for admin chrome only | **Public nav = CMS** |
| Block types | `blockRegistry` in code | No — new renderer needs PR; **compose existing blocks** for new sections |
| Category seed | Seed once from JSON; thereafter **CMS only** | Yes |
| Soft max category depth | `categories.config.ts` | No |
| Trash retention | `trash.config.ts` default 30; **overridable in Settings** | Yes (Settings) |
| Feature flags | `site.config.ts` + optional `Setting` overrides | Hybrid |
| Lead notify emails | `CompanyProfile.emails` | Yes |
| **Spec dictionaries** (alloy, temper, finish, RAL, standards) | **`Dictionary` CMS entity** — seed from `specs.dictionary.seed.ts` once | **Yes — Settings → Dictionaries** (§33) |
| Media tags | `MediaTag` CMS + seed | Yes |
| Disclosure rules | `disclosure.config.ts` defaults; per-row flags on entities | Hybrid |
| Permissions | `identity/permissions.ts` | No (code) |
| Revalidate tags | `lib/constants/revalidate-tags.ts` | No |

### 22.2 Former gaps → locked architecture

| Former gap | Decision | Section |
|---|---|---|
| Spec dictionary code vs Settings | **CMS Dictionary is source of truth** after seed | §33 |
| New entity without copy-paste hell | **Entity scaffold** (generator) + shared CRUD shell | §34 |
| New block type needs code | Accepted; **block kit** covers 95% sections; scaffold for rare new types | §24.2, §34 |
| Scheduled publish / versioning | `scheduledPublishAt` + cron; `publishedVersion` snapshot | §35 |
| Redirects on slug change | `Redirect` CMS entity + middleware | §36 |
| Draft preview links | Signed token URLs, TTL 7 days | §37 |
| CSV import | Admin import wizard + Zod row validate | §38 |
| Enquiry form fields | `FormDefinition` CMS (field list) — not a full Formik builder | §39 |
| Search | Text index v1 → **Atlas Search** upgrade path when measured | §40 |
| Outbound webhooks | `WebhookEndpoint` + LeadNotifier already; wireable in Settings | §41 |
| Jobs / trash cron on serverless | **Cloudflare Cron Triggers** hit `/api/v1/jobs/*` | §32 |
| Concurrent editors | Optimistic concurrency `version` field + 409 | §42 |
| Public read scale / CDN | Cache-Tag + revalidateTag matrix; Upstash lock on stampede | §43 |
| Observability / DR | Structured logs, Audit admin UI, backup runbook | §44 |
| Bundle size CI | `size-limit` / OpenNext bundle report fails PR over budget | §45 |
| Consent / cookies | Consent banner when GA4 enabled | §46 |
| Media pipeline | Upload → R2; variants via CF Images / next/image; optional hash dedupe | §47 |

### 22.3 Residual risks (not architecture gaps — ops/client)

| Item | Status |
|---|---|
| Client legal / brand / listing / ₹ disclosure | Open intake §19 — fields exist |
| OpenNext vs Vercel runtime quirks | Mitigated: OpenNext preview in CI (Phase 0/9) |
| Free-tier usage cliffs | Documented §3 — monitor, not redesign |
| Brand tokens until landing delivered | Phase 1 gate |

### 22.4 Engineering quality bar (ongoing)

- No business logic in React components — services/modules  
- No Mongoose in components  
- No locale/nav/block/dictionary lists outside CMS or single config  
- Every new admin entity = scaffold + DataTable config + Zod + service + mongo adapter  
- Prefer deleting code over adding flags that never die  

---

## 23. Client Content Brief — Sections A–I (Architecture Mapping)

This section maps the **client-supplied checklist** (legal, production, products, ESG, media) into the CMS. It does **not** treat handwritten notes as approved website copy.

### 23.0 How to read the intake document

| Label | Meaning for engineering |
|---|---|
| **“I need:”** | Required client deliverable — field exists in CMS; public page empty until supplied |
| **Handwritten note** | **Draft intake only** — store as `draft` / `needs_verification`; never auto-publish |
| **Crossed-out value** | Superseded — do not use; wait for client confirmation of replacement |
| **“Confirm before website”** | Hard publish gate (e.g. furnace capacity units) |
| **Margin scribbles** | Ignore unless client explicitly promotes to brief |

### 23.1 Section A — Legal & corporate → `CompanyProfile` singleton

**Module:** `corporate` · **Admin:** Settings → Company Profile (tabbed form) · **Public:** footer, contact page, JSON-LD `Organization`

```ts
// modules/corporate/models/CompanyProfile.ts (shape)
{
  legalName: string;                    // final approved spelling — single source
  displayNames: {                       // client decision §A
    primary: string;                    // e.g. "HG Aluminium Smelters Limited"
    alsoMention: string[];              // e.g. HG Extrusion LLP, MetalTech — ONLY if client approves
  };
  cin: string;
  gst: string;
  registeredOffice: Address;
  factoryAddress: Address;
  phones: { label: string; number: string }[];
  emails: {
    sales: string;
    export: string;
    purchase: string;
    investor: string;
    hr: string;
    quality: string;
  };
  logo: { png?: ObjectId; svg?: ObjectId; pdf?: ObjectId }; // Media refs
  brandColors: { primary?: string; secondary?: string; accent?: string }; // → tokens.css sync
  locale: string;                       // default "en"
}
```

**Enquiry routing (Phase 7):** RFQ form `department` select maps to `emails.*` from this singleton — no hardcoded mailto addresses in components.

**Open (client):** all §A fields + naming strategy for related entities.

### 23.2 Section B — Leadership & public company → `Person` + investor pages

**Entity:** `Person` — directors, chairman, MD, CS (if disclosed)

```ts
{
  name: Map<string, string>;
  slug: string;
  role: "director" | "chairman" | "md" | "company_secretary" | "executive";
  boardDesignation: string;
  yearsExperience: number;
  bio: Map<string, string>;
  photo: ObjectId;                      // §I director portraits
  sortOrder: number;
  status: "draft" | "published";
  showOnInvestorPage: boolean;
}
```

**Blocks:** `leadership-grid`, `chairman-message`

**Investor / governance (Public Ltd):** IR best practice (documented industry pattern): dedicated **`/[locale]/investors`** or prominent subsection — governance PDFs, board list, policies, annual report **when client provides**. This is **not** a full exchange-regulated IR portal unless client confirms listing + legal requirements.

**Admin:** People CRUD (same DataTable + editor shell as catalog).

**Open (client):** all bios/photos; whether auditor name is public; which PDFs may be uploaded; listing status (exchange vs structure-only).

### 23.3 Section C — Current production → `CapacityMetric`

Each production fact is a **row**, not prose in a Page — enables verification workflow and stats block reuse.

```ts
{
  key: string;                          // e.g. "annual_extrusion_capacity"
  label: Map<string, string>;           // "Annual extrusion capacity"
  value: number | string;               // 11000 | "11 000"
  unit: string;                         // "MT", "MT/month", "mm", "kg/m", "days", "%"
  category: "extrusion" | "billet" | "ingot" | "melting" | "press" | "dimension" | "commercial";
  sourceNote: string;                   // e.g. "Client brief handwritten 2026-03"
  verificationStatus: "draft" | "needs_verification" | "verified";
  verifiedBy: ObjectId;
  verifiedAt: Date;
  publishStatus: "hidden" | "published"; // only published if verified
  displayOrder: number;
}
```

**Intake draft values (NOT approved for website — pending client verification):**

| Topic | Draft in brief | Architecture action |
|---|---|---|
| Annual extrusion | 11,000 MT | Row `draft` until signed off |
| Billet / month | 1,400 MT | same |
| Ingot / month | 275 MT | same |
| Melting / month | 1,900 MT | same |
| Presses | 3 Nos.; sizes 1800 MT, 1000 MT × 2 | separate rows or structured JSON |
| Max profile width | 386 mm | same |
| Max profile length | ~~6500~~ → **6000 mm** | use **6000 only after confirm** |
| Weight/m | 10 kg | same |
| Billet size | Φ228 × L6000 mm | same |
| MOQ | 500 kg (note mentions 1000 MT — **ambiguous, client must clarify**) | `needs_verification` |
| Lead time | 7 days | same |
| Utilization | 70% | same |
| Export capacity | conditional on export order | store as **text policy**, not fake number |
| Furnace | Report "6,500 MT" × 3 vs note **7 MT/batch × 3** | **`needs_verification` — do not publish either until reconciled** |

**Block `stats`:** queries only `publishStatus=published` AND `verificationStatus=verified`. Admin preview may show draft with watermark in staging.

### 23.4 Section D — Future expansion → `ExpansionProject`

```ts
{
  title: Map<string, string>;
  slug: string;
  status: "confirmed" | "proposed" | "planned";  // intake: 9" press=planned; formwork=no; secondary ingot=yes
  description: Map<string, string>;
  locationNote: string;                   // "~2 km from existing unit"
  expectedStart: string;                // "within 24 months" — client may refine to date
  expectedCommissioning: string;          // "12–18 months"
  projectCostInr: number;                 // 327 crore — ONLY if publicDisclosureApproved
  estimatedRevenueInr: number;            // 1551.40 crore — ONLY if approved
  publicDisclosureApproved: boolean;      // explicit client yes/no per line item
  publishStatus: "draft" | "published";
}
```

**UI rule:** If `publicDisclosureApproved=false`, public site shows **no INR figures** — may show qualitative “expansion underway” only if client approves copy.

**Intake flags (draft, not architecture facts):** formwork **not** confirmed; secondary ingot **yes**; 9" press **planned** not ordered.

### 23.5 Section E — Products → `catalog` module (§9.4)

Already architected. Client must supply catalogue assets. Alloy **1050** — add via **Settings → Dictionaries** when confirmed (no code change).

**Profile drawings:** `Media.kind = "profile_drawing"` linked on Product.

**Processes (custom profile, die time, sample approval):** localized rich text or step list on Product — editable in admin Specs/Content tabs.

### 23.6 Section F — Quality → `Certification` + Media

```ts
// Certification
{
  name: string;
  type: "iso" | "quality_policy" | "test_certificate_template" | "other";
  issuer: string;
  validFrom: Date;
  validTo: Date;
  document: ObjectId;                   // PDF in R2
  publishStatus: "draft" | "published";
}
```

Sample spectro / hardness reports: uploaded as Media, linked from Quality page block — not fabricated samples.

**Standards (IS, ASTM, EN, DIN, JIS):** Dictionary CMS entries + Product multi-select.

**Batch traceability:** boolean on `CompanyProfile` or Quality settings — **client must confirm** before displaying “yes”.

**Rejection rate:** optional numeric field — **only if client comfortable**; otherwise omit from public site entirely.

### 23.7 Section G — Customer proof → `CaseStudy`, `Testimonial`, `CustomerLogo`

All require **`approvedForWebsite: boolean`** (default `false`). Admin cannot publish logo/testimonial without checking approval.

```ts
// CustomerLogo
{ name: string; logo: ObjectId; approvedForWebsite: boolean; permissionNote: string; }
```

Case studies: title, industry, region, summary, images, optional Product links.

**Open:** full approved customer list, export regions, repeat order %, major projects.

### 23.8 Section H — Sustainability → `SustainabilityMetric` + disclosure tiers

ESG reporting practice (documented industry guidance): **verified metrics** vs **commitments** must be visually and structurally distinct to avoid greenwashing.

```ts
{
  key: string;
  label: Map<string, string>;
  value: number | string | null;
  unit: string;
  disclosureTier: "verified_metric" | "initiative" | "commitment";
  evidenceMedia: ObjectId[];              // optional PDF / audit
  methodologyNote: string;
  verificationStatus: "draft" | "verified";
  publishStatus: "hidden" | "published";
}
```

**Public rendering rules:**

| Tier | Allowed public copy pattern |
|---|---|
| `verified_metric` | Show number + unit + period + source/methodology footnote |
| `initiative` | “We are implementing…” — **no implied quantified outcome** unless verified |
| `commitment` | Target language with date — SMART only if client supplies baseline |

**Intake note:** biomass positioning exists but **numbers still needed** from client. Do not invent CO₂, biomass tonnage, or fuel-reduction percentages.

Topics from brief: biomass usage/capacity/consumption, fossil reduction, waste/scrap, furnace emissions, water/ETP, solar, permissions, carbon credits — each becomes a row or grouped block **when data supplied**.

### 23.9 Section I — Photos & videos → `Media` taxonomy

Extend `Media` model:

```ts
{
  kind: "image" | "video" | "pdf" | "profile_drawing";
  tags: string[];                       // from media-tags.config.ts
  alt: Map<string, string>;
  caption: Map<string, string>;
  videoUrl: string;                     // YouTube/Vimeo for embeds
  location: "hg_factory" | "metal_touch" | "office" | "other";
}
```

**Suggested tags (config, editable):** `drone`, `exterior`, `furnace`, `billet`, `extrusion`, `toolroom`, `die`, `profile-correction`, `quality-lab`, `finished-product`, `dispatch`, `anodizing`, `powder-coating`, `metal-touch`, `director-portrait`, `team-ppe`

**METAL TOUCH:** finishing photos tagged `metal-touch` — may appear on Quality or dedicated subsection; subsidiary naming follows §A client decision on MetalTech / METAL TOUCH spelling.

Gallery blocks filter by tag — no duplicate upload paths.

### 23.10 Admin IA (corporate content)

Add **Corporate** group in admin nav (same CRUD shell as Catalog):

| Admin route | Entity |
|---|---|
| `/admin/settings/company` | CompanyProfile |
| `/admin/corporate/people` | Person |
| `/admin/corporate/capacity-metrics` | CapacityMetric |
| `/admin/corporate/expansion` | ExpansionProject |
| `/admin/corporate/certifications` | Certification |
| `/admin/corporate/case-studies` | CaseStudy |
| `/admin/corporate/testimonials` | Testimonial |
| `/admin/corporate/customer-logos` | CustomerLogo |
| `/admin/corporate/sustainability` | SustainabilityMetric |

Each: DataTable + editor + draft/publish + verification where applicable.

### 23.11 Public Limited Company — site structure

Minimum recommended public routes (English first):

```
/[locale]/about
/[locale]/leadership
/[locale]/capacity              # §C verified metrics
/[locale]/expansion               # §D disclosure-gated
/[locale]/products/...
/[locale]/quality                 # §F
/[locale]/sustainability          # §H tier-labelled
/[locale]/customers               # §G
/[locale]/investors               # §B — enable when client has PDFs/policies
/[locale]/contact
```

Navigation driven by `admin-nav.config.ts` / public nav config — not hardcoded in Header component.

JSON-LD: `Organization` (from CompanyProfile), `Product` (catalog), optional `Corporation` / `LocalBusiness` for factory address once verified.

### 23.12 Publish gates (mandatory)

| Content type | Public SSR/ISR requires |
|---|---|
| CapacityMetric | `verificationStatus=verified` AND `publishStatus=published` |
| ExpansionProject INR fields | `publicDisclosureApproved=true` |
| SustainabilityMetric (numeric) | `disclosureTier=verified_metric` AND verified |
| CustomerLogo / Testimonial | `approvedForWebsite=true` |
| Certification | valid `validTo` (warn in admin if expired) + published |
| CompanyProfile legal fields | non-empty CIN/GST/addresses before go-live checklist |
| Product specs vs capacity | admin warning if product max width > verified plant max width |

**Staging preview:** editors may preview draft with “DRAFT” banner — never on production domain.

**Client note (v1.6):** Legal will be provided. Leadership and current production **will change over time in CMS** — architecture treats them as editable entities, not hardcoded. Publish still requires `publishStatus=published` so the client controls what the public sees; developer is not in the loop.

### 23.13 Content verification workflow (operational)

1. Client submits data (brief, spreadsheets, PDFs).  
2. Editor enters into admin as `draft` / `needs_verification`.  
3. Client sign-off → editor sets `verified` + `published`.  
4. Log sign-off in `/docs/content-verification/` (date, field, approver name).  
5. CI optional: fail build if production seed contains `verificationStatus=draft` (feature flag).

---

## 24. CMS Self-Serve — Developer Not in the Content Loop

**Goal:** After launch, client changes products, quality, sustainability, media, leadership, capacity, expansion, legal, pages, dictionaries, nav, redirects, form fields **in admin**. No ticket to developer for routine content.

### 24.1 What CMS covers without code

| Area | Admin can |
|---|---|
| Pages + blocks | Create/edit/publish/schedule; reorder blocks; appearance |
| Products + N-level categories | Full CRUD, duplicate, bulk, CSV import, SEO, drawings |
| **Dictionaries** | Add alloy / temper / finish / RAL / standard / media tag — **no PR** |
| Quality / Sustainability / Media / Leadership / Capacity / Expansion | Full CRUD |
| Legal / company | CompanyProfile |
| Navigation | Public nav CMS |
| Redirects | Old slug → new (§36) |
| Contact form fields | FormDefinition (§39) |
| Webhooks | Optional URL + secret (§41) |
| Preview | Share draft link (§37) |
| Trash | Restore / purge |

### 24.2 What still needs a developer (honest, minimized)

| Change | Why | Mitigation |
|---|---|---|
| **New block type** (e.g. 3D viewer) | New Zod + renderer + Storybook | Compose hero/stats/gallery/text/html first; §34 scaffold speeds rare types |
| **New domain entity** (e.g. Careers) | New port + service + mongo adapter | §34 entity scaffold generates boilerplate; same DataTable shell |
| New locale | routing + messages | Single-craft checklist — small PR |
| Visual redesign beyond tokens | Design system | Token swap only for brand refresh |

**Client “new section” default path:** insert **existing** registered block + content. Zero code.

### 24.3 Future expansion after launch

§D + all corporate metrics editable. Schedule publish via cron. No redeploy for copy/metrics/images. `revalidateTag` + Cache-Tag (§43).

---

## 25. Modular Monolith + Feature Frontend + CSR

Two axes, one app:

```
app/            thin routes (Next)
features/       UI by feature (bulletproof-react)
modules/        domain backend: Controller is in app/api; Service + Repository in module
components/     shared UI only
```

**Unidirectional:** `components` + `lib` → `features` → `app`. Features **do not** import other features’ internals. Features **do not** import `repositories/mongo`. `eslint-plugin-boundaries` enforces.

### 25.1 Controller (HTTP adapter)

```ts
// app/api/v1/products/route.ts
export async function GET(req: Request) {
  const q = listQuerySchema.parse(Object.fromEntries(new URL(req.url).searchParams));
  await authorize(req, "catalog.read");
  const data = await productService.list(q);
  return respondSuccess(data);
}
```

### 25.2 Service + Repository port

```ts
// domain types: string ids
export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  listCursor(q: ProductListQuery): Promise<CursorPage<Product>>;
  save(p: Product): Promise<Product>;
  softDelete(id: string, by: string): Promise<void>;
}

// service uses port only
export function createProductService(repo: ProductRepository, audit: AuditPort) {
  return {
    async list(q: ProductListQuery) {
      return repo.listCursor({ ...q, deletedAt: null });
    },
  };
}
```

Mongo adapter maps `ObjectId` ↔ `string` **inside** `product.mongo.ts`.

### 25.3 Feature folders (frontend)

```
features/admin-catalog/
  components/ProductTable.tsx
  hooks/useProducts.ts          # TanStack Query
  api/keys.ts                   # queryKey factory
  index.ts
```

Public pages: Server Components in `app/` call `productService` (server) and pass props to feature presentational components. No Query on public catalog unless filters need client interactivity — then prefetch + `HydrationBoundary` (TanStack Advanced SSR).

---

## 26. Phase Gates — Definition of Done + Proof of Done

**Rule:** Next phase does not start until Proof of Done is in `/docs/phase-gates/phase-N.md` (or PR comment with artifacts).

### 26.1 Global Proof artifacts (every phase that ships UI)

| Artifact | Tool |
|---|---|
| CI green | GitHub Actions: lint, typecheck, unit, Knip, boundaries, **size-limit** |
| A11y | Storybook a11y + axe on critical Playwright paths |
| Responsive | Playwright screenshots 375 / 768 / 1024 / 1440 |
| Tokens | Stylelint — zero raw hex/px outside tokens |
| Dead code | `knip` exit 0 |

### 26.2 Per-phase DoD + Proof

| Phase | Definition of Done | Proof of Done |
|---|---|---|
| **0** | Repo, CI, shadcn, Knip, size-limit, CSR, jobs stub | Green CI; knip; size-limit baseline; tree matches §6 |
| **1** | Landing TSX = prototype; tokens; Storybook; Lighthouse ≥90 | Side-by-side; Lighthouse JSON; 4 viewports |
| **2** | Page CRUD + blocks + redirects + preview token | Playwright publish + 301 + preview URL |
| **3** | Catalog + Dictionary CMS + version/409 | Playwright CRUD; dictionary add alloy no code; conflict test |
| **4** | Public pages from CMS | Staging URLs; empty states |
| **5** | Corporate self-serve + CSV import | Checklist without code + CSV dry-run |
| **6** | Expansion + scheduled publish job | Cron dry-run publishes scheduled row |
| **7** | FormDefinition + leads + email + webhook optional | Dynamic field in admin appears on form |
| **8** | Locale craft | messages + routing |
| **9** | PWA + consent + cache tags + audit UI + health | Lighthouse PWA; consent; `/admin/audit` |
| **10** | Soak + domain + CF cron live + backup drill | Full suite; cron log; restore note |

**Fail the gate:** missing artifact = phase not done. No “we’ll fix in next phase” for CI, tokens, or Knip.

### 26.3 Code hygiene — keep clean, delete dead code

| Practice | Enforcement |
|---|---|
| Unused imports | `eslint-plugin-unused-imports` autofix on save + lint-staged |
| Unused files/exports/deps | **Knip in CI** (TanStack monorepos use this; documented) |
| Unused CSS | Stylelint; no orphan class files |
| Feature public API | Import only `features/x` index — internals unused stay private; Knip still flags unused exports from index |
| No commented-out blocks | ESLint `no-warning-comments` optional; review |
| Barrel files | Prefer explicit exports; avoid `export *` (hides dead code from Knip unless configured) |
| After refactor | Run `knip` locally before PR |

**Definition of clean:** `knip` + ESLint + tsc + tests all pass. Dead code is a **CI failure**, not a later chore.

---

## 27. State and Server State

Split is **documented TanStack + Next App Router practice**: public RSC first; Query only where client cache/optimism needed.

### 27.1 Three buckets

| Bucket | What | Where | Tool |
|---|---|---|---|
| **Server state** (source of truth in DB) | Products, pages, metrics, session user | Public: fetch in RSC via **service**. Admin: HTTP + **TanStack Query** | Query keys per entity |
| **URL state** | Search, filters, cursor, tab, locale | `searchParams` | Shareable, back-button works |
| **UI / ephemeral** | Sidebar open, dirty form, toast, dnd overlay | `useState` / feature context | **No Redux.** No global store until proven need |

### 27.2 Public site

- Server Component calls `productService` / `pageService` (same services as API).
- ISR / `revalidateTag('products')` on publish.
- Client islands: enquiry form, carousel, command-less. Local state only.
- **Do not** wrap the whole public tree in QueryClient unless a page needs infinite scroll or live filters — then **prefetch in RSC + `HydrationBoundary`** (TanStack Advanced SSR). Set `staleTime` so client does not immediately refetch.

### 27.3 Admin (CRUD-heavy)

```
QueryClientProvider (admin layout only)
  useQuery  → GET /api/v1/...
  useMutation → POST/PATCH/DELETE → invalidate query keys
  optimistic update for publish toggle / reorder
  rollback + toast on error
```

**Query key factory** (one place):

```ts
export const productKeys = {
  all: ["products"] as const,
  list: (q: ProductListQuery) => ["products", "list", q] as const,
  detail: (id: string) => ["products", "detail", id] as const,
};
```

**Server QueryClient:** new instance **per request** (TanStack SSR docs — never singleton on server). Client: one instance per browser tab.

### 27.4 Forms as state

React Hook Form holds field state. Zod resolver. Submit → mutation. Dirty → Contextual Save Bar. Leave guard if dirty.

### 27.5 Auth state

Auth.js session: server `auth()` in RSC/middleware; client `useSession` only in admin chrome. Do not duplicate user in Zustand.

---

## 28. Pagination, Validation, Minor UX Contracts

### 28.1 Pagination (DSA: cursor, not offset)

**Why:** Mongo `skip` is O(n) as catalog grows. Cursor on `{ sortField, _id }` is O(log n) with compound index.

| Surface | Pattern |
|---|---|
| Admin DataTable | Cursor: `?cursor=&limit=20` in **URL** |
| Public product list | Same cursor or ISR pages; URL `?cursor=` |
| Infinite scroll (optional later) | TanStack `useInfiniteQuery` + same cursor API |

Response: `{ items, nextCursor }`. No `page=3` as primary API.

**Index:** `{ deletedAt: 1, createdAt: -1, _id: -1 }` (or sort key used).

### 28.2 Validation

**Same Zod schema** in controller (parse body) and RHF (`zodResolver`).

| When | Setting | Why |
|---|---|---|
| First show errors | `mode: "onTouched"` (blur) | RHF docs: `onChange` every keystroke is noisy + cost |
| After error exists | `reValidateMode: "onChange"` | Error clears as user fixes |
| Short format fields (SKU, slug, email) | `mode: "onChange"` allowed | User asked on-change; scoped to these fields via per-form config |
| Submit | Always full schema | |
| Server | Always re-parse | Never trust client |

**On-change extras:** slug uniqueness debounced `GET /api/v1/products?sku=` → field-level `fields` error in envelope. Disable Save while `isValidating`.

**A11y:** `aria-invalid`, `aria-describedby` on errors. Focus first error on submit fail.

### 28.3 Other minors (locked)

- Loading / empty / error on every list
- Debounce search 300ms
- Confirm destructive; soft-delete + undo
- Optimistic toggle with rollback
- Max upload size validated client + server
- CSRF on mutations
- Rate limit writes

---

## 29. PWA

**Library:** **Serwist** (`@serwist/next`) — documented successor to unmaintained `next-pwa`. Official getting-started: `swSrc`, `swDest`, `manifest`, offline fallback `/~offline`.

### 29.1 Scope

| Zone | Behavior |
|---|---|
| Public | Installable; `display: standalone`; theme_color from tokens; icons 192/512 |
| Offline | Precache shell + fallback document `/~offline` (“You’re offline — retry”) |
| Runtime cache | Cache-first for static assets; **NetworkFirst** for HTML pages (avoid stale CMS) |
| Admin `/admin/*` | **Do not precache.** Network only. Never cache POST/PATCH/DELETE |
| API | Network only |

### 29.2 Files

- `app/manifest.ts` — name from CompanyProfile / site.config
- `app/sw.ts` — Serwist worker
- `app/~offline/page.tsx`
- Metadata `appleWebApp` in root layout (Serwist docs)

### 29.3 Honesty

PWA ≠ native app. No push notifications in v1 (needs VAPID + extra UX). Goal: add-to-home-screen + offline fallback + faster repeat visits. **Proof:** Lighthouse PWA checks + install prompt on staging HTTPS.

**Cloudflare:** SW must be served with correct MIME; verify on OpenNext preview (phase 9 proof).

---

## 30. Data Structures & Algorithms (practical, not theater)

Use the **right** structure for the query. No unused “clever” code.

| Problem | Structure / algorithm | Complexity (typical) |
|---|---|---|
| Category subtree | Array of Ancestors + index on `ancestorIds` | Find descendants: index scan, not DFS in app |
| Category breadcrumbs | `ancestorIds` + self | O(depth) map lookup |
| Sibling reorder | `order` float or integer gap; same `parentId` | O(k) siblings |
| Cycle on move | Reject if new parent’s `ancestorIds` contains node | O(depth) |
| Catalog filter by category tree | `$in` descendant ids | One query after subtree ids |
| Admin list | Cursor `{createdAt,_id}` | O(log n + limit) |
| Slug / SKU unique | Partial unique index `deletedAt: null` | DB enforces |
| Spec / alloy pickers | `Map` / `Set` from dictionary | O(1) lookup |
| Search | Mongo text index first; Atlas Search when latency/relevance fails (§40) | |
| Dedup media | SHA-256 content hash unique partial index (§47) | O(1) lookup |

**Category tree in memory (admin UI):** build `parentId → children[]` Map once — O(n) — then render. Do **not** N+1 fetch children.

**Soft max depth 8:** warn in UI; still N-level in schema.

---

## 31. Sync Contract — UI / Structure / Pattern (one system)

| Axis | Single source | Enforced by |
|---|---|---|
| Visual | Landing → `tokens.css` | Stylelint |
| Components | Radix/shadcn → atoms → features | File shape §4.2 |
| Features | `features/*/index.ts` | eslint-boundaries |
| Backend | Controller → Service → Port | eslint-boundaries + review |
| API shape | `ApiResponse` / `CursorPage` | Shared helpers |
| Forms | Zod + RHF timing §28 | Shared `useAppForm` wrapper |
| Admin CRUD | DataTable + SaveBar + Confirm | No one-off tables |
| i18n | `routing.locales` | No stray locale arrays |
| Responsive | §7.4 matrix | Playwright 4 viewports |
| Content | CMS entities §24 | No hardcoded products/metrics |

**`useAppForm`:** wraps `useForm` with default `mode: "onTouched"`, `reValidateMode: "onChange"`, `zodResolver`. Pages do not reinvent.

---

## 32. Jobs & Cron (Serverless — Locked)

**Problem:** Trash purge, scheduled publish, preview expiry cannot rely on a long-running Node process.

**Decision:**

| Env | Mechanism |
|---|---|
| Production (Cloudflare) | **Cron Triggers** → `GET/POST /api/v1/jobs/:name` with `Authorization: Bearer JOBS_SECRET` |
| Staging | **GitHub Actions** `schedule:` (daily) calling same job URLs on staging deploy |
| Local | `npm run jobs:run -- trash-purge` CLI |

**Job registry** (`modules/jobs`):

| Job | Schedule | Action |
|---|---|---|
| `trash-purge` | Daily 03:00 UTC | Hard-delete soft-deleted older than retention |
| `scheduled-publish` | Every 5–15 min | Publish entities where `scheduledPublishAt <= now` |
| `preview-expire` | Daily | Invalidate expired preview tokens |
| `webhook-retry` | Every 15 min | Retry failed outbound webhooks (max 5) |

**Idempotent:** each job records `JobRun { name, startedAt, finishedAt, status, stats }` — safe to re-run.

**Auth:** shared secret + optional Cloudflare cron source IP note in ops runbook. Never expose jobs publicly without secret.

---

## 33. Dictionary CMS (Spec Options — Locked)

**Source of truth after seed:** Mongo `Dictionary` / `DictionaryItem` — **not** a committed TS enum file for runtime.

```ts
{
  key: "alloy_grade" | "temper" | "surface_finish" | "anodizing_color" | "ral_color" | "tolerance_standard" | "media_tag" | "packaging";
  items: [{ value: string; label: Map<string,string>; sortOrder: number; active: boolean }];
}
```

- Seed: `specs.dictionary.seed.ts` + `media-tags.seed.ts` on first deploy / `npm run seed:dictionaries`.
- Admin: **Settings → Dictionaries** — add/deactivate items (never hard-delete if referenced; deactivate).
- Product forms load options via `dictionaryService.list(key)`.
- Cache: React `cache()` / TanStack Query `dictionaryKeys`; invalidate on Settings save.

---

## 34. Entity & Block Scaffold (Locked)

**CLI:** `npm run scaffold:entity -- --name CaseStudy --module corporate` generates:

- domain type, Zod, repository port, mongo adapter stub, service, API route stubs, DataTable config, admin feature hooks, Playwright smoke stub  
- Registers entity in `admin-nav.config.ts` via checklist comment (or auto-patch)

**CLI:** `npm run scaffold:block -- --name timeline` generates Zod + empty renderer + Storybook + registry entry TODO.

Reduces “new entity = developer weeks” to “new entity = hours + review” while keeping CSR boundaries.

---

## 35. Scheduled Publish & Snapshots (Locked)

On Page / Product / CapacityMetric / etc.:

```ts
status: "draft" | "scheduled" | "published";
scheduledPublishAt: Date | null;
publishedAt: Date | null;
publishedVersion: Mixed | null; // last published snapshot for rollback display
version: number;                // optimistic concurrency (§42)
```

- Admin “Schedule” sets `scheduled` + datetime.
- Job `scheduled-publish` flips to `published`, writes snapshot, `revalidateTag`.
- Unpublish returns to draft; snapshot kept for history UI (simple — not full version control tree).

---

## 36. Redirect Map (Locked)

```ts
// Redirect entity
{ fromPath: string; toPath: string; statusCode: 301 | 302; active: boolean; }
```

- Unique index on `fromPath`.
- Next.js middleware reads redirects (cached in memory / Upstash, TTL 60s; bust on admin save).
- On Product/Page slug change: service **auto-creates** 301 from old → new unless editor opts out.
- Admin: Settings → Redirects CRUD.

---

## 37. Draft Preview Links (Locked)

- `POST /api/v1/preview` → `{ token, url, expiresAt }` (HMAC or random token stored hashed, TTL **7 days**).
- Public route `/preview/[token]` loads draft by entity type/id; **noindex**; middleware sets cookie `preview=1`.
- Banner: “Preview — not public”.
- Job expires tokens; revoke endpoint for editors.

---

## 38. CSV Import / Export (Locked)

- Admin: Products, Categories (flat), CapacityMetrics, Dictionary items.
- Wizard: upload → **parse preview table** → Zod per row → show errors → confirm.
- Max rows (e.g. 500) on free tier; oversize rejected with message.
- Export: current filter → CSV download (editor+).
- Runs in request for small files; if > threshold, enqueue job pattern (same jobs module) — v1 keep sync under limit.

---

## 39. FormDefinition (Enquiry Fields — Locked)

Not a visual form builder. CMS-editable **field list**:

```ts
{
  formKey: "enquiry" | "rfq";
  fields: [{
    name: string;
    type: "text" | "email" | "tel" | "textarea" | "select" | "number";
    label: Map<string,string>;
    required: boolean;
    options?: string[]; // for select — or dictionaryKey
    sortOrder: number;
    active: boolean;
  }];
}
```

- Server builds Zod object **dynamically** from active fields + always-on honeypot.
- Client RHF uses same schema from API `GET /api/v1/forms/enquiry`.
- Adding a field = admin only. Renaming `name` carefully (breaks historical Lead shape — store raw payload JSON on Lead).

---

## 40. Search Ladder (Locked)

| Stage | When | Tech |
|---|---|---|
| **v1** | Launch | Mongo text index on Product `name`+`sku`; admin search same |
| **v2** | Text search p95 > budget OR relevance complaints | **Atlas Search** index; repository port adds `search(q)` — service unchanged |
| Never default | — | Algolia/paid search until Atlas Search insufficient |

---

## 41. Outbound Webhooks (Locked)

```ts
{ url: string; secret: string; events: ("lead.created" | "product.published")[]; active: boolean; }
```

- On event: HMAC sign body, POST, record delivery.
- Failures → `webhook-retry` job (exponential backoff, max 5).
- CRM = optional webhook; **email remains primary** (§13).

---

## 42. Concurrent Edit (Optimistic Locking — Locked)

Every mutable CMS entity:

```ts
version: number; // increment on each successful save
```

- PATCH body must include `version`.
- If DB `version !== body.version` → **409 Conflict** + message “Updated elsewhere — reload”.
- Admin: on 409, prompt reload/diff (simple reload first).
- Optional Upstash lock key `lock:product:{id}` TTL 30s for “editing” indicator — nice-to-have, not required for correctness.

---

## 43. Public Cache & Read Scale (Locked)

| Layer | Policy |
|---|---|
| HTML (ISR) | `revalidateTag` per entity on publish (`products`, `pages`, `capacity`, …) |
| CDN / CF | `Cache-Tag` headers aligned to tags where platform allows; else rely on ISR |
| Images | `next/image` + R2; CF Images if OpenNext path requires |
| Stampede | Upstash lock `revalidate:{tag}` during on-demand revalidate |
| Admin APIs | `Cache-Control: private, no-store` |
| Hot catalog | Cursor pagination + indexes (§30); virtualize admin lists when >200 rows |

Upgrade Atlas M0 → M10 only when **measured** CPU/storage pain — not at go-live by default.

---

## 44. Observability & Disaster Recovery (Locked)

| Concern | Decision |
|---|---|
| Errors / perf | Sentry (already) |
| Structured logs | `lib/logger` JSON lines: `requestId`, `userId`, `entity`, `action` — CF/Vercel log drain |
| Audit | `AuditLog` entity + **Admin → Audit** DataTable (filter by entity/user/date) |
| Backup | Atlas M0: document **manual export** weekly pre-launch; post-launch enable Atlas backups when on paid tier |
| Restore drill | Phase 10 Proof: restore sample dump to staging once |
| Uptime | Optional free UptimeRobot / CF health `GET /api/v1/health` (db ping) |

---

## 45. Bundle Size CI (Locked)

- `size-limit` (or OpenNext output size check) in GitHub Actions.
- Budget: stay under **Cloudflare free Worker compressed limit** (~3 MiB) with margin (e.g. fail at 2.5 MiB).
- Dynamic `import()` for heavy admin-only libs (xlsx CSV parser, large editors).
- Public bundle must not import admin features (boundaries + separate entry analysis).

---

## 46. Consent & Analytics (Locked)

- If `site.config.flags.analytics === true`: show consent banner before loading GA4.
- Store consent in cookie `hg_consent=1|0`; respect Update.
- GSC verification meta from Settings — no hardcode.
- Admin exempt from marketing cookies.

---

## 47. Media Pipeline (Locked)

1. Client upload → API validates MIME/size → R2 put.  
2. Store `Media { hash?, width, height, kind, tags[], alt }`.  
3. **Optional dedupe:** if SHA-256 matches existing active media, reuse id (warn in UI).  
4. Public: `next/image` remotePatterns for R2/CDN.  
5. PDFs (certs, drawings): direct R2 signed or public URL with Content-Disposition.  
6. No virus scanner on free tier — accept risk for trusted admin-only uploads; document. Paid ClamAV later if needed.

---

## 48. Gap Closure Traceability

| Prior gap | Closed in |
|---|---|
| Dictionary code vs CMS | §33 |
| New entity friction | §34 |
| Scheduled publish | §35 |
| Slug SEO breakage | §36 |
| Draft share | §37 |
| Bulk catalog ops | §38 |
| Fixed enquiry schema | §39 |
| Search scale | §40 |
| CRM later | §41 |
| Multi-editor overwrite | §42 |
| CDN / stampede | §43 |
| Logs / backup / audit UI | §44 |
| Worker size surprise | §45 |
| GDPR/cookie | §46 |
| Media dedupe / pipeline | §47 |
| Serverless cron | §32 |
| “Plan later” register | §22 rewritten |

**Still not architecture gaps:** client-supplied legal text, brand files, listing status, which ₹ figures are public — CMS fields wait for data (§19).

---

*End of v1.7. Architecture scale/dynamic gaps closed by decision. Implement per phase gates §20 / §26.*
