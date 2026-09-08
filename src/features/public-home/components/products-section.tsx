import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { Eyebrow } from "@/components/atoms/eyebrow";
import {
  PRODUCT_BAND_ITEM_CLASS,
  PRODUCT_BAND_LIST_CLASS,
  ProductBandTile,
  ProductCard,
} from "@/features/public-catalog/components/product-card";
import { localePath } from "@/config/nav.config";
import type { HomeContent } from "@/features/public-home/content/home.en";
import type { ProductDTO } from "@/modules/catalog";

type ProductsSectionProps = {
  locale: string;
  content: HomeContent["products"];
  /** Live catalogue rows — preferred over static CMS items. */
  products?: ProductDTO[];
};

/**
 * Home products band.
 * Mobile: horizontal snap strip (Apple Store pattern).
 * ≥640px: responsive grid up to 3 columns.
 */
export function ProductsSection({
  locale,
  content,
  products = [],
}: ProductsSectionProps) {
  const fromCatalog = products.length > 0;
  const fallbackItems = content.items ?? [];
  const hasCards = fromCatalog || fallbackItems.length > 0;

  return (
    <Section data-block="products" id="products">
      <Container>
        <Reveal>
          <div className="mb-[clamp(1.75rem,3.5vw,2.75rem)] flex flex-col gap-4 min-[720px]:flex-row min-[720px]:items-end min-[720px]:justify-between">
            <div className="max-w-xl">
              {content.eyebrow ? <Eyebrow>{content.eyebrow}</Eyebrow> : null}
              <h2 className="text-fs-h2 mt-2.5 text-balance">{content.title}</h2>
              {content.description || !hasCards ? (
                <p className="text-fs-lead text-muted-foreground mt-3.5">
                  {content.description ||
                    "Catalogue products will appear here once published in admin."}
                </p>
              ) : null}
            </div>
            {hasCards ? (
              <Link
                href={localePath(locale, "products")}
                className="text-brand-blue inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold tracking-tight transition-colors hover:text-brand-blue-dark"
              >
                View full catalogue
                <ArrowRight className="size-4" />
              </Link>
            ) : null}
          </div>
        </Reveal>

        {hasCards ? (
          <Reveal stagger>
            <ul className={PRODUCT_BAND_LIST_CLASS}>
              {fromCatalog
                ? products.map((product) => (
                    <li key={product.id} className={PRODUCT_BAND_ITEM_CLASS}>
                      <ProductCard locale={locale} product={product} />
                    </li>
                  ))
                : fallbackItems.map((item) => (
                    <li key={item.title} className={PRODUCT_BAND_ITEM_CLASS}>
                      <ProductBandTile
                        locale={locale}
                        title={item.title}
                        href={item.href}
                        imageSrc={item.imageSrc}
                        imageAlt={item.imageAlt}
                      />
                    </li>
                  ))}
            </ul>
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}
