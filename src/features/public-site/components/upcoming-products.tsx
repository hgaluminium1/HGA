import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/atoms/container";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import {
  PRODUCT_BAND_ITEM_CLASS,
  PRODUCT_BAND_LIST_CLASS,
  PRODUCT_GRID_CLASS,
  ProductCard,
} from "@/features/public-catalog/components/product-card";
import { categoryImageUrl } from "@/features/public-catalog/lib/product-media";
import { localePath } from "@/config/nav.config";
import { PublicEmptyState } from "@/features/public-site/components/cms-empty-state";
import {
  getCachedPublishedProducts,
  getCachedUpcomingProducts,
} from "@/features/public-site/lib/public-cache";
import { cn } from "@/lib/utils";

type UpcomingProductsStripProps = {
  locale: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Hide the catalogue deep-link when already on /products. */
  showCatalogueLink?: boolean;
  /** When true, show a section empty state instead of hiding the band. */
  showEmpty?: boolean;
};

export async function UpcomingProductsStrip({
  locale,
  eyebrow = "Pipeline",
  title = "Upcoming products",
  description = "Coming soon from HG — register interest for early allocation.",
  showCatalogueLink = true,
  showEmpty = false,
}: UpcomingProductsStripProps) {
  const { items } = await getCachedUpcomingProducts({ limit: 12 });
  if (!items.length) {
    if (!showEmpty) return null;
    return (
      <Section data-block="upcoming-products" alt>
        <Container>
          <PublicEmptyState
            locale={locale}
            density="section"
            title="No upcoming products yet."
            description="Pipeline lines appear here once an editor marks products as coming soon."
            primary={{ label: "Browse products", href: "products" }}
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section
      data-block="upcoming-products"
      alt
      className="relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/25 to-transparent"
        aria-hidden
      />
      <Container>
        <Reveal>
          <div className="mb-[clamp(1.75rem,3.5vw,2.75rem)] flex flex-col gap-4 min-[720px]:flex-row min-[720px]:items-end min-[720px]:justify-between">
            <div className="max-w-xl">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2 className="text-fs-h2 mt-2.5 text-balance">{title}</h2>
              {description ? (
                <p className="text-fs-lead text-muted-foreground mt-3.5">
                  {description}
                </p>
              ) : null}
            </div>
            {showCatalogueLink ? (
              <Link
                href={localePath(locale, "products#upcoming")}
                className="text-brand-blue inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold tracking-tight hover:text-brand-blue-dark"
              >
                All upcoming lines
                <ArrowRight className="size-4" />
              </Link>
            ) : null}
          </div>
        </Reveal>

        <Reveal stagger>
          <ul className={PRODUCT_BAND_LIST_CLASS}>
            {items.map((product) => (
              <li key={product.id} className={PRODUCT_BAND_ITEM_CLASS}>
                <ProductCard
                  locale={locale}
                  product={product}
                  tone="pipeline"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}

export async function PresentProductsGrid({
  locale,
  categoryId,
  categoryIds,
  limit = 24,
}: {
  locale: string;
  categoryId?: string;
  categoryIds?: string[];
  limit?: number;
}) {
  const ids = [
    ...(categoryIds ?? []),
    ...(categoryId ? [categoryId] : []),
  ].filter(Boolean);
  const { items } = await getCachedPublishedProducts({
    limit,
    upcoming: false,
    categoryIds: ids.length ? ids : undefined,
  });
  if (!items.length) {
    return (
      <PublicEmptyState
        locale={locale}
        density="section"
        title="No products in this category yet."
        description="Published catalogue lines for this category will appear here."
        primary={{ label: "Contact / RFQ", href: "contact" }}
        secondary={{ label: "All products", href: "products", variant: "outline" }}
      />
    );
  }

  return (
    <ul className={cn("mx-auto max-w-[90rem]", PRODUCT_GRID_CLASS)}>
      {items.map((product) => (
        <li key={product.id}>
          <ProductCard locale={locale} product={product} />
        </li>
      ))}
    </ul>
  );
}

/** Compact category teaser used on landings / home when a single card is needed. */
export function CategoryTeaserCard({
  locale,
  href,
  label,
  description,
}: {
  locale: string;
  href: string;
  label: string;
  description?: string;
}) {
  return (
    <Link
      href={localePath(locale, href)}
      className="group flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 rounded-[var(--radius-lg)]"
    >
      <span className="relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-bg-alt ring-1 ring-black/[0.06] transition-[box-shadow,transform] duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-md)]">
        <Image
          src={categoryImageUrl(href)}
          alt={label}
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </span>
      <span className="pt-3.5">
        <span className="font-display text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] font-semibold text-ink">
          {label}
        </span>
        {description ? (
          <span className="text-muted-foreground mt-1.5 block line-clamp-2 text-[0.8125rem] leading-relaxed">
            {description}
          </span>
        ) : null}
        <span className="text-brand-blue mt-3 inline-flex items-center gap-1 text-[0.8125rem] font-semibold">
          Browse
          <ArrowRight className="size-3.5" />
        </span>
      </span>
    </Link>
  );
}

export { productImageUrl } from "@/features/public-catalog/lib/product-media";
