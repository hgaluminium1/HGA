import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/atoms/container";
import { CatalogueBreadcrumbs } from "@/features/public-catalog/components/catalogue-breadcrumbs";
import { ProductCard } from "@/features/public-catalog/components/product-card";
import {
  categoryLandingHref,
  productImageUrl,
} from "@/features/public-catalog/lib/product-media";
import { EnquiryForm } from "@/features/public-site/components/enquiry-form";
import {
  getCachedPublishedProductBySlug,
  getCachedPublishedProducts,
} from "@/features/public-site/lib/public-cache";
import { localePath } from "@/config/nav.config";
import { listCategoriesFlat, type ProductDTO } from "@/modules/catalog";
import { cn } from "@/lib/utils";

type ProductDetailProps = {
  locale: string;
  slug: string;
};

const FORM_LABEL: Record<ProductDTO["formType"], string> = {
  extrusion: "Extrusion",
  billet: "Billet",
  ingot: "Ingot",
  remelt: "Remelt",
  deoxidizer: "Deoxidizer",
  other: "Product",
};

function prettyToken(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatMm(n: number | null | undefined) {
  if (n == null || !Number.isFinite(n)) return null;
  return `${Math.round(n).toLocaleString("en-IN")} mm`;
}

function formatKg(n: number | null | undefined, suffix = "kg") {
  if (n == null || !Number.isFinite(n)) return null;
  return `${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })} ${suffix}`;
}

function SpecTable({ rows }: { rows: { label: string; value: string }[] }) {
  if (!rows.length) return null;
  return (
    <table className="pdp-spec-table w-full border-collapse text-left">
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={row.label}
            className={cn(
              "border-b border-black/[0.06]",
              i % 2 === 0 ? "bg-bg-alt/50" : "bg-surface",
            )}
          >
            <th
              scope="row"
              className="pdp-spec-table__label w-[min(38%,9.5rem)] align-top font-medium text-ink"
            >
              {row.label}
            </th>
            <td className="pdp-spec-table__value text-muted-foreground align-top">
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function buildSpecRows(product: ProductDTO): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  if (product.sku) rows.push({ label: "SKU", value: product.sku });
  if (product.alloyGrades.length) {
    rows.push({ label: "Alloy grades", value: product.alloyGrades.join(", ") });
  }
  if (product.tempers.length) {
    rows.push({ label: "Tempers", value: product.tempers.join(", ") });
  }
  if (product.surfaceFinishes.length) {
    rows.push({
      label: "Surface",
      value: product.surfaceFinishes.map(prettyToken).join(", "),
    });
  }
  if (product.anodizingColors.length) {
    rows.push({
      label: "Anodizing",
      value: product.anodizingColors.map(prettyToken).join(", "),
    });
  }
  if (product.ralColors.length) {
    rows.push({ label: "Powder colours", value: product.ralColors.join(", ") });
  }
  const lengthParts = [
    product.minLengthMm != null ? formatMm(product.minLengthMm) : null,
    product.maxLengthMm != null ? formatMm(product.maxLengthMm) : null,
  ].filter(Boolean);
  if (lengthParts.length) {
    rows.push({
      label: "Length",
      value:
        lengthParts.length === 2
          ? `${lengthParts[0]} – ${lengthParts[1]}`
          : String(lengthParts[0]),
    });
  }
  const diameter = formatMm(product.typicalDiameterMm);
  if (diameter) rows.push({ label: "Diameter", value: diameter });
  const width = formatMm(product.maxWidthMm);
  if (width) rows.push({ label: "CCD / max width", value: width });
  const wpm = formatKg(product.weightPerMeterKg, "kg/m");
  if (wpm) rows.push({ label: "Mass", value: wpm });
  const piece = formatKg(product.typicalPieceWeightKg);
  if (piece) rows.push({ label: "Piece weight", value: `~ ${piece}` });
  if (product.toleranceStandards.length) {
    rows.push({
      label: "Tolerances",
      value: product.toleranceStandards.map(prettyToken).join(", "),
    });
  }
  if (product.packaging.length) {
    rows.push({
      label: "Packaging",
      value: product.packaging.map(prettyToken).join(", "),
    });
  }
  if (product.standardsNote?.trim()) {
    rows.push({ label: "Standards", value: product.standardsNote.trim() });
  }
  if (product.moqNote?.trim()) {
    rows.push({ label: "Supply", value: product.moqNote.trim() });
  }
  return rows;
}

function Panel({
  title,
  id,
  hint,
  children,
}: {
  title: string;
  id: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="min-w-0">
      <h2
        id={id}
        className="font-display pdp-section-title font-semibold text-ink"
      >
        {title}
      </h2>
      {hint ? (
        <p className="text-text-faint mt-0.5 text-[0.7rem] leading-snug">{hint}</p>
      ) : null}
      <div className="border-line mt-1.5 overflow-hidden rounded-[var(--radius-md)] border bg-surface">
        {children}
      </div>
    </section>
  );
}

/**
 * Industrial datasheet PDP — McMaster utility + DigiKey supporting pane.
 * Layout owned by @container (available width), not device breakpoints.
 */
export async function ProductDetail({ locale, slug }: ProductDetailProps) {
  const product = await getCachedPublishedProductBySlug(slug);
  if (!product) notFound();

  const upcoming = Boolean(product.isUpcoming);
  const image = productImageUrl(product);

  const categories = await listCategoriesFlat();
  const primaryCategory = categories.find((c) =>
    product.categoryIds.includes(c.id),
  );
  const categoryHref = primaryCategory
    ? categoryLandingHref(primaryCategory.slug)
    : null;

  const relatedCategoryId = product.categoryIds[0];
  const { items: relatedPool } = relatedCategoryId
    ? await getCachedPublishedProducts({
        limit: 8,
        upcoming: upcoming ? true : false,
        categoryId: relatedCategoryId,
      })
    : await getCachedPublishedProducts({ limit: 8, upcoming: false });
  const related = relatedPool.filter((p) => p.id !== product.id).slice(0, 3);

  const crumbs = [
    { label: "Catalogue", href: "products" },
    ...(primaryCategory
      ? [{ label: primaryCategory.name.en, href: categoryHref ?? undefined }]
      : []),
    { label: product.name.en },
  ];

  const specRows = buildSpecRows(product);
  const formLabel = FORM_LABEL[product.formType] || FORM_LABEL.other;
  const rfqTitle = upcoming ? "Register interest" : "Request quote";
  const hasSpecs = specRows.length > 0;
  const hasChem = product.chemicalComposition.length > 0;
  const pairDocs = hasSpecs && hasChem;

  return (
    <div className="bg-bg">
      <Container className="py-[clamp(0.85rem,0.6rem+1vw,1.35rem)]">
        <div className="pdp has-dock">
          <CatalogueBreadcrumbs
            locale={locale}
            items={crumbs}
            className="mb-[clamp(0.65rem,0.45rem+0.6cqw,1rem)]"
          />

          <div className="pdp-shell">
            {/* Identity — continuous thumb/type resize via cqw */}
            <header className="pdp-identity border-line border-b pb-[clamp(0.85rem,0.6rem+0.8cqw,1.25rem)]">
              <div className="pdp-identity__row">
                <div className="pdp-identity__media">
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 52.5rem) 100px, 12vw"
                    priority
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-[0.65rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
                      {upcoming ? "Coming soon" : formLabel}
                    </span>
                    {product.sku ? (
                      <span className="text-text-faint font-mono text-[0.7rem]">
                        {product.sku}
                      </span>
                    ) : null}
                    {categoryHref && primaryCategory ? (
                      <>
                        <span className="text-text-faint text-[0.7rem]" aria-hidden>
                          ·
                        </span>
                        <Link
                          href={localePath(locale, categoryHref)}
                          className="text-muted-foreground hover:text-brand-blue text-[0.75rem] font-medium hover:underline"
                        >
                          {primaryCategory.name.en}
                        </Link>
                      </>
                    ) : null}
                  </div>
                  <h1 className="pdp-identity__title font-display mt-1 font-semibold text-ink">
                    {product.name.en}
                  </h1>
                  {product.description ? (
                    <p className="text-muted-foreground pdp-lede mt-1.5 max-w-[40rem] leading-relaxed">
                      {product.description}
                    </p>
                  ) : null}
                  {product.alloyGrades.length ? (
                    <p className="text-muted-foreground mt-2 text-[0.75rem] leading-snug">
                      <span className="font-semibold text-ink">Grades </span>
                      {product.alloyGrades.join(" · ")}
                    </p>
                  ) : null}
                </div>
              </div>
            </header>

            {/* Specs body — pairs when pdp-body container ≥ 40rem */}
            <div className="pdp-body space-y-[var(--pdp-gap)]">
              <div
                className={cn("pdp-docs", pairDocs && "pdp-docs--pair")}
              >
                {hasSpecs ? (
                  <Panel title="Specifications" id="specs-heading">
                    <SpecTable rows={specRows} />
                  </Panel>
                ) : null}

                {hasChem ? (
                  <Panel
                    title="Chemical composition"
                    id="chem-heading"
                    hint="Typical / agreed ranges (wt%). Lot values on mill certificate."
                  >
                    <div className="overflow-x-auto">
                      <table className="pdp-spec-table w-full min-w-[12rem] border-collapse text-left">
                        <thead>
                          <tr className="bg-bg-alt text-text-faint text-[0.65rem] tracking-wide uppercase">
                            <th className="px-3 py-1.5 font-semibold">Element</th>
                            <th className="px-3 py-1.5 font-semibold">Range</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.chemicalComposition.map((row, i) => (
                            <tr
                              key={row.element}
                              className={cn(
                                "border-t border-black/[0.06]",
                                i % 2 === 0 ? "bg-surface" : "bg-bg-alt/40",
                              )}
                            >
                              <td className="px-3 py-1.5 font-medium text-ink">
                                {row.element}
                              </td>
                              <td className="text-muted-foreground px-3 py-1.5">
                                {row.range || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Panel>
                ) : null}
              </div>

              {product.applications.length ? (
                <section aria-labelledby="apps-heading">
                  <h2
                    id="apps-heading"
                    className="font-display pdp-section-title font-semibold text-ink"
                  >
                    Applications
                  </h2>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {product.applications.map((app) => (
                      <li
                        key={app}
                        className="border-line rounded-full border bg-bg-alt px-2.5 py-1 text-[0.75rem] text-ink"
                      >
                        {app}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {product.highlights.length ? (
                <section aria-labelledby="why-heading">
                  <h2
                    id="why-heading"
                    className="font-display pdp-section-title font-semibold text-ink"
                  >
                    Programme notes
                  </h2>
                  <ul className="text-muted-foreground mt-1.5 list-disc space-y-1 pl-4 text-[0.8125rem] leading-relaxed">
                    {product.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            {/* Single conversion surface — sticky rail when pane expands */}
            <aside
              id="rfq"
              className="pdp-rfq border-line scroll-mt-24 rounded-[var(--radius-md)] border bg-surface p-[clamp(0.85rem,0.7rem+0.5cqw,1.1rem)] shadow-[var(--shadow-sm)]"
            >
              <h2 className="font-display text-[0.875rem] font-semibold text-ink">
                {rfqTitle}
              </h2>
              <p className="text-muted-foreground mt-1 text-[0.72rem] leading-snug">
                Alloy, tonnage, destination — sales confirms lead time.
              </p>
              <EnquiryForm
                locale={locale}
                defaultProduct={product.name.en}
                productSlug={product.slug}
                source="product"
                density="compact"
                className="mt-3 @container"
              />
            </aside>

            {related.length ? (
              <section className="pdp-related border-line border-t pt-[clamp(1rem,0.75rem+0.8cqw,1.5rem)]">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-[0.9rem] font-semibold text-ink">
                    Related
                  </h2>
                  <Link
                    href={localePath(
                      locale,
                      categoryHref ??
                        (upcoming ? "products#upcoming" : "products"),
                    )}
                    className="text-brand-blue text-[0.75rem] font-semibold hover:underline"
                  >
                    Catalogue →
                  </Link>
                </div>
                <ul className="pdp-related__grid">
                  {related.map((item) => (
                    <li key={item.id} className="min-w-0">
                      <ProductCard locale={locale} product={item} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          {/* Compact only: replace sticky rail with dock jump (hidden via @container) */}
          <div className="pdp-dock">
            <a
              href="#rfq"
              className="bg-brand-red text-primary-foreground flex min-h-11 w-full items-center justify-center rounded-[var(--radius-md)] text-[0.8125rem] font-semibold"
            >
              {rfqTitle}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
