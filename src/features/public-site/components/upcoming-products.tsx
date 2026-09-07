import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
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
                <Link
                  href={localePath(locale, `products/${product.slug}`)}
                  className="border-line bg-surface group relative block overflow-hidden rounded-[var(--radius-lg)] border transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
                >
                  <span className="relative block aspect-[16/10] overflow-hidden bg-bg-alt">
                    <Image
                      src={
                        product.imageUrl ||
                        `https://picsum.photos/seed/hg-${product.slug}/700/420`
                      }
                      alt={product.name.en}
                      fill
                      sizes="(min-width: 1024px) 25rem, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-ink/90 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-brand-red uppercase">
                      Coming soon
                    </span>
                  </span>
                  <span className="block p-4 min-[480px]:p-5">
                    <span className="font-display text-[clamp(1.05rem,0.98rem+0.3vw,1.2rem)] font-semibold text-ink">
                      {product.name.en}
                    </span>
                    <span className="text-muted-foreground mt-1.5 block text-sm leading-relaxed">
                      {product.description
                        ? `${product.description.slice(0, 110)}${product.description.length > 110 ? "…" : ""}`
                        : product.sku}
                    </span>
                    <span
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "mt-4 inline-flex",
                      )}
                    >
                      Register interest
                    </span>
                  </span>
                </Link>
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
          <Link
            href={localePath(locale, `products/${product.slug}`)}
            className="border-line bg-surface hover:border-brand-blue block rounded-[var(--radius-lg)] border p-5 transition-colors"
          >
            <p className="font-display text-lg font-semibold text-ink">
              {product.name.en}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">{product.sku}</p>
            {product.description ? (
              <p className="text-muted-foreground mt-3 line-clamp-3 text-sm">
                {product.description}
              </p>
            ) : null}
            <span
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-4 inline-flex",
              )}
            >
              View details
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
