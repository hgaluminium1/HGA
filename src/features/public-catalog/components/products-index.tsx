import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { buttonVariants } from "@/components/ui/button";
import { CatalogueBreadcrumbs } from "@/features/public-catalog/components/catalogue-breadcrumbs";
import { ProductCard } from "@/features/public-catalog/components/product-card";
import { catalogueCategoryNav } from "@/features/public-catalog/lib/product-media";
import { CmsEmptyState } from "@/features/public-site/components/cms-empty-state";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import { UpcomingProductsStrip } from "@/features/public-site/components/upcoming-products";
import { getCachedPublishedProducts } from "@/features/public-site/lib/public-cache";
import { localePath } from "@/config/nav.config";
import { listCategoriesFlat } from "@/modules/catalog";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ProductsIndexProps = {
  locale: string;
};

export async function ProductsIndex({ locale }: ProductsIndexProps) {
  const [{ items }, cats] = await Promise.all([
    getCachedPublishedProducts({
      limit: 48,
      upcoming: false,
    }),
    listCategoriesFlat(),
  ]);
  const categories = catalogueCategoryNav(
    cats.filter((c) => c.status === "published"),
  );

  if (items.length === 0) {
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

      <Section>
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[0.7rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
                Shop by category
              </p>
              <h2 className="font-display mt-1.5 text-[clamp(1.35rem,1.15rem+0.8vw,1.75rem)] font-semibold text-ink">
                Browse the catalogue spine
              </h2>
            </div>
            <Link
              href={localePath(locale, "products#upcoming")}
              className="text-brand-blue text-sm font-semibold hover:underline"
            >
              Jump to upcoming →
            </Link>
          </div>

          <ul className="grid gap-4 min-[640px]:grid-cols-3 min-[640px]:gap-5">
            {categories.map((cat) => (
              <li key={cat.href}>
                <Link
                  href={localePath(locale, cat.href)}
                  className="border-line bg-surface group relative block overflow-hidden rounded-[var(--radius-lg)] border transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
                >
                  <span className="relative block aspect-[16/10] overflow-hidden bg-bg-alt">
                    <Image
                      src={cat.imageSrc}
                      alt={cat.label}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span
                      className="absolute inset-0 bg-[linear-gradient(0deg,rgb(0_18_47_/_0.72)_0%,rgb(0_18_47_/_0.1)_55%)]"
                      aria-hidden
                    />
                    <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <span className="font-display block text-lg font-semibold">
                        {cat.label}
                      </span>
                      {cat.description ? (
                        <span className="mt-1 block text-sm text-white/80">
                          {cat.description}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section alt>
        <Container>
          <div className="mb-8">
            <p className="text-[0.7rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
              Present lines
            </p>
            <h2 className="font-display mt-1.5 text-[clamp(1.35rem,1.15rem+0.8vw,1.75rem)] font-semibold text-ink">
              Ready for enquiry
            </h2>
            <p className="text-muted-foreground mt-2 max-w-[48ch] text-sm leading-relaxed">
              Published present catalogue — specs, packaging and certificates
              confirmed on enquiry.
            </p>
          </div>
          <ul className="grid gap-4 min-[640px]:grid-cols-2 min-[640px]:gap-5 min-[1024px]:grid-cols-3">
            {items.map((product) => (
              <li key={product.id}>
                <ProductCard locale={locale} product={product} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

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
