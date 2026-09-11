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

/** DigiKey-style dense label|value rows. */
function SpecTable({ rows }: { rows: { label: string; value: string }[] }) {
  if (!rows.length) return null;
  return (
    <table className="w-full border-collapse text-left text-[0.8125rem]">
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
              className="w-[36%] max-w-[10.5rem] px-3 py-2 align-top font-medium text-ink sm:w-[10.5rem]"
            >
              {row.label}
            </th>
            <td className="text-muted-foreground px-3 py-2 align-top">
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

/**
 * Strict enterprise PDP (DigiKey / McMaster procurement pattern):
 * - Tiny identification thumb — not a hero collage
 * - Dense specs left; ONE conversion surface (sticky RFQ rail)
 * - No second form, no “enquire” button cluster, no page-level inquire band
 * Site header “Enquire” stays as global chrome only.
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

  return (
    <div className="bg-bg pb-[4.25rem] min-[900px]:pb-0">
      <Container className="py-4 sm:py-5">
        <CatalogueBreadcrumbs locale={locale} items={crumbs} className="mb-3" />

        {/* Compact identity — thumb + copy. Zero enquire buttons here. */}
        <header className="border-line flex gap-3.5 border-b pb-4 min-[640px]:gap-5">
          <div className="relative aspect-square w-[4.75rem] shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-bg-alt ring-1 ring-black/[0.06] min-[640px]:w-[5.5rem]">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
              sizes="88px"
              priority
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
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
            <h1 className="font-display mt-1 text-[clamp(1.25rem,1.1rem+0.7vw,1.65rem)] font-semibold leading-tight tracking-tight text-ink">
              {product.name.en}
            </h1>
            {product.description ? (
              <p className="text-muted-foreground mt-1.5 max-w-[36rem] text-[0.8125rem] leading-relaxed">
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
        </header>

        {/* Specs + single RFQ rail — the only conversion surface on this page */}
        <div className="mt-4 grid gap-5 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(15.5rem,17.5rem)] min-[900px]:items-start min-[900px]:gap-6">
          <div className="min-w-0 space-y-5">
            {specRows.length ? (
              <section aria-labelledby="specs-heading">
                <h2
                  id="specs-heading"
                  className="font-display text-[0.9rem] font-semibold text-ink"
                >
                  Specifications
                </h2>
                <div className="border-line mt-1.5 overflow-hidden rounded-[var(--radius-md)] border">
                  <SpecTable rows={specRows} />
                </div>
              </section>
            ) : null}

            {product.chemicalComposition.length ? (
              <section aria-labelledby="chem-heading">
                <h2
                  id="chem-heading"
                  className="font-display text-[0.9rem] font-semibold text-ink"
                >
                  Chemical composition
                </h2>
                <p className="text-text-faint mt-0.5 text-[0.7rem]">
                  Typical / agreed ranges (wt%). Lot values on mill certificate.
                </p>
                <div className="border-line mt-1.5 overflow-x-auto rounded-[var(--radius-md)] border">
                  <table className="w-full min-w-[14rem] border-collapse text-left text-[0.8125rem]">
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
              </section>
            ) : null}

            {product.applications.length ? (
              <section aria-labelledby="apps-heading">
                <h2
                  id="apps-heading"
                  className="font-display text-[0.9rem] font-semibold text-ink"
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
                  className="font-display text-[0.9rem] font-semibold text-ink"
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

          <aside
            id="rfq"
            className="border-line scroll-mt-24 rounded-[var(--radius-md)] border bg-surface p-3.5 shadow-[var(--shadow-sm)] min-[900px]:sticky min-[900px]:top-20"
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
              className="mt-3"
            />
          </aside>
        </div>

        {related.length ? (
          <section className="border-line mt-7 border-t pt-5">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-[0.9rem] font-semibold text-ink">
                Related
              </h2>
              <Link
                href={localePath(
                  locale,
                  categoryHref ?? (upcoming ? "products#upcoming" : "products"),
                )}
                className="text-brand-blue text-[0.75rem] font-semibold hover:underline"
              >
                Catalogue →
              </Link>
            </div>
            <ul className="grid gap-3 min-[560px]:grid-cols-2 min-[900px]:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <ProductCard locale={locale} product={item} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>

      {/* Mobile only: jump to the one RFQ rail — not a second form */}
      <div className="border-line bg-surface/95 fixed inset-x-0 bottom-0 z-40 border-t p-2.5 backdrop-blur-md min-[900px]:hidden">
        <a
          href="#rfq"
          className="bg-brand-red text-brand-red-fg flex min-h-10 w-full items-center justify-center rounded-[var(--radius-md)] text-[0.8125rem] font-semibold"
        >
          {rfqTitle}
        </a>
      </div>
    </div>
  );
}
