import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/atoms/container";
import { CatalogueBreadcrumbs } from "@/features/public-catalog/components/catalogue-breadcrumbs";
import { ProductCard } from "@/features/public-catalog/components/product-card";
import { ProductQuoteSheet } from "@/features/public-catalog/components/product-quote-sheet";
import {
  categoryLandingHref,
  productImageUrl,
} from "@/features/public-catalog/lib/product-media";
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
 * Enterprise product datasheet (NVIDIA / DigiKey pattern):
 * — Subheader: identity + one action (quote sheet)
 * — Main: full-width dense specs (no side rail, no sticky form)
 * — Footer band: related only
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
  const quoteLabel = upcoming ? "Register interest" : "Request quote";

  return (
    <article className="ds bg-bg">
      <Container className="ds__pad">
        <CatalogueBreadcrumbs locale={locale} items={crumbs} className="ds__crumbs" />

        {/* Subheader — title, meta, single CTA (NVIDIA detail pattern) */}
        <header className="ds__subheader">
          <div className="ds__media" aria-hidden>
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
              sizes="96px"
              priority
            />
          </div>

          <div className="ds__subheader-main">
            <p className="ds__meta">
              <span className="ds__eyebrow">
                {upcoming ? "Coming soon" : formLabel}
              </span>
              {product.sku ? (
                <span className="ds__sku">{product.sku}</span>
              ) : null}
              {categoryHref && primaryCategory ? (
                <Link
                  href={localePath(locale, categoryHref)}
                  className="ds__cat"
                >
                  {primaryCategory.name.en}
                </Link>
              ) : null}
            </p>

            <h1 className="ds__title">{product.name.en}</h1>

            {product.description ? (
              <p className="ds__lede">{product.description}</p>
            ) : null}

            {product.alloyGrades.length ? (
              <p className="ds__grades">
                <span className="font-semibold text-ink">Grades</span>{" "}
                {product.alloyGrades.join(" · ")}
              </p>
            ) : null}

            <div className="ds__actions">
              <ProductQuoteSheet
                locale={locale}
                productName={product.name.en}
                productSlug={product.slug}
                label={quoteLabel}
              />
            </div>
          </div>
        </header>

        {/* Main — single column reading flow; tables pair when wide enough */}
        <div className="ds__main">
          {specRows.length ? (
            <section className="ds__section" aria-labelledby="ds-specs">
              <h2 id="ds-specs" className="ds__h2">
                Specifications
              </h2>
              <div className="ds__table-wrap">
                <table className="ds__table">
                  <tbody>
                    {specRows.map((row, i) => (
                      <tr
                        key={row.label}
                        className={cn(i % 2 === 0 && "ds__table-row-alt")}
                      >
                        <th scope="row">{row.label}</th>
                        <td>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {product.chemicalComposition.length ? (
            <section className="ds__section" aria-labelledby="ds-chem">
              <h2 id="ds-chem" className="ds__h2">
                Chemical composition
              </h2>
              <p className="ds__hint">
                Typical / agreed ranges (wt%). Lot values on mill certificate.
              </p>
              <div className="ds__table-wrap">
                <table className="ds__table">
                  <thead>
                    <tr>
                      <th scope="col">Element</th>
                      <th scope="col">Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.chemicalComposition.map((row, i) => (
                      <tr
                        key={row.element}
                        className={cn(i % 2 === 0 && "ds__table-row-alt")}
                      >
                        <th scope="row">{row.element}</th>
                        <td>{row.range || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {product.applications.length ? (
            <section className="ds__section" aria-labelledby="ds-apps">
              <h2 id="ds-apps" className="ds__h2">
                Applications
              </h2>
              <ul className="ds__chips">
                {product.applications.map((app) => (
                  <li key={app}>{app}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {product.otherApplications.length ? (
            <section className="ds__section" aria-labelledby="ds-other-apps">
              <h2 id="ds-other-apps" className="ds__h2">
                Other applications
              </h2>
              <ul className="ds__chips">
                {product.otherApplications.map((app) => (
                  <li key={app}>{app}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {product.directCustomers.length ? (
            <section className="ds__section" aria-labelledby="ds-direct">
              <h2 id="ds-direct" className="ds__h2">
                Direct customers
              </h2>
              <ul className="ds__chips">
                {product.directCustomers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {product.endUseIndustries.length ? (
            <section className="ds__section" aria-labelledby="ds-enduse">
              <h2 id="ds-enduse" className="ds__h2">
                End-use industries
              </h2>
              <ul className="ds__chips">
                {product.endUseIndustries.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {product.capabilityApplications.length ? (
            <section className="ds__section" aria-labelledby="ds-capability">
              <h2 id="ds-capability" className="ds__h2">
                Capability / potential applications
              </h2>
              <p className="ds__hint">
                Not claimed as current supply without certification or approval.
              </p>
              <ul className="ds__chips">
                {product.capabilityApplications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {product.highlights.length ? (
            <section className="ds__section" aria-labelledby="ds-notes">
              <h2 id="ds-notes" className="ds__h2">
                Programme notes
              </h2>
              <ul className="ds__bullets">
                {product.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {related.length ? (
          <section className="ds__related" aria-labelledby="ds-related">
            <div className="ds__related-head">
              <h2 id="ds-related" className="ds__h2">
                Related
              </h2>
              <Link
                href={localePath(
                  locale,
                  categoryHref ?? (upcoming ? "products#upcoming" : "products"),
                )}
                className="ds__related-link"
              >
                Catalogue →
              </Link>
            </div>
            <ul className="ds__related-grid">
              {related.map((item) => (
                <li key={item.id}>
                  <ProductCard locale={locale} product={item} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </article>
  );
}
