import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { buttonVariants } from "@/components/ui/button";
import { CatalogueBreadcrumbs } from "@/features/public-catalog/components/catalogue-breadcrumbs";
import { ProductCard } from "@/features/public-catalog/components/product-card";
import {
  categoryLandingHref,
  productImageUrl,
} from "@/features/public-catalog/lib/product-media";
import { EnquiryForm } from "@/features/public-site/components/enquiry-form";
import { InquireBand } from "@/features/public-site/components/inquire-band";
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
  extrusion: "Extrusion profiles",
  billet: "Homogenised billets",
  ingot: "Ingots & alloys",
  remelt: "Remelt forms",
  deoxidizer: "Deoxidizer",
  other: "Aluminium products",
};

function prettyToken(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatMm(n: number | null | undefined) {
  if (n == null || !Number.isFinite(n)) return null;
  return `${Math.round(n).toLocaleString("en-IN")} mm`;
}

function formatKg(n: number | null | undefined, suffix = "kg") {
  if (n == null || !Number.isFinite(n)) return null;
  return `${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })} ${suffix}`;
}

function SpecRow({ label, children }: { label: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <div className="grid grid-cols-[minmax(7rem,11rem)_1fr] gap-3 border-b border-black/[0.06] py-3 last:border-b-0">
      <dt className="text-text-faint text-[0.75rem] font-semibold tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

function ChipList({ values }: { values: string[] }) {
  if (!values.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {values.map((v) => (
        <li
          key={v}
          className="rounded-full border border-line bg-bg-alt px-2.5 py-0.5 text-[0.75rem] font-medium text-ink"
        >
          {prettyToken(v)}
        </li>
      ))}
    </ul>
  );
}

function buildSpecRows(product: ProductDTO) {
  const rows: { label: string; node: ReactNode }[] = [];

  if (product.alloyGrades.length) {
    rows.push({
      label: "Alloy grades",
      node: <ChipList values={product.alloyGrades} />,
    });
  }
  if (product.tempers.length) {
    rows.push({
      label: "Tempers",
      node: <ChipList values={product.tempers} />,
    });
  }
  if (product.surfaceFinishes.length) {
    rows.push({
      label: "Surface",
      node: <ChipList values={product.surfaceFinishes} />,
    });
  }
  if (product.anodizingColors.length) {
    rows.push({
      label: "Anodizing",
      node: <ChipList values={product.anodizingColors} />,
    });
  }
  if (product.ralColors.length) {
    rows.push({
      label: "Powder colours",
      node: <ChipList values={product.ralColors} />,
    });
  }

  const lengthParts = [
    product.minLengthMm != null ? formatMm(product.minLengthMm) : null,
    product.maxLengthMm != null ? formatMm(product.maxLengthMm) : null,
  ].filter(Boolean);
  if (lengthParts.length) {
    rows.push({
      label: "Length",
      node:
        lengthParts.length === 2
          ? `${lengthParts[0]} – ${lengthParts[1]}`
          : lengthParts[0],
    });
  }

  const diameter = formatMm(product.typicalDiameterMm);
  if (diameter) {
    rows.push({ label: "Typical diameter", node: diameter });
  }

  const width = formatMm(product.maxWidthMm);
  if (width) {
    rows.push({ label: "CCD / max width", node: width });
  }

  const wpm = formatKg(product.weightPerMeterKg, "kg/m");
  if (wpm) {
    rows.push({ label: "Mass (indicative)", node: wpm });
  }

  const piece = formatKg(product.typicalPieceWeightKg);
  if (piece) {
    rows.push({ label: "Piece weight", node: `~ ${piece}` });
  }

  if (product.toleranceStandards.length) {
    rows.push({
      label: "Tolerances",
      node: product.toleranceStandards.map(prettyToken).join(" · "),
    });
  }
  if (product.packaging.length) {
    rows.push({
      label: "Packaging",
      node: product.packaging.map(prettyToken).join(" · "),
    });
  }
  if (product.standardsNote?.trim()) {
    rows.push({ label: "Standards", node: product.standardsNote.trim() });
  }
  if (product.moqNote?.trim()) {
    rows.push({ label: "Supply", node: product.moqNote.trim() });
  }
  if (product.sku) {
    rows.push({ label: "SKU", node: product.sku });
  }

  return rows;
}

/**
 * Industrial PDP — alloy / temper / dimensions / chemistry / applications.
 * Data from CMS Product; empty groups stay hidden.
 */
export async function ProductDetail({ locale, slug }: ProductDetailProps) {
  const product = await getCachedPublishedProductBySlug(slug);
  if (!product) notFound();

  const upcoming = Boolean(product.isUpcoming);
  const image = productImageUrl(product);
  const enquireHref = `#enquire`;
  const contactHref = `contact?product=${encodeURIComponent(product.name.en)}`;

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
    : await getCachedPublishedProducts({
        limit: 8,
        upcoming: false,
      });
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

  return (
    <>
      <section className="border-line border-b bg-bg">
        <Container className="py-[clamp(1.35rem,3vw,2rem)]">
          <CatalogueBreadcrumbs
            locale={locale}
            items={crumbs}
            className="mb-4"
          />
          <div className="grid gap-8 min-[900px]:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] min-[900px]:items-start min-[900px]:gap-10 min-[1100px]:gap-14">
            <Reveal className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-lg)] bg-bg-alt shadow-[var(--shadow-sm)] min-[900px]:aspect-[4/3] min-[900px]:min-h-[22rem]">
              <Image
                src={image}
                alt={product.name.en}
                fill
                className="object-cover"
                sizes="(min-width: 900px) 40rem, 100vw"
                priority
              />
              {upcoming ? (
                <span className="absolute top-4 left-4 rounded-full bg-ink/90 px-3 py-1 text-xs font-bold tracking-wide text-brand-red uppercase">
                  Coming soon
                </span>
              ) : null}
            </Reveal>

            <Reveal>
              <p className="text-[0.7rem] font-bold tracking-[0.14em] text-brand-red uppercase">
                {upcoming ? "Coming soon" : formLabel}
              </p>
              <h1 className="font-display mt-2 text-[clamp(1.65rem,1.25rem+1.6vw,2.5rem)] font-semibold leading-[1.1] tracking-tight text-balance text-ink">
                {product.name.en}
              </h1>
              {product.description ? (
                <p className="text-muted-foreground mt-3 max-w-[42rem] text-[0.975rem] leading-relaxed">
                  {product.description}
                </p>
              ) : null}

              {product.alloyGrades.length ? (
                <div className="mt-5">
                  <p className="text-text-faint mb-2 text-[0.65rem] font-bold tracking-[0.12em] uppercase">
                    Available alloys
                  </p>
                  <ChipList values={product.alloyGrades} />
                </div>
              ) : null}

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={enquireHref}
                  className={cn(buttonVariants({ variant: "default" }), "min-h-11")}
                >
                  {upcoming ? "Register interest" : "Enquire on this line"}
                </Link>
                <Link
                  href={localePath(locale, contactHref)}
                  className={cn(buttonVariants({ variant: "outline" }), "min-h-11")}
                >
                  Full RFQ form
                </Link>
              </div>

              {product.moqNote ? (
                <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
                  {product.moqNote}
                </p>
              ) : null}
            </Reveal>
          </div>
        </Container>
      </section>

      <Section appearance="compact">
        <Container>
          <div className="grid gap-10 min-[900px]:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] min-[900px]:gap-12">
            <div className="space-y-10">
              {specRows.length ? (
                <Reveal>
                  <h2 className="font-display text-lg font-semibold text-ink">
                    Technical specifications
                  </h2>
                  <p className="text-muted-foreground mt-1.5 text-sm">
                    Indicative plant capability — confirm alloy, temper and
                    packing on enquiry.
                  </p>
                  <dl className="border-line mt-5 rounded-[var(--radius-lg)] border bg-surface px-4 sm:px-5">
                    {specRows.map((row) => (
                      <SpecRow key={row.label} label={row.label}>
                        {row.node}
                      </SpecRow>
                    ))}
                  </dl>
                </Reveal>
              ) : null}

              {product.chemicalComposition.length ? (
                <Reveal>
                  <h2 className="font-display text-lg font-semibold text-ink">
                    Chemical composition
                  </h2>
                  <p className="text-muted-foreground mt-1.5 text-sm">
                    Typical / agreed ranges (wt%). Final lot chemistry on mill
                    certificate.
                  </p>
                  <div className="border-line mt-5 overflow-hidden rounded-[var(--radius-lg)] border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-bg-alt text-text-faint text-[0.7rem] tracking-wide uppercase">
                        <tr>
                          <th className="px-4 py-2.5 font-semibold">Element</th>
                          <th className="px-4 py-2.5 font-semibold">Range</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.chemicalComposition.map((row) => (
                          <tr
                            key={row.element}
                            className="border-t border-black/[0.06]"
                          >
                            <td className="px-4 py-2.5 font-medium text-ink">
                              {row.element}
                            </td>
                            <td className="text-muted-foreground px-4 py-2.5">
                              {row.range || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Reveal>
              ) : null}

              {product.applications.length ? (
                <Reveal>
                  <h2 className="font-display text-lg font-semibold text-ink">
                    Typical applications
                  </h2>
                  <ul className="mt-4 grid gap-2 min-[560px]:grid-cols-2">
                    {product.applications.map((app) => (
                      <li
                        key={app}
                        className="border-line flex items-start gap-2.5 rounded-[var(--radius-md)] border bg-bg-alt/40 px-3 py-2.5 text-sm text-ink"
                      >
                        <Check
                          className="text-brand-blue mt-0.5 size-4 shrink-0"
                          aria-hidden
                        />
                        {app}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}

              <div
                id="enquire"
                className="border-line bg-surface scroll-mt-24 rounded-[var(--radius-lg)] border p-5 shadow-[var(--shadow-sm)] sm:p-6"
              >
                <h2 className="font-display text-[clamp(1.2rem,1.05rem+0.5vw,1.4rem)] font-semibold text-ink">
                  {upcoming ? "Register interest" : "Enquire about this product"}
                </h2>
                <p className="text-muted-foreground mt-2 max-w-[48ch] text-sm leading-relaxed">
                  Share alloy preference, monthly tonnage and destination —
                  sales confirms feasibility and lead time.
                </p>
                <EnquiryForm
                  locale={locale}
                  defaultProduct={product.name.en}
                  productSlug={product.slug}
                  source="product"
                  className="mt-5"
                />
              </div>
            </div>

            <aside className="min-[900px]:sticky min-[900px]:top-24 min-[900px]:self-start">
              <Reveal className="border-line space-y-5 rounded-[var(--radius-lg)] border bg-bg-alt/50 p-4 sm:p-5">
                {product.highlights.length ? (
                  <div>
                    <p className="text-text-faint mb-2.5 text-[0.7rem] font-bold tracking-[0.1em] uppercase">
                      Why HG
                    </p>
                    <ul className="space-y-2.5">
                      {product.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex gap-2 text-sm leading-relaxed text-ink"
                        >
                          <Check
                            className="text-brand-red mt-0.5 size-4 shrink-0"
                            aria-hidden
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className={product.highlights.length ? "border-line border-t pt-4" : undefined}>
                  <p className="text-text-faint mb-2 text-[0.7rem] font-bold tracking-[0.1em] uppercase">
                    Programme next step
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Feasibility first — die / casting fit and lead time before a
                    commercial offer.
                  </p>
                  <Link
                    href={enquireHref}
                    className={cn(
                      buttonVariants({ variant: "default", size: "sm" }),
                      "mt-4 w-full",
                    )}
                  >
                    {upcoming ? "Register interest" : "Start enquiry"}
                  </Link>
                  {primaryCategory && categoryHref ? (
                    <Link
                      href={localePath(locale, categoryHref)}
                      className="text-brand-blue mt-3 inline-flex text-sm font-semibold hover:underline"
                    >
                      More in {primaryCategory.name.en} →
                    </Link>
                  ) : (
                    <Link
                      href={localePath(locale, "products")}
                      className="text-brand-blue mt-3 inline-flex text-sm font-semibold hover:underline"
                    >
                      Full catalogue →
                    </Link>
                  )}
                </div>
              </Reveal>
            </aside>
          </div>

          {related.length ? (
            <div className="mt-14">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-display text-xl font-semibold text-ink">
                  Related lines
                </h2>
                <Link
                  href={localePath(
                    locale,
                    categoryHref ??
                      (upcoming ? "products#upcoming" : "products"),
                  )}
                  className="text-brand-blue text-sm font-semibold hover:underline"
                >
                  View category →
                </Link>
              </div>
              <ul className="grid gap-4 min-[640px]:grid-cols-2 min-[640px]:gap-5 min-[1024px]:grid-cols-3">
                {related.map((item) => (
                  <li key={item.id}>
                    <ProductCard locale={locale} product={item} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </Section>

      <InquireBand
        locale={locale}
        title="Need a related alloy, billet size or custom profile?"
        ctaHref={contactHref}
      />
    </>
  );
}
