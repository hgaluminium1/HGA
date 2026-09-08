import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import {
  PRODUCT_BAND_ITEM_CLASS,
  PRODUCT_BAND_LIST_CLASS,
  PRODUCT_GRID_CLASS,
  ProductCard,
} from "@/features/public-catalog/components/product-card";
import { CategoryCard } from "@/features/public-catalog/components/category-card";
import {
  categoryPublicHref,
  type CategoryWithProducts,
} from "@/features/public-catalog/lib/catalogue-groups";
import { PublicEmptyState } from "@/features/public-site/components/cms-empty-state";
import { localePath } from "@/config/nav.config";
import { cn } from "@/lib/utils";

type CatalogueByCategoryProps = {
  locale: string;
  groups: CategoryWithProducts[];
  /** Max products shown under each category before “View all”. */
  productsPerCategory?: number;
  /** home = snap band; catalogue = denser grid */
  density?: "home" | "catalogue";
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * FAANG catalogue spine: Category → N products.
 * One section per category; empty categories still show with empty state.
 */
export function CatalogueByCategory({
  locale,
  groups,
  productsPerCategory = 8,
  density = "catalogue",
  emptyTitle = "No categories published yet.",
  emptyDescription = "Create categories in Admin, then add products under each one.",
}: CatalogueByCategoryProps) {
  if (!groups.length) {
    return (
      <Section>
        <Container>
          <PublicEmptyState
            locale={locale}
            density="section"
            title={emptyTitle}
            description={emptyDescription}
            primary={{ label: "Contact / RFQ", href: "contact" }}
          />
        </Container>
      </Section>
    );
  }

  return (
    <>
      {groups.map(({ category, products }, index) => {
        const href = categoryPublicHref(category.slug);
        const shown = products.slice(0, productsPerCategory);
        const hasMore = products.length > shown.length;
        const alt = density === "catalogue" ? index % 2 === 1 : false;

        return (
          <Section key={category.id} alt={alt}>
            <Container>
              <Reveal>
                <div className="mb-[clamp(1.25rem,2.5vw,2rem)] flex flex-col gap-3 min-[720px]:flex-row min-[720px]:items-end min-[720px]:justify-between">
                  <div className="max-w-xl">
                    <p className="text-[0.7rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
                      Category
                    </p>
                    <h2 className="font-display mt-1.5 text-[clamp(1.35rem,1.15rem+0.8vw,1.75rem)] font-semibold text-ink text-balance">
                      {category.name.en}
                    </h2>
                    {category.description?.en ? (
                      <p className="text-muted-foreground mt-2 max-w-[42ch] text-[0.9375rem] leading-relaxed">
                        {category.description.en}
                      </p>
                    ) : null}
                  </div>
                  <Link
                    href={localePath(locale, href)}
                    className="text-brand-blue inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold hover:text-brand-blue-dark"
                  >
                    View category
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </Reveal>

              {shown.length ? (
                <Reveal stagger>
                  <ul
                    className={cn(
                      density === "home"
                        ? PRODUCT_BAND_LIST_CLASS
                        : cn("mx-auto max-w-[90rem]", PRODUCT_GRID_CLASS),
                    )}
                  >
                    {shown.map((product) => (
                      <li
                        key={product.id}
                        className={
                          density === "home" ? PRODUCT_BAND_ITEM_CLASS : undefined
                        }
                      >
                        <ProductCard locale={locale} product={product} />
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : (
                <PublicEmptyState
                  locale={locale}
                  density="section"
                  title={`No products in ${category.name.en} yet.`}
                  description="Add and publish products under this category in Admin → Products."
                  primary={{ label: "Contact / RFQ", href: "contact" }}
                />
              )}

              {hasMore ? (
                <p className="mt-6 text-sm">
                  <Link
                    href={localePath(locale, href)}
                    className="text-brand-blue font-semibold hover:underline"
                  >
                    See all {products.length} products →
                  </Link>
                </p>
              ) : null}
            </Container>
          </Section>
        );
      })}
    </>
  );
}

/** Compact category-only grid (home teaser when you want cards, not product strips). */
export function CategoryBrowseGrid({
  locale,
  groups,
}: {
  locale: string;
  groups: CategoryWithProducts[];
}) {
  if (!groups.length) return null;
  return (
    <ul className={cn("mx-auto max-w-[90rem]", PRODUCT_GRID_CLASS)}>
      {groups.map(({ category, products }) => (
        <li key={category.id}>
          <CategoryCard
            locale={locale}
            href={categoryPublicHref(category.slug)}
            title={category.name.en}
            description={
              category.description?.en ||
              (products.length
                ? `${products.length} product${products.length === 1 ? "" : "s"}`
                : "Browse this category")
            }
            imageSrc={category.imageUrl}
          />
        </li>
      ))}
    </ul>
  );
}
