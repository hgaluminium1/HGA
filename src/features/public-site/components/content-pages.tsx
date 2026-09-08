import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { buttonVariants } from "@/components/ui/button";
import { CustomerLogoStripBlock } from "@/features/public-corporate";
import { CatalogueBreadcrumbs } from "@/features/public-catalog/components/catalogue-breadcrumbs";
import { categoryImageUrl } from "@/features/public-catalog/lib/product-media";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import {
  loadIndustrySegments,
  MarketsSection,
} from "@/features/public-site/components/markets-section";
import { PageHero } from "@/features/public-site/components/page-hero";
import { PublicEmptyState } from "@/features/public-site/components/cms-empty-state";
import {
  PresentProductsGrid,
  UpcomingProductsStrip,
} from "@/features/public-site/components/upcoming-products";
import { localePath } from "@/config/nav.config";
import { listCategoriesFlat } from "@/modules/catalog";
import { cn } from "@/lib/utils";

export {
  AboutPage,
  JourneyPage,
  ManufacturingPage,
  QualityPage,
  SustainabilityPage,
  ProcurementPage,
  ResourcesPage,
  ContactPage,
} from "@/features/public-corporate/pages";

export { CareersPage } from "@/features/public-site/components/careers-page";

export async function IndustriesPage({ locale }: { locale: string }) {
  const segments = loadIndustrySegments();
  return (
    <>
      <PageHero
        locale={locale}
        title="Industries & applications"
        description="Markets where HG extrusion, billets and remelt alloys are specified — sector focus, not prospective brand claims."
        secondaryLabel="Products"
        secondaryHref="products"
      />
      <Section>
        <Container>
          <ul className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {segments.map((s) => {
              const productHref =
                s.productFocus[0] === "aluminium-extrusion-profiles"
                  ? "products/category/extrusion-profiles"
                  : s.productFocus[0] === "aluminium-ingots"
                    ? "products/category/ingots-alloys"
                    : "products";
              return (
                <li
                  key={s.key}
                  className="grid gap-3 py-[clamp(1.15rem,2.5vw,1.6rem)] min-[720px]:grid-cols-[1fr_auto] min-[720px]:items-start"
                >
                  <div>
                    <h2 className="font-display text-[1.15rem] font-semibold text-ink">
                      {s.label}
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed">
                      {s.description}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                      {s.applications.slice(0, 4).map((a) => (
                        <li
                          key={a}
                          className="text-text-faint text-[0.75rem] leading-snug"
                        >
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 min-[720px]:flex-col min-[720px]:items-end">
                    <Link
                      href={localePath(locale, productHref)}
                      className="text-brand-blue text-sm font-semibold hover:underline"
                    >
                      Related products →
                    </Link>
                    <Link
                      href={localePath(
                        locale,
                        `contact?product=${encodeURIComponent(s.label)}`,
                      )}
                      className="text-muted-foreground text-sm font-semibold hover:text-ink hover:underline"
                    >
                      Enquire
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>
      <InquireBand
        locale={locale}
        title="Specifying for a sector programme?"
        ctaLabel="Send RFQ"
      />
    </>
  );
}

export async function CategoryLandingPage({
  locale,
  slug,
  title,
  description,
  categorySlugs,
}: {
  locale: string;
  slug: string;
  title: string;
  description: string;
  categorySlugs: string[];
}) {
  const cats = await listCategoriesFlat();
  const matched = cats.filter(
    (c) =>
      categorySlugs.includes(c.slug) &&
      (c.status === "published" || c.status === "draft"),
  );
  const publishedMatched = matched.filter((c) => c.status === "published");
  const primary = publishedMatched[0] ?? matched[0];
  const matchIds = (publishedMatched.length ? publishedMatched : matched).map(
    (c) => c.id,
  );
  const displayTitle = primary?.name.en || title;
  const displayDescription =
    primary?.description?.en?.trim() || description;
  const heroImage =
    primary?.imageUrl?.trim() ||
    categoryImageUrl(
      slug.startsWith("products/") ? slug : `products/${slug}`,
      primary,
    );

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(125deg,var(--brand-blue-darker)_0%,var(--ink)_50%,var(--brand-blue-dark)_100%)] text-white">
        <Container className="relative grid gap-8 py-[clamp(2.5rem,6vw,4.25rem)] min-[900px]:grid-cols-[1.15fr_0.85fr] min-[900px]:items-end">
          <div>
            <CatalogueBreadcrumbs
              locale={locale}
              items={[
                { label: "Catalogue", href: "products" },
                { label: displayTitle },
              ]}
              tone="dark"
              className="mb-5"
            />
            <p className="text-[0.72rem] font-bold tracking-[0.14em] text-brand-red uppercase">
              Category
            </p>
            <h1 className="font-display mt-2.5 max-w-[16ch] text-[clamp(1.85rem,1.3rem+2.2vw,3.25rem)] font-semibold leading-[1.08]">
              {displayTitle}
            </h1>
            <p className="text-on-dark-muted mt-3.5 max-w-[40rem] text-[clamp(0.95rem,0.9rem+0.25vw,1.1rem)] leading-relaxed">
              {displayDescription}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={localePath(locale, "contact")}
                className={cn(buttonVariants({ variant: "default" }), "min-h-11")}
              >
                Inquire
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
          </div>
          <div className="relative hidden aspect-[16/11] overflow-hidden rounded-[var(--radius-lg)] min-[900px]:block">
            <Image
              src={heroImage}
              alt={displayTitle}
              fill
              sizes="28rem"
              className="object-cover"
              priority
            />
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="mb-8">
            <p className="text-[0.7rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
              Present lines
            </p>
            <h2 className="font-display mt-1.5 text-xl font-semibold text-ink">
              Published in this category
            </h2>
          </div>
          {matchIds.length ? (
            <PresentProductsGrid
              locale={locale}
              categoryIds={matchIds}
              limit={24}
            />
          ) : (
            <PublicEmptyState
              locale={locale}
              density="section"
              title="No products in this category yet."
              description="Catalogue lines for this category appear once published. Edit categories in Admin."
              primary={{ label: "Contact / RFQ", href: "contact" }}
              secondary={{
                label: "All products",
                href: "products",
                variant: "outline",
              }}
            />
          )}
          <p className="mt-8 text-sm">
            <Link
              href={localePath(locale, "products")}
              className="text-brand-blue font-semibold hover:underline"
            >
              Browse full catalogue →
            </Link>
          </p>
        </Container>
      </Section>
      {slug.includes("ingot") ? (
        <UpcomingProductsStrip
          locale={locale}
          title="Related upcoming lines"
          description="Cubes, shots and deoxidizer — coming soon."
        />
      ) : null}
      <InquireBand locale={locale} />
    </>
  );
}

export { MarketsSection, CustomerLogoStripBlock, UpcomingProductsStrip };
