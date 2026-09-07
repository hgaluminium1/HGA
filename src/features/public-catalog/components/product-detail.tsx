import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { buttonVariants } from "@/components/ui/button";
import { EnquiryForm } from "@/features/public-site/components/enquiry-form";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import { PageHero } from "@/features/public-site/components/page-hero";
import { getCachedPublishedProductBySlug } from "@/features/public-site/lib/public-cache";
import { localePath } from "@/config/nav.config";
import { cn } from "@/lib/utils";

type ProductDetailProps = {
  locale: string;
  slug: string;
};

function SpecList({ label, values }: { label: string; values: string[] }) {
  if (!values.length) return null;
  return (
    <div>
      <h2 className="text-sm font-semibold text-ink">{label}</h2>
      <ul className="text-muted-foreground mt-2 flex flex-wrap gap-2 text-sm">
        {values.map((v) => (
          <li
            key={v}
            className="border-line rounded-[var(--radius-md)] border px-2.5 py-1"
          >
            {v}
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function ProductDetail({ locale, slug }: ProductDetailProps) {
  const product = await getCachedPublishedProductBySlug(slug);
  if (!product) notFound();

  const upcoming = Boolean(product.isUpcoming);

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={upcoming ? "Coming soon" : "Catalogue"}
        title={product.name.en}
        description={
          product.description ||
          (upcoming
            ? "Register interest for early allocation."
            : product.sku)
        }
        ctaLabel={upcoming ? "Register interest" : "Inquire"}
        ctaHref={`contact?product=${encodeURIComponent(product.name.en)}`}
        secondaryLabel="All products"
        secondaryHref="products"
      />
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-lg)] bg-bg-alt">
              <Image
                src={
                  product.imageUrl ||
                  `https://picsum.photos/seed/hg-${product.slug}/900/720`
                }
                alt={product.name.en}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40rem, 100vw"
                priority
              />
              {upcoming ? (
                <span className="absolute top-4 left-4 rounded-full bg-ink/85 px-3 py-1 text-xs font-bold tracking-wide text-gold uppercase">
                  Coming soon
                </span>
              ) : null}
            </div>
            <div className="space-y-6">
              <p className="text-muted-foreground text-sm">{product.sku}</p>
              {!upcoming ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  <SpecList label="Alloy grades" values={product.alloyGrades} />
                  <SpecList label="Tempers" values={product.tempers} />
                  <SpecList
                    label="Surface finishes"
                    values={product.surfaceFinishes}
                  />
                  <SpecList
                    label="Anodizing colors"
                    values={product.anodizingColors}
                  />
                  <SpecList label="RAL colors" values={product.ralColors} />
                  <SpecList
                    label="Tolerance standards"
                    values={product.toleranceStandards}
                  />
                  <SpecList label="Packaging" values={product.packaging} />
                </div>
              ) : (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Spec sheets publish at commercial release. Share your target
                  alloy, packing and monthly volume so we can prioritise die /
                  casting development.
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <Link
                  href={localePath(locale, "products")}
                  className={cn(buttonVariants({ variant: "outline" }), "min-h-11")}
                >
                  All products
                </Link>
                <Link
                  href={localePath(
                    locale,
                    `contact?product=${encodeURIComponent(product.name.en)}`,
                  )}
                  className={cn(buttonVariants({ variant: "default" }), "min-h-11")}
                >
                  {upcoming ? "Register interest" : "Inquire"}
                </Link>
              </div>
            </div>
          </div>
          <div className="border-line mt-14 rounded-[var(--radius-lg)] border p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold">
              {upcoming ? "Register interest" : "Enquire about this product"}
            </h2>
            <EnquiryForm
              locale={locale}
              defaultProduct={product.name.en}
              className="mt-6"
            />
          </div>
        </Container>
      </Section>
      <InquireBand
        locale={locale}
        title="Need a related alloy or custom die?"
      />
    </>
  );
}
