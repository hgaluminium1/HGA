import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { buttonVariants } from "@/components/ui/button";
import { CmsEmptyState } from "@/features/public-site/components/cms-empty-state";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import { PageHero } from "@/features/public-site/components/page-hero";
import {
  PresentProductsGrid,
  UpcomingProductsStrip,
} from "@/features/public-site/components/upcoming-products";
import { getCachedPublishedProducts } from "@/features/public-site/lib/public-cache";
import { localePath } from "@/config/nav.config";
import { cn } from "@/lib/utils";

type ProductsIndexProps = {
  locale: string;
};

export async function ProductsIndex({ locale }: ProductsIndexProps) {
  const { items } = await getCachedPublishedProducts({
    limit: 48,
    upcoming: false,
  });

  if (items.length === 0) {
    return (
      <>
        <PageHero
          locale={locale}
          title="Products"
          description="Published catalogue lines from HG Aluminium."
        />
        <CmsEmptyState locale={locale} title="No products published yet." />
      </>
    );
  }

  return (
    <>
      <PageHero
        locale={locale}
        title="Product catalogue"
        description="Present lines available for enquiry — extrusion profiles, homogenised billets and remelt ingots."
        secondaryLabel="Upcoming"
        secondaryHref="products#upcoming"
      />
      <Section>
        <Container>
          <PresentProductsGrid locale={locale} limit={48} />
        </Container>
      </Section>
      <div id="upcoming">
        <UpcomingProductsStrip locale={locale} />
      </div>
      <InquireBand locale={locale} />
    </>
  );
}

export function ProductCardLink({
  locale,
  href,
  title,
  sku,
  description,
}: {
  locale: string;
  href: string;
  title: string;
  sku?: string;
  description?: string;
}) {
  return (
    <Link
      href={localePath(locale, href)}
      className="border-line bg-surface hover:border-brand-accent block rounded-[var(--radius-lg)] border p-5 transition-colors"
    >
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {sku ? (
        <p className="text-muted-foreground mt-1 text-sm">{sku}</p>
      ) : null}
      {description ? (
        <p className="text-muted-foreground mt-3 line-clamp-3 text-sm">
          {description}
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
  );
}
