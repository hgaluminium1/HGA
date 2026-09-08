import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { buttonVariants } from "@/components/ui/button";
import { CatalogueBreadcrumbs } from "@/features/public-catalog/components/catalogue-breadcrumbs";
import { CategoryCard } from "@/features/public-catalog/components/category-card";
import { LoadMoreProducts } from "@/features/public-catalog/components/load-more-products";
import { categoryLandingHref } from "@/features/public-catalog/lib/product-media";
import { CmsEmptyState } from "@/features/public-site/components/cms-empty-state";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import { UpcomingProductsStrip } from "@/features/public-site/components/upcoming-products";
import { getCachedPublishedProducts } from "@/features/public-site/lib/public-cache";
import { localePath } from "@/config/nav.config";
import { listCategoriesFlat } from "@/modules/catalog";
import { cn } from "@/lib/utils";

type ProductsIndexProps = {
  locale: string;
};

export async function ProductsIndex({ locale }: ProductsIndexProps) {
  const pageSize = 24;
  const [{ items, nextCursor }, cats] = await Promise.all([
    getCachedPublishedProducts({
      limit: pageSize,
      upcoming: false,
    }),
    listCategoriesFlat(),
  ]);

  const publishedCats = cats
    .filter((c) => c.status === "published" && !c.parentId)
    .sort((a, b) => a.order - b.order);

  if (publishedCats.length === 0 && items.length === 0) {
    return (
      <>
        <CatalogueIndexHero locale={locale} />
        <CmsEmptyState locale={locale} title="No products published yet." />
      </>
    );
  }

  return (
    <>
      <CatalogueIndexHero locale={locale} />

      {publishedCats.length > 0 ? (
        <Section>
          <Container>
            <div className="mb-8">
              <p className="text-[0.7rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
                Shop by category
              </p>
              <h2 className="font-display mt-1.5 text-[clamp(1.35rem,1.15rem+0.8vw,1.75rem)] font-semibold text-ink">
                Browse categories
              </h2>
            </div>
            <ul className="mx-auto grid max-w-[90rem] gap-4 min-[640px]:grid-cols-2 min-[640px]:gap-5 min-[1024px]:grid-cols-3 min-[1440px]:grid-cols-4">
              {publishedCats.map((cat) => (
                <li key={cat.id}>
                  <CategoryCard
                    locale={locale}
                    href={
                      categoryLandingHref(cat.slug) ??
                      `products/category/${cat.slug}`
                    }
                    title={cat.name.en}
                    description={cat.description?.en}
                    imageSrc={cat.imageUrl}
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {items.length > 0 ? (
        <Section alt>
          <Container>
            <div className="mb-8">
              <p className="text-[0.7rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
                Present lines
              </p>
              <h2 className="font-display mt-1.5 text-[clamp(1.35rem,1.15rem+0.8vw,1.75rem)] font-semibold text-ink">
                Ready for enquiry
              </h2>
            </div>
            <LoadMoreProducts
              locale={locale}
              initialItems={items}
              initialCursor={nextCursor}
              pageSize={pageSize}
            />
          </Container>
        </Section>
      ) : null}

      <div id="upcoming" className="scroll-mt-24">
        <UpcomingProductsStrip locale={locale} />
      </div>
      <InquireBand locale={locale} />
    </>
  );
}

function CatalogueIndexHero({ locale }: { locale: string }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(125deg,var(--brand-blue-darker)_0%,var(--ink)_50%,var(--brand-blue-dark)_100%)] text-white">
      <Container className="relative py-[clamp(2.5rem,6vw,4.25rem)]">
        <CatalogueBreadcrumbs
          locale={locale}
          items={[{ label: "Home", href: "" }, { label: "Catalogue" }]}
          tone="dark"
          className="mb-5"
        />
        <p className="text-[0.72rem] font-bold tracking-[0.14em] text-brand-red uppercase">
          Products
        </p>
        <h1 className="font-display mt-2.5 max-w-[16ch] text-[clamp(1.85rem,1.3rem+2.2vw,3.25rem)] font-semibold leading-[1.08]">
          Product catalogue
        </h1>
        <p className="text-on-dark-muted mt-3.5 max-w-[40rem] text-[clamp(0.95rem,0.9rem+0.25vw,1.1rem)] leading-relaxed">
          Extrusion profiles, homogenised billets and remelt ingots from Kadi —
          browse by category, then enquire with alloy and tonnage.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={localePath(locale, "contact")}
            className={cn(buttonVariants({ variant: "default" }), "min-h-11")}
          >
            Inquire
          </Link>
          <Link
            href="#upcoming"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "min-h-11 border-white/35 bg-transparent text-white hover:bg-white/10",
            )}
          >
            Upcoming lines
          </Link>
        </div>
      </Container>
    </section>
  );
}
