import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import { ProductCard } from "@/features/public-catalog/components/product-card";
import {
  categoryImageUrl,
  productImageUrl,
} from "@/features/public-catalog/lib/product-media";
import { buttonVariants } from "@/components/ui/button";
import { localePath } from "@/config/nav.config";
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
};

export async function UpcomingProductsStrip({
  locale,
  eyebrow = "Pipeline",
  title = "Upcoming products",
  description = "Coming soon from HG — register interest for early allocation.",
}: UpcomingProductsStripProps) {
  const { items } = await getCachedUpcomingProducts({ limit: 12 });
  if (!items.length) return null;

  return (
    <Section data-block="upcoming-products" alt>
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        </Reveal>
        <Reveal stagger>
          <ul className="grid gap-4 min-[640px]:grid-cols-2 min-[640px]:gap-5 min-[1024px]:grid-cols-3">
            {items.map((product) => (
              <li key={product.id}>
                <ProductCard locale={locale} product={product} />
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
  const { items: all } = await getCachedPublishedProducts({
    limit: 100,
    upcoming: false,
  });
  const items = ids.length
    ? all
        .filter((p) => p.categoryIds.some((id) => ids.includes(id)))
        .slice(0, limit)
    : all.slice(0, limit);
  if (!items.length) return null;

  return (
    <ul className="grid gap-4 min-[640px]:grid-cols-2 min-[640px]:gap-5 min-[1024px]:grid-cols-3">
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
      className="border-line bg-surface group relative block overflow-hidden rounded-[var(--radius-lg)] border"
    >
      <span className="relative block aspect-[16/10] overflow-hidden bg-bg-alt">
        <Image
          src={categoryImageUrl(href)}
          alt={label}
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      <span className="block p-4">
        <span className="font-display text-lg font-semibold text-ink">
          {label}
        </span>
        {description ? (
          <span className="text-muted-foreground mt-1 block text-sm">
            {description}
          </span>
        ) : null}
        <span
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "mt-3 inline-flex",
          )}
        >
          Browse
        </span>
      </span>
    </Link>
  );
}

export { productImageUrl };
