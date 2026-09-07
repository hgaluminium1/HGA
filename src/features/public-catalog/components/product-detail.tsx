import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { buttonVariants } from "@/components/ui/button";
import { CatalogueBreadcrumbs } from "@/features/public-catalog/components/catalogue-breadcrumbs";
import { ProductCard } from "@/features/public-catalog/components/product-card";
import {
  categoryLandingHref,
  formatDimensionMm,
  formatWeightKg,
  productImageUrl,
} from "@/features/public-catalog/lib/product-media";
import { EnquiryForm } from "@/features/public-site/components/enquiry-form";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import {
  getCachedPublishedProductBySlug,
  getCachedPublishedProducts,
} from "@/features/public-site/lib/public-cache";
import { localePath } from "@/config/nav.config";
import { listCategoriesFlat } from "@/modules/catalog";
import { cn } from "@/lib/utils";

type ProductDetailProps = {
  locale: string;
  slug: string;
};

function SpecGroup({ label, values }: { label: string; values: string[] }) {
  if (!values.length) return null;
  return (
    <div>
      <h3 className="text-[0.7rem] font-bold tracking-[0.12em] text-text-faint uppercase">
        {label}
      </h3>
      <ul className="mt-2.5 flex flex-wrap gap-2">
        {values.map((v) => (
          <li
            key={v}
            className="border-line bg-bg-alt rounded-full border px-3 py-1 text-sm font-medium text-ink"
          >
            {v}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DimRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="border-line flex items-baseline justify-between gap-4 border-b py-2.5 last:border-b-0">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="font-display text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}

export async function ProductDetail({ locale, slug }: ProductDetailProps) {
  const product = await getCachedPublishedProductBySlug(slug);
  if (!product) notFound();

  const upcoming = Boolean(product.isUpcoming);
  const image = productImageUrl(product);
  const enquireHref = `#enquire`;
  const contactHref = `contact?product=${encodeURIComponent(product.name.en)}`;

  const categories = await listCategoriesFlat();
  const productCategories = categories.filter((c) =>
    product.categoryIds.includes(c.id),
  );
  const primaryCategory = productCategories[0];
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
  const related = relatedPool
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const hasSpecs =
    product.alloyGrades.length > 0 ||
    product.tempers.length > 0 ||
    product.surfaceFinishes.length > 0 ||
    product.anodizingColors.length > 0 ||
    product.ralColors.length > 0 ||
    product.toleranceStandards.length > 0 ||
    product.packaging.length > 0;

  const hasDims =
    product.maxLengthMm != null ||
    product.minLengthMm != null ||
    product.maxWidthMm != null ||
    product.weightPerMeterKg != null;

  const crumbs = [
    { label: "Catalogue", href: "products" },
    ...(primaryCategory
      ? [
          {
            label: primaryCategory.name.en,
            href: categoryHref ?? undefined,
          },
        ]
      : []),
    { label: product.name.en },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(125deg,var(--brand-blue-darker)_0%,var(--ink)_48%,var(--brand-red-dark)_120%)] text-white">
        <Container className="relative py-[clamp(2.25rem,5vw,3.75rem)]">
          <CatalogueBreadcrumbs
            locale={locale}
            items={crumbs}
            tone="dark"
            className="mb-5"
          />
          <p className="text-[0.72rem] font-bold tracking-[0.14em] text-brand-red uppercase">
            {upcoming ? "Coming soon" : "Catalogue"}
          </p>
          <h1 className="font-display mt-2.5 max-w-[20ch] text-[clamp(1.85rem,1.3rem+2.2vw,3.25rem)] font-semibold leading-[1.08] text-balance">
            {product.name.en}
          </h1>
          {product.description ? (
            <p className="text-on-dark-muted mt-3.5 max-w-[42rem] text-[clamp(0.95rem,0.9rem+0.25vw,1.1rem)] leading-relaxed">
              {product.description}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={enquireHref}
              className={cn(buttonVariants({ variant: "default" }), "min-h-11")}
            >
              {upcoming ? "Register interest" : "Inquire"}
            </Link>
            <Link
              href={localePath(locale, "products")}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "min-h-11 border-white/35 bg-transparent text-white hover:bg-white/10",
              )}
            >
              All products
            </Link>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-8 min-[900px]:grid-cols-[1.05fr_0.95fr] min-[900px]:gap-10 min-[1100px]:gap-14">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-lg)] bg-bg-alt shadow-[var(--shadow-md)] min-[900px]:aspect-auto min-[900px]:min-h-[26rem]">
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
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-mono text-sm tracking-wide text-muted-foreground">
                  {product.sku}
                </p>
                {primaryCategory ? (
                  <>
                    <span className="text-line" aria-hidden>
                      ·
                    </span>
                    {categoryHref ? (
                      <Link
                        href={localePath(locale, categoryHref)}
                        className="text-brand-blue text-sm font-semibold hover:underline"
                      >
                        {primaryCategory.name.en}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-ink">
                        {primaryCategory.name.en}
                      </span>
                    )}
                  </>
                ) : null}
              </div>

              {!upcoming && hasSpecs ? (
                <div className="mt-6 grid gap-5">
                  <SpecGroup label="Alloy grades" values={product.alloyGrades} />
                  <SpecGroup label="Tempers" values={product.tempers} />
                  <SpecGroup
                    label="Surface finishes"
                    values={product.surfaceFinishes}
                  />
                  <SpecGroup
                    label="Anodizing colors"
                    values={product.anodizingColors}
                  />
                  <SpecGroup label="RAL colors" values={product.ralColors} />
                  <SpecGroup
                    label="Tolerance standards"
                    values={product.toleranceStandards}
                  />
                  <SpecGroup label="Packaging" values={product.packaging} />
                </div>
              ) : null}

              {!upcoming && hasDims ? (
                <dl className="border-line mt-6 rounded-[var(--radius-md)] border px-4 py-1">
                  <DimRow
                    label="Min length"
                    value={formatDimensionMm(product.minLengthMm)}
                  />
                  <DimRow
                    label="Max length"
                    value={formatDimensionMm(product.maxLengthMm)}
                  />
                  <DimRow
                    label="Max width / CCD"
                    value={formatDimensionMm(product.maxWidthMm)}
                  />
                  <DimRow
                    label="Weight"
                    value={formatWeightKg(product.weightPerMeterKg)}
                  />
                </dl>
              ) : null}

              {upcoming ? (
                <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
                  Spec sheets publish at commercial release. Share your target
                  alloy, packing and monthly volume so we can prioritise die /
                  casting development.
                </p>
              ) : null}

              {!upcoming && !hasSpecs && !hasDims ? (
                <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
                  Detailed alloy and dimensional specs are being published.
                  Enquire with your programme requirements and we will confirm
                  feasibility.
                </p>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={enquireHref}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "min-h-11",
                  )}
                >
                  {upcoming ? "Register interest" : "Enquire on this line"}
                </Link>
                <Link
                  href={localePath(locale, contactHref)}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "min-h-11",
                  )}
                >
                  Full contact form
                </Link>
              </div>

              <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
                Mill certificates travel with every released consignment.
                Programme tonnage and die feasibility confirmed on enquiry.
              </p>
            </div>
          </div>

          <div
            id="enquire"
            className="border-line bg-surface mt-14 scroll-mt-24 rounded-[var(--radius-lg)] border p-5 shadow-[var(--shadow-sm)] min-[640px]:p-8"
          >
            <h2 className="font-display text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] font-semibold text-ink">
              {upcoming ? "Register interest" : "Enquire about this product"}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-[48ch] text-sm leading-relaxed">
              Tell us alloy, temper, quantity and destination — sales responds
              with lead time and packing options.
            </p>
            <EnquiryForm
              locale={locale}
              defaultProduct={`${product.name.en} (${product.sku})`}
              className="mt-6"
            />
          </div>

          {related.length ? (
            <div className="mt-16">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-display text-xl font-semibold text-ink">
                  Related lines
                </h2>
                <Link
                  href={localePath(
                    locale,
                    categoryHref ?? (upcoming ? "products#upcoming" : "products"),
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
        title="Need a related alloy or custom die?"
        ctaHref={contactHref}
      />
    </>
  );
}
