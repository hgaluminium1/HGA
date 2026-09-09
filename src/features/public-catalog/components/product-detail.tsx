import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { buttonVariants } from "@/components/ui/button";
import { CatalogueBreadcrumbs } from "@/features/public-catalog/components/catalogue-breadcrumbs";
import { ProductCard } from "@/features/public-catalog/components/product-card";
import { categoryLandingHref, productImageUrl } from "@/features/public-catalog/lib/product-media";
import { EnquiryForm } from "@/features/public-site/components/enquiry-form";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import {
  getCachedPublishedProductBySlug,
  getCachedPublishedProducts,
} from "@/features/public-site/lib/public-cache";
import { localePath } from "@/config/nav.config";
import { listCategoriesFlat } from "@/modules/catalog";
import { cn } from "@/lib/utils";

type ProductDetailProps = {
  locale: string;
  slug: string;
};

/**
 * Product detail — Category → Product. Name, photo, description, enquire.
 * Optional legacy specs only render when data exists.
 */
export async function ProductDetail({ locale, slug }: ProductDetailProps) {
  const product = await getCachedPublishedProductBySlug(slug);
  if (!product) notFound();

  const upcoming = Boolean(product.isUpcoming);
  const image = productImageUrl(product);
  const enquireHref = `#enquire`;
  const contactHref = `contact?product=${encodeURIComponent(product.name.en)}`;

  const categories = await listCategoriesFlat();
  const primaryCategory = categories.find((c) =>
    product.categoryIds.includes(c.id),
  );
  const categoryHref = primaryCategory
    ? categoryLandingHref(primaryCategory.slug)
    : null;

  const relatedCategoryId = product.categoryIds[0];
  const { items: relatedPool } = relatedCategoryId
    ? await getCachedPublishedProducts({
        limit: 8,
        upcoming: upcoming ? true : false,
        categoryId: relatedCategoryId,
      })
    : await getCachedPublishedProducts({
        limit: 8,
        upcoming: false,
      });
  const related = relatedPool.filter((p) => p.id !== product.id).slice(0, 3);

  const crumbs = [
    { label: "Catalogue", href: "products" },
    ...(primaryCategory
      ? [{ label: primaryCategory.name.en, href: categoryHref ?? undefined }]
      : []),
    { label: product.name.en },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(125deg,var(--brand-blue-darker)_0%,var(--ink)_48%,var(--brand-red-dark)_120%)] text-white">
        <Container className="relative py-[clamp(2.25rem,5vw,3.75rem)]">
          <CatalogueBreadcrumbs
            locale={locale}
            items={crumbs}
            tone="dark"
            className="mb-5"
          />
          <p className="text-[0.72rem] font-bold tracking-[0.14em] text-brand-red uppercase">
            {upcoming
              ? "Coming soon"
              : primaryCategory?.name.en || "Catalogue"}
          </p>
          <h1 className="font-display mt-2.5 max-w-[20ch] text-[clamp(1.85rem,1.3rem+2.2vw,3.25rem)] font-semibold leading-[1.08] text-balance">
            {product.name.en}
          </h1>
          {product.description ? (
            <p className="text-on-dark-muted mt-3.5 max-w-[42rem] text-[clamp(0.95rem,0.9rem+0.25vw,1.1rem)] leading-relaxed">
              {product.description}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={enquireHref}
              className={cn(buttonVariants({ variant: "default" }), "min-h-11")}
            >
              {upcoming ? "Register interest" : "Inquire"}
            </Link>
            {categoryHref ? (
              <Link
                href={localePath(locale, categoryHref)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "min-h-11 border-white/35 bg-transparent text-white hover:bg-white/10",
                )}
              >
                {primaryCategory?.name.en ?? "Category"}
              </Link>
            ) : (
              <Link
                href={localePath(locale, "products")}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "min-h-11 border-white/35 bg-transparent text-white hover:bg-white/10",
                )}
              >
                All products
              </Link>
            )}
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-8 min-[900px]:grid-cols-[1.05fr_0.95fr] min-[900px]:gap-10 min-[1100px]:gap-14">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-lg)] bg-bg-alt shadow-[var(--shadow-md)] min-[900px]:aspect-auto min-[900px]:min-h-[26rem]">
              <Image
                src={image}
                alt={product.name.en}
                fill
                className="object-cover"
                sizes="(min-width: 900px) 40rem, 100vw"
                priority
              />
              {upcoming ? (
                <span className="absolute top-4 left-4 rounded-full bg-ink/90 px-3 py-1 text-xs font-bold tracking-wide text-brand-red uppercase">
                  Coming soon
                </span>
              ) : null}
            </div>

            <div className="flex flex-col">
              {primaryCategory ? (
                <p className="text-sm">
                  <span className="text-muted-foreground">Category · </span>
                  <Link
                    href={localePath(locale, categoryHref!)}
                    className="text-brand-blue font-semibold hover:underline"
                  >
                    {primaryCategory.name.en}
                  </Link>
                </p>
              ) : null}

              {product.description ? (
                <p className="text-muted-foreground mt-4 text-[1.02rem] leading-relaxed">
                  {product.description}
                </p>
              ) : (
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  Enquire with your programme requirements and we will confirm
                  feasibility and lead time.
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={enquireHref}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "min-h-11",
                  )}
                >
                  {upcoming ? "Register interest" : "Enquire on this line"}
                </Link>
                <Link
                  href={localePath(locale, contactHref)}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "min-h-11",
                  )}
                >
                  Full contact form
                </Link>
              </div>
            </div>
          </div>

          <div
            id="enquire"
            className="border-line bg-surface mt-14 scroll-mt-24 rounded-[var(--radius-lg)] border p-5 shadow-[var(--shadow-sm)] min-[640px]:p-8"
          >
            <h2 className="font-display text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] font-semibold text-ink">
              {upcoming ? "Register interest" : "Enquire about this product"}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-[48ch] text-sm leading-relaxed">
              Tell us quantity and destination — sales responds with lead time
              and packing options.
            </p>
            <EnquiryForm
              locale={locale}
              defaultProduct={product.name.en}
              productSlug={product.slug}
              source="product"
              className="mt-6"
            />
          </div>

          {related.length ? (
            <div className="mt-16">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-display text-xl font-semibold text-ink">
                  More in this category
                </h2>
                <Link
                  href={localePath(
                    locale,
                    categoryHref ?? (upcoming ? "products#upcoming" : "products"),
                  )}
                  className="text-brand-blue text-sm font-semibold hover:underline"
                >
                  View category →
                </Link>
              </div>
              <ul className="grid gap-4 min-[640px]:grid-cols-2 min-[640px]:gap-5 min-[1024px]:grid-cols-3">
                {related.map((item) => (
                  <li key={item.id}>
                    <ProductCard locale={locale} product={item} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </Section>

      <InquireBand
        locale={locale}
        title="Need a related line or custom programme?"
        ctaHref={contactHref}
      />
    </>
  );
}
