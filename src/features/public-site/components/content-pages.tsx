import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { buttonVariants } from "@/components/ui/button";
import {
  CertGridBlock,
  CompanyFactsBlock,
  CustomerLogoStripBlock,
  StatsBlock,
  SustainabilityMetricsBlock,
} from "@/features/public-corporate";
import { CatalogueBreadcrumbs } from "@/features/public-catalog/components/catalogue-breadcrumbs";
import { categoryImageUrl } from "@/features/public-catalog/lib/product-media";
import { EnquiryForm } from "@/features/public-site/components/enquiry-form";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import {
  loadIndustrySegments,
  MarketsSection,
} from "@/features/public-site/components/markets-section";
import {
  PAGE_HERO_IMAGES,
  PageHero,
} from "@/features/public-site/components/page-hero";
import {
  PresentProductsGrid,
  UpcomingProductsStrip,
} from "@/features/public-site/components/upcoming-products";
import { getCachedCompanyProfile } from "@/features/public-corporate/lib/public-cache";
import { localePath } from "@/config/nav.config";
import { listCategoriesFlat } from "@/modules/catalog";
import { cn } from "@/lib/utils";

export async function AboutPage({ locale }: { locale: string }) {
  return (
    <>
      <PageHero
        locale={locale}
        title="Aluminium made for demanding programmes"
        description="HG Aluminium Smelters Limited — extrusion, homogenised billets and remelt capacity from Kadi / Mahesana, Gujarat."
        secondaryLabel="View products"
        secondaryHref="products"
        imageSrc={PAGE_HERO_IMAGES.about}
      />
      <Section>
        <Container>
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl font-semibold">Who we are</h2>
            <p className="text-muted-foreground mt-4 text-fs-lead leading-relaxed">
              We cast, homogenise and extrude aluminium for architectural,
              industrial, solar and foundry customers. Our plant focuses on
              reliable chemistry, dimensional control and programme delivery —
              from die development through mill certificates on every lot.
            </p>
          </div>
        </Container>
      </Section>
      <CompanyFactsBlock />
      <StatsBlock />
      <InquireBand locale={locale} />
    </>
  );
}

