import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { CatalogueBreadcrumbs } from "@/features/public-catalog/components/catalogue-breadcrumbs";
import { LoadMoreProducts } from "@/features/public-catalog/components/load-more-products";
import { categoryImageUrl } from "@/features/public-catalog/lib/product-media";
import { PublicEmptyState } from "@/features/public-site/components/cms-empty-state";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import { getCachedPublishedProducts } from "@/features/public-site/lib/public-cache";
import { getPublishedCategoryBySlug } from "@/modules/catalog";
import Image from "next/image";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getPublishedCategoryBySlug(slug);
  if (!category) return { title: "Category" };
  return {
    title: category.name.en,
    description: category.description?.en || undefined,
  };
}

export default async function CategoryProductsPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const category = await getPublishedCategoryBySlug(slug);
  if (!category) notFound();

  const pageSize = 24;
  const { items, nextCursor } = await getCachedPublishedProducts({
    categoryId: category.id,
    limit: pageSize,
    upcoming: false,
  });

  const heroImage = categoryImageUrl(slug, category);

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(125deg,var(--brand-blue-darker)_0%,var(--ink)_50%,var(--brand-blue-dark)_100%)] text-white">
        <Container className="relative grid gap-8 py-[clamp(2.5rem,6vw,4.25rem)] min-[900px]:grid-cols-[1.15fr_0.85fr] min-[900px]:items-end">
          <div>
            <CatalogueBreadcrumbs
              locale={locale}
              items={[
                { label: "Products", href: "products" },
                { label: category.name.en },
              ]}
            />
            <h1 className="font-display mt-4 text-[clamp(1.75rem,1.4rem+1.5vw,2.75rem)] font-semibold tracking-tight">
              {category.name.en}
            </h1>
            {category.description?.en ? (
              <p className="mt-3 max-w-xl text-white/80 text-[clamp(0.95rem,0.9rem+0.25vw,1.05rem)] leading-relaxed">
                {category.description.en}
              </p>
            ) : null}
          </div>
          <div className="relative hidden aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] min-[900px]:block">
            <Image
              src={heroImage}
              alt={category.name.en}
              fill
              className="object-cover"
              sizes="40vw"
              priority
            />
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <h2 className="font-display text-xl font-semibold text-ink">
            Products
          </h2>
          {items.length === 0 ? (
            <div className="mt-6">
              <PublicEmptyState
                locale={locale}
                density="section"
                title="No products in this category yet."
                description="Published lines for this category will appear here."
                primary={{ label: "Contact / RFQ", href: "contact" }}
                secondary={{
                  label: "All products",
                  href: "products",
                  variant: "outline",
                }}
              />
            </div>
          ) : (
            <div className="mt-6">
              <LoadMoreProducts
                locale={locale}
                initialItems={items}
                initialCursor={nextCursor}
                categoryId={category.id}
                pageSize={pageSize}
              />
            </div>
          )}
        </Container>
      </Section>

      <InquireBand locale={locale} />
    </>
  );
}
