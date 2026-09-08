import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { CatalogueByCategory } from "@/features/public-catalog/components/catalogue-by-category";
import type { CategoryWithProducts } from "@/features/public-catalog/lib/catalogue-groups";
import { PublicEmptyState } from "@/features/public-site/components/cms-empty-state";
import { localePath } from "@/config/nav.config";
import type { HomeContent } from "@/features/public-home/content/home.en";

type ProductsSectionProps = {
  locale: string;
  content: HomeContent["products"];
  groups?: CategoryWithProducts[];
};

/**
 * Home products — Category → N products (same mental model as /products).
 */
export function ProductsSection({
  locale,
  content,
  groups = [],
}: ProductsSectionProps) {
  if (!groups.length) {
    return (
      <Section data-block="products" id="products">
        <Container>
          <Reveal>
            <div className="mb-6 max-w-xl">
              {content.eyebrow ? <Eyebrow>{content.eyebrow}</Eyebrow> : null}
              <h2 className="text-fs-h2 mt-2.5 text-balance">{content.title}</h2>
            </div>
          </Reveal>
          <PublicEmptyState
            locale={locale}
            density="section"
            title="No categories published yet."
            description="Publish categories in Admin, then add products under each one."
            primary={{ label: "Browse products", href: "products" }}
          />
        </Container>
      </Section>
    );
  }

  return (
    <div data-block="products" id="products">
      <Section>
        <Container>
          <Reveal>
            <div className="flex flex-col gap-4 min-[720px]:flex-row min-[720px]:items-end min-[720px]:justify-between">
              <div className="max-w-xl">
                {content.eyebrow ? <Eyebrow>{content.eyebrow}</Eyebrow> : null}
                <h2 className="text-fs-h2 mt-2.5 text-balance">{content.title}</h2>
                {content.description ? (
                  <p className="text-fs-lead text-muted-foreground mt-3.5">
                    {content.description}
                  </p>
                ) : null}
              </div>
              <Link
                href={localePath(locale, "products")}
                className="text-brand-blue inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold tracking-tight hover:text-brand-blue-dark"
              >
                View full catalogue
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
      <CatalogueByCategory
        locale={locale}
        groups={groups}
        productsPerCategory={3}
        density="home"
      />
    </div>
  );
}