export async function JourneyPage({ locale }: { locale: string }) {
  const milestones = [
    {
      year: "Foundation",
      title: "Company incorporation",
      body: "HG Aluminium Smelters Limited established to build secondary aluminium and extrusion capability in Gujarat.",
    },
    {
      year: "Plant",
      title: "Kadi / Mahesana operations",
      body: "Factory campus commissioned at Laxmipura Nandasan, Taluka Kadi — melting, casting and extrusion under one roof.",
    },
    {
      year: "Today",
      title: "Market programmes",
      body: "Serving extrusion, billet and remelt customers across solar, infrastructure, industrial and cable markets.",
    },
    {
      year: "Next",
      title: "Capacity expansion",
      body: "Roadmap for additional press and casting capacity — see Expansion for disclosed projects.",
    },
  ];
  return (
    <>
      <PageHero
        locale={locale}
        title="Our journey"
        description="From incorporation to a growing extrusion and remelt platform in Gujarat."
        secondaryLabel="Expansion"
        secondaryHref="expansion"
        imageSrc={PAGE_HERO_IMAGES.journey}
      />
      <Section>
        <Container>
          <ol className="relative max-w-3xl space-y-10 border-l-2 border-brand-blue/25 pl-8 md:pl-10">
            {milestones.map((m) => (
              <li key={m.title} className="relative">
                <span className="bg-brand-blue absolute top-1.5 -left-[2.15rem] size-3 rounded-full ring-4 ring-white md:-left-[2.65rem]" />
                <p className="text-xs font-bold tracking-[0.12em] text-brand-blue uppercase">
                  {m.year}
                </p>
                <h2 className="font-display mt-1 text-xl font-semibold text-ink">
                  {m.title}
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
                  {m.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      <InquireBand locale={locale} />
    </>
  );
}

export async function IndustriesPage({ locale }: { locale: string }) {
  const segments = loadIndustrySegments();
  return (
    <>
      <PageHero
        locale={locale}
        title="Industries & applications"
        description="Markets where HG extrusion, billets and remelt alloys are specified — sector focus, not prospective brand claims."
        secondaryLabel="Products"
        secondaryHref="products"
        imageSrc={PAGE_HERO_IMAGES.industries}
      />
      <Section>
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {segments.map((s) => (
              <li key={s.key} className="flex flex-col border-t-2 border-brand-blue/60 pt-4">
                <h2 className="font-display text-xl font-semibold text-ink">
                  {s.label}
                </h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {s.description}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {s.applications.map((a) => (
                    <li
                      key={a}
                      className="text-text-faint text-xs leading-snug"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <InquireBand locale={locale} />
    </>
  );
}

export async function ManufacturingPage({ locale }: { locale: string }) {
  const steps = [
    {
      title: "Melting & refining",
      body: "Controlled remelt chemistry with lot traceability into casting.",
    },
    {
      title: "Casting & homogenising",
      body: "Billet and ingot casting with homogenising for extrusion feed.",
    },
    {
      title: "Extrusion",
      body: "Press lines for architectural, industrial and solar sections.",
    },
    {
      title: "Finish & dispatch",
      body: "Cut-to-length, packing and mill certificates with every consignment.",
    },
  ];
  return (
    <>
      <PageHero
        locale={locale}
        title="Manufacturing"
        description="Integrated melting, casting and extrusion at our Gujarat plant."
        secondaryLabel="Capacity"
        secondaryHref="capacity"
        imageSrc={PAGE_HERO_IMAGES.manufacturing}
      />
      <Section>
        <Container>
          <ol className="grid gap-8 sm:grid-cols-2">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t border-black/[0.08] pt-5">
                <p className="text-brand-blue text-sm font-bold tabular-nums">
                  0{i + 1}
                </p>
                <h2 className="font-display mt-2 text-xl font-semibold text-ink">
                  {s.title}
                </h2>
                <p className="text-muted-foreground mt-2 text-sm">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      <StatsBlock />
      <CertGridBlock />
      <InquireBand locale={locale} />
    </>
  );
}

export async function QualityPage({ locale }: { locale: string }) {
  return (
    <>
      <PageHero
        locale={locale}
        title="Quality systems"
        description="Process control, mill certificates and ISO-aligned practices for every lot."
        secondaryLabel="Resources"
        secondaryHref="resources"
        imageSrc={PAGE_HERO_IMAGES.quality}
      />
      <Section>
        <Container className="max-w-3xl">
          <p className="text-muted-foreground text-fs-lead leading-relaxed">
            Dimensional checks, chemistry verification and documented release
            criteria underpin our extrusion and remelt programmes. Certificates
            travel with consignments; third-party audits are scheduled as part of
            our continuous improvement cycle.
          </p>
        </Container>
      </Section>
      <CertGridBlock />
      <InquireBand locale={locale} title="Need a sample mill certificate?" />
    </>
  );
}

export async function SustainabilityPage({ locale }: { locale: string }) {
  return (
    <>
      <PageHero
        locale={locale}
        title="Sustainability"
        description="Secondary aluminium pathways, responsible operations and transparent disclosure tiers."
        imageSrc={PAGE_HERO_IMAGES.sustainability}
      />
      <Section>
        <Container className="max-w-3xl">
          <p className="text-muted-foreground text-fs-lead leading-relaxed">
            Remelt and recycling reduce primary metal intensity for many
            applications. We publish only verified metrics, named initiatives, or
            commitments — never unverified claims.
          </p>
        </Container>
      </Section>
      <SustainabilityMetricsBlock />
      <InquireBand locale={locale} />
    </>
  );
}

export async function ProcurementPage({ locale }: { locale: string }) {
  const profile = await getCachedCompanyProfile();
  return (
    <>
      <PageHero
        locale={locale}
        title="Procurement & export"
        description="Buyer path for domestic programmes and export enquiries — clear contacts, clear next steps."
        ctaLabel="Send RFQ"
        ctaHref="contact"
        imageSrc={PAGE_HERO_IMAGES.procurement}
      />
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-semibold">
                How to buy from HG
              </h2>
              <ol className="text-muted-foreground mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed">
                <li>Share alloy, temper, geometry / SKU and monthly volume.</li>
                <li>We confirm die / casting feasibility and lead time.</li>
                <li>Commercial offer with packing and certificate scope.</li>
                <li>Programme kickoff with QC and dispatch cadence.</li>
              </ol>
            </div>
            <div className="border-line bg-bg-alt rounded-[var(--radius-lg)] border p-6 text-sm">
              <h3 className="font-display text-lg font-semibold">Contacts</h3>
              {profile ? (
                <ul className="mt-4 space-y-2">
                  {profile.emails.sales ? (
                    <li>
                      Sales:{" "}
                      <a
                        className="font-medium hover:underline"
                        href={`mailto:${profile.emails.sales}`}
                      >
                        {profile.emails.sales}
                      </a>
                    </li>
                  ) : null}
                  {profile.emails.export ? (
                    <li>
                      Export:{" "}
                      <a
                        className="font-medium hover:underline"
                        href={`mailto:${profile.emails.export}`}
                      >
                        {profile.emails.export}
                      </a>
                    </li>
                  ) : null}
                  {profile.emails.purchase ? (
                    <li>
                      Purchase:{" "}
                      <a
                        className="font-medium hover:underline"
                        href={`mailto:${profile.emails.purchase}`}
                      >
                        {profile.emails.purchase}
                      </a>
                    </li>
                  ) : null}
                </ul>
              ) : (
                <p className="text-muted-foreground mt-3">
                  Contact details publish with the company profile.
                </p>
              )}
            </div>
          </div>
        </Container>
      </Section>
      <InquireBand locale={locale} title="Ready with an RFQ?" ctaLabel="Enquire" />
    </>
  );
}

export async function CareersPage({ locale }: { locale: string }) {
  const profile = await getCachedCompanyProfile();
  return (
    <>
      <PageHero
        locale={locale}
        title="Careers at HG"
        description="Build aluminium programmes with a growing Gujarat manufacturer — roles open through HR, not placeholder job boards."
        ctaLabel="Contact HR"
        ctaHref="contact"
        imageSrc={PAGE_HERO_IMAGES.careers}
      />
      <Section>
        <Container className="max-w-3xl">
          <p className="text-muted-foreground text-fs-lead leading-relaxed">
            We hire for operations, quality, maintenance and commercial roles as
            capacity grows. Share your background with HR — we respond when a
            matching opening exists.
          </p>
          {profile?.emails.hr ? (
            <p className="mt-6 text-sm">
              HR:{" "}
              <a
                className="text-brand-accent font-semibold hover:underline"
                href={`mailto:${profile.emails.hr}`}
              >
                {profile.emails.hr}
              </a>
            </p>
          ) : null}
        </Container>
      </Section>
      <InquireBand locale={locale} title="Introduce yourself to HG" />
    </>
  );
}

export async function ResourcesPage({ locale }: { locale: string }) {
  return (
    <>
      <PageHero
        locale={locale}
        title="Resources"
        description="Request datasheets, certificates and technical packs for your RFQ."
        imageSrc={PAGE_HERO_IMAGES.resources}
      />
      <Section>
        <Container>
          <ul className="grid gap-1 sm:grid-cols-2">
            {[
              "Mill test certificate samples",
              "Alloy / temper capability note",
              "Extrusion CCD & length guide",
              "Packing & logistics overview",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center justify-between gap-4 border-b border-black/[0.08] py-4"
              >
                <span className="font-medium text-ink">{item}</span>
                <Link
                  href={localePath(locale, "contact")}
                  className="text-brand-blue shrink-0 text-sm font-semibold hover:underline"
                >
                  Request
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CertGridBlock />
      <InquireBand locale={locale} />
    </>
  );
}

export async function ContactPage({
  locale,
  defaultProduct,
}: {
  locale: string;
  defaultProduct?: string;
}) {
  const profile = await getCachedCompanyProfile();
  const locations =
    profile?.locations?.filter((l) => l.embedUrl || l.mapsUrl || l.address) ??
    [];
  const fallbackQuery =
    profile?.registeredOffice?.line1 ||
    "Laxmipura Nandasan Kadi Mahesana Gujarat";
  const displayLocations =
    locations.length > 0
      ? locations
      : [
          {
            id: "default",
            label: "Registered office",
            address: [
              profile?.registeredOffice?.line1,
              profile?.registeredOffice?.city,
              profile?.registeredOffice?.state,
            ]
              .filter(Boolean)
              .join(", "),
            mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery)}`,
            embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&z=14&output=embed`,
            order: 0,
          },
        ];

  return (
    <>
      <PageHero
        locale={locale}
        title="Contact & RFQ"
        description="Tell us alloy, geometry and volume — sales will respond with feasibility and lead time."
        ctaLabel="View products"
        ctaHref="products"
        imageSrc={PAGE_HERO_IMAGES.contact}
      />
      <Section>
        <Container>
          <div className="grid gap-10 min-[980px]:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="font-display text-2xl font-semibold">
                Send an enquiry
              </h2>
              <EnquiryForm
                locale={locale}
                defaultProduct={defaultProduct}
                className="mt-6"
              />
            </div>
            <div className="space-y-8">
              <CompanyFactsBlock embedded />
              <div>
                <h2 className="font-display text-xl font-semibold">Find us</h2>
                <div className="mt-4 space-y-6">
                  {displayLocations.map((loc) => (
                    <div key={loc.id}>
                      {loc.label ? (
                        <p className="text-sm font-semibold text-ink">
                          {loc.label}
                        </p>
                      ) : null}
                      {loc.address ? (
                        <p className="text-muted-foreground mt-1 text-sm">
                          {loc.address}
                        </p>
                      ) : null}
                      {loc.embedUrl ? (
                        <div className="border-line mt-3 overflow-hidden rounded-[var(--radius-lg)] border">
                          <iframe
                            title={`Map — ${loc.label || "Location"}`}
                            src={loc.embedUrl}
                            className="aspect-[16/10] w-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                          />
                        </div>
                      ) : null}
                      {loc.mapsUrl ? (
                        <a
                          href={loc.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand mt-2 inline-flex min-h-11 items-center text-sm font-semibold underline-offset-2 hover:underline"
                        >
                          Open in Maps
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

export async function CategoryLandingPage({
  locale,
  slug,
  title,
  description,
  categorySlugs,
}: {
  locale: string;
  slug: string;
  title: string;
  description: string;
  categorySlugs: string[];
}) {
  const cats = await listCategoriesFlat();
  const matched = cats.filter(
    (c) =>
      categorySlugs.includes(c.slug) &&
      (c.status === "published" || c.status === "draft"),
  );
  const publishedMatched = matched.filter((c) => c.status === "published");
  const primary = publishedMatched[0] ?? matched[0];
  const matchIds = (publishedMatched.length ? publishedMatched : matched).map(
    (c) => c.id,
  );
  const displayTitle = primary?.name.en || title;
  const displayDescription =
    primary?.description?.en?.trim() || description;
  const heroImage =
    primary?.imageUrl?.trim() ||
    categoryImageUrl(
      slug.startsWith("products/") ? slug : `products/${slug}`,
      primary,
    );

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(125deg,var(--brand-blue-darker)_0%,var(--ink)_50%,var(--brand-blue-dark)_100%)] text-white">
        <Container className="relative grid gap-8 py-[clamp(2.5rem,6vw,4.25rem)] min-[900px]:grid-cols-[1.15fr_0.85fr] min-[900px]:items-end">
          <div>
            <CatalogueBreadcrumbs
              locale={locale}
              items={[
                { label: "Catalogue", href: "products" },
                { label: displayTitle },
              ]}
              tone="dark"
              className="mb-5"
            />
            <p className="text-[0.72rem] font-bold tracking-[0.14em] text-brand-red uppercase">
              Category
            </p>
            <h1 className="font-display mt-2.5 max-w-[16ch] text-[clamp(1.85rem,1.3rem+2.2vw,3.25rem)] font-semibold leading-[1.08]">
              {displayTitle}
            </h1>
            <p className="text-on-dark-muted mt-3.5 max-w-[40rem] text-[clamp(0.95rem,0.9rem+0.25vw,1.1rem)] leading-relaxed">
              {displayDescription}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={localePath(locale, "contact")}
                className={cn(buttonVariants({ variant: "default" }), "min-h-11")}
              >
                Inquire
              </Link>
              <Link
                href={localePath(locale, "products")}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "min-h-11 border-white/35 bg-transparent text-white hover:bg-white/10",
                )}
              >
                All products
              </Link>
            </div>
          </div>
          <div className="relative hidden aspect-[16/11] overflow-hidden rounded-[var(--radius-lg)] min-[900px]:block">
            <Image
              src={heroImage}
              alt={displayTitle}
              fill
              sizes="28rem"
              className="object-cover"
              priority
            />
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="mb-8">
            <p className="text-[0.7rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
              Present lines
            </p>
            <h2 className="font-display mt-1.5 text-xl font-semibold text-ink">
              Published in this category
            </h2>
          </div>
          <PresentProductsGrid
            locale={locale}
            categoryIds={matchIds}
            limit={24}
          />
          {!matchIds.length ? (
            <p className="text-muted-foreground text-sm">
              Catalogue lines for this category will appear once published.
              Edit category copy and image in Admin → Categories.
            </p>
          ) : null}
          <p className="mt-8 text-sm">
            <Link
              href={localePath(locale, "products")}
              className="text-brand-blue font-semibold hover:underline"
            >
              Browse full catalogue →
            </Link>
          </p>
        </Container>
      </Section>
      {slug.includes("ingot") ? (
        <UpcomingProductsStrip
          locale={locale}
          title="Related upcoming lines"
          description="Cubes, shots and deoxidizer — coming soon."
        />
      ) : null}
      <InquireBand locale={locale} />
    </>
  );
}

export { MarketsSection, CustomerLogoStripBlock, UpcomingProductsStrip };
