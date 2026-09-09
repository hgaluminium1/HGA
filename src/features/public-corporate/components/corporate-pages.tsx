import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import { LogoMarquee } from "@/features/public-site/components/logo-marquee";
import { PageHero } from "@/features/public-site/components/page-hero";
import { PublicEmptyState } from "@/features/public-site/components/cms-empty-state";
import {
  getCachedPublishedCapacity,
  getCachedPublishedCertifications,
  getCachedPublishedLogos,
  getCachedPublishedPeople,
  getCachedPublishedSustainability,
  getCachedCompanyProfile,
  getCachedPublishedExpansion,
} from "@/features/public-corporate/lib/public-cache";
import { localePath } from "@/config/nav.config";
import type { Address, CompanyProfileDTO } from "@/modules/corporate/types";

function formatAddress(a: Address) {
  return [a.line1, a.line2, `${a.city}, ${a.state} ${a.postalCode}`, a.country]
    .filter(Boolean)
    .join(", ");
}

function roleLabel(role: string) {
  return role.replace(/_/g, " ");
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export async function LeadershipGridBlock({
  locale = "en",
}: {
  locale?: string;
} = {}) {
  const people = await getCachedPublishedPeople();
  if (!people.length) {
    return (
      <Section>
        <Container>
          <PublicEmptyState
            locale={locale}
            density="section"
            title="No leadership profiles yet."
            description="Published people appear here after editors release them in Admin."
            primary={{ label: "About HG", href: "about" }}
            secondary={{ label: "Contact", href: "contact", variant: "outline" }}
          />
        </Container>
      </Section>
    );
  }
  const order = ["chairman", "md", "director", "company_secretary", "executive"];
  const sorted = [...people].sort(
    (a, b) => order.indexOf(a.role) - order.indexOf(b.role) || a.sortOrder - b.sortOrder,
  );
  return (
    <Section>
      <Container>
        <h2 className="font-display text-2xl font-semibold">Leadership</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => (
            <li key={p.id} className="border-t-2 border-brand-blue/60 pt-4">
              <p className="font-display text-lg font-semibold text-ink">
                {p.name.en}
              </p>
              <p className="text-muted-foreground text-sm">
                {p.boardDesignation || roleLabel(p.role)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export async function LeadershipPage({ locale }: { locale: string }) {
  const people = await getCachedPublishedPeople();
  if (!people.length) {
    return (
      <>
        <PageHero
          locale={locale}
          title="Leadership"
          description="Board and executive stewardship of HG Aluminium Smelters Limited."
          secondaryLabel="About HG"
          secondaryHref="about"
        />
        <PublicEmptyState
          locale={locale}
          title="No leadership profiles yet."
          description="Board and executive profiles appear here once published in Admin."
          primary={{ label: "Contact / RFQ", href: "contact" }}
        />
        <InquireBand locale={locale} />
      </>
    );
  }
  const order = ["chairman", "md", "director", "company_secretary", "executive"];
  const sorted = [...people].sort(
    (a, b) => order.indexOf(a.role) - order.indexOf(b.role) || a.sortOrder - b.sortOrder,
  );
  const featured = sorted.filter((p) => p.role === "chairman" || p.role === "md");
  const rest = sorted.filter((p) => p.role !== "chairman" && p.role !== "md");

  return (
    <>
      <PageHero
        locale={locale}
        title="Leadership"
        description="Board and executive stewardship of HG Aluminium Smelters Limited."
        secondaryLabel="About HG"
        secondaryHref="about"
      />
      <Section>
        <Container>
          {featured.length ? (
            <ul className="mb-12 grid gap-8 min-[800px]:grid-cols-2">
              {featured.map((p) => (
                <li key={p.id} className="grid gap-5 min-[480px]:grid-cols-[11rem_1fr] min-[480px]:items-start">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-bg-alt ring-1 ring-black/[0.06]">
                    {p.photoUrl ? (
                      <Image
                        src={p.photoUrl}
                        alt={p.name.en}
                        fill
                        sizes="11rem"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(145deg,var(--brand-blue-light),var(--bg-alt))]">
                        <span className="font-display text-3xl font-semibold text-brand-blue/40">
                          {initials(p.name.en)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
                      {roleLabel(p.role)}
                    </p>
                    <p className="font-display mt-1 text-2xl font-semibold text-ink">
                      {p.name.en}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {p.boardDesignation || roleLabel(p.role)}
                    </p>
                    {p.bio.en ? (
                      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                        {p.bio.en}
                      </p>
                    ) : null}
                    {p.role === "chairman" ? (
                      <Link
                        href={localePath(locale, "chairmans-message")}
                        className="text-brand-blue mt-4 inline-flex text-sm font-semibold hover:underline"
                      >
                        Chairman’s message →
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(featured.length ? rest : sorted).map((p) => (
              <li key={p.id} className="group flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-bg-alt ring-1 ring-black/[0.06]">
                  {p.photoUrl ? (
                    <Image
                      src={p.photoUrl}
                      alt={p.name.en}
                      fill
                      sizes="(min-width: 1024px) 28vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(145deg,var(--brand-blue-light),var(--bg-alt))]">
                      <span className="font-display text-3xl font-semibold text-brand-blue/40">
                        {initials(p.name.en)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-[0.65rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
                  {roleLabel(p.role)}
                </p>
                <p className="font-display mt-1 text-xl font-semibold text-ink">
                  {p.name.en}
                </p>
                <p className="text-muted-foreground text-sm">
                  {p.boardDesignation || roleLabel(p.role)}
                </p>
                {p.yearsExperience ? (
                  <p className="text-text-faint mt-1 text-xs">
                    {p.yearsExperience}+ years experience
                  </p>
                ) : null}
                {p.bio.en ? (
                  <p className="text-muted-foreground mt-3 line-clamp-4 text-sm leading-relaxed">
                    {p.bio.en}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <InquireBand locale={locale} />
    </>
  );
}

function FactsGrid({ profile }: { profile: CompanyProfileDTO }) {
  const emails = Object.entries(profile.emails).filter(([, v]) => Boolean(v));
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="font-display text-2xl font-semibold">
          {profile.displayNames.primary || profile.legalName}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">{profile.legalName}</p>
        <dl className="mt-6 space-y-3 text-sm">
          {profile.gst ? (
            <div>
              <dt className="text-text-faint">GSTIN</dt>
              <dd className="font-medium">{profile.gst}</dd>
            </div>
          ) : null}
          {profile.cin ? (
            <div>
              <dt className="text-text-faint">CIN</dt>
              <dd className="font-medium">{profile.cin}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-text-faint">Registered office</dt>
            <dd className="mt-1 leading-relaxed">
              {formatAddress(profile.registeredOffice)}
            </dd>
          </div>
          <div>
            <dt className="text-text-faint">Factory</dt>
            <dd className="mt-1 leading-relaxed">
              {formatAddress(profile.factoryAddress)}
            </dd>
          </div>
        </dl>
      </div>
      <div className="border-line bg-bg-alt rounded-[var(--radius-lg)] border p-6">
        <h3 className="font-display text-lg font-semibold">Direct lines</h3>
        <ul className="mt-4 space-y-3 text-sm">
          {profile.phones.map((p) => (
            <li key={`${p.label}-${p.number}`}>
              <span className="text-text-faint">{p.label}: </span>
              <a href={`tel:${p.number}`} className="font-medium hover:underline">
                {p.number}
              </a>
            </li>
          ))}
          {emails.map(([key, value]) => (
            <li key={key}>
              <span className="text-text-faint capitalize">{key}: </span>
              <a
                href={`mailto:${value}`}
                className="font-medium hover:underline"
              >
                {value}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export async function CompanyFactsBlock({
  embedded = false,
  locale = "en",
}: {
  embedded?: boolean;
  locale?: string;
} = {}) {
  const profile = await getCachedCompanyProfile();
  if (!profile) {
    const empty = (
      <PublicEmptyState
        locale={locale}
        density="section"
        title="Company profile not published yet."
        description="Legal name, addresses and direct lines appear once the company profile is saved."
        primary={{ label: "Contact / RFQ", href: "contact" }}
      />
    );
    if (embedded) return empty;
    return (
      <Section>
        <Container>{empty}</Container>
      </Section>
    );
  }
  if (embedded) {
    return <FactsGrid profile={profile} />;
  }
  return (
    <Section>
      <Container>
        <FactsGrid profile={profile} />
      </Container>
    </Section>
  );
}

export async function StatsBlock({ locale = "en" }: { locale?: string } = {}) {
  const metrics = await getCachedPublishedCapacity();
  if (!metrics.length) {
    return (
      <Section alt>
        <Container>
          <PublicEmptyState
            locale={locale}
            density="section"
            title="No capacity metrics yet."
            description="Verified figures appear here after publish in Admin."
            primary={{ label: "View capacity page", href: "capacity" }}
            secondary={{ label: "Contact", href: "contact", variant: "outline" }}
          />
        </Container>
      </Section>
    );
  }
  return (
    <Section alt>
      <Container>
        <p className="text-[0.7rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
          At a glance
        </p>
        <h2 className="font-display mt-2 text-fs-h2">Published capacity</h2>
        <dl
          className="mt-8 grid gap-[clamp(1.25rem,3vw,1.75rem)]"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 12rem), 1fr))",
          }}
        >
          {metrics.slice(0, 8).map((m) => (
            <div key={m.id} className="border-t border-black/[0.08] pt-4">
              <dt className="text-muted-foreground text-sm">{m.label.en}</dt>
              <dd className="font-display mt-1.5 text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] font-semibold text-ink">
                {m.value} {m.unit}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}

export async function CertGridBlock({ locale = "en" }: { locale?: string } = {}) {
  const certs = await getCachedPublishedCertifications();
  if (!certs.length) {
    return (
      <Section>
        <Container>
          <PublicEmptyState
            locale={locale}
            density="section"
            title="No certifications published yet."
            description="ISO and related certificates appear here once verified and published."
            primary={{ label: "Quality", href: "quality" }}
            secondary={{ label: "Contact", href: "contact", variant: "outline" }}
          />
        </Container>
      </Section>
    );
  }
  return (
    <Section>
      <Container>
        <p className="text-[0.7rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
          Certifications
        </p>
        <h2 className="font-display mt-2 text-fs-h2">Systems on the record</h2>
        <ul
          className="mt-8 grid gap-[clamp(1rem,2.5vw,1.5rem)]"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))",
          }}
        >
          {certs.map((c) => (
            <li
              key={c.id}
              className="flex flex-col border-t-2 border-brand-blue/50 pt-4"
            >
              <p className="font-display text-lg font-semibold text-ink">
                {c.name}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">{c.issuer}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export async function SustainabilityMetricsBlock({
  locale = "en",
}: {
  locale?: string;
} = {}) {
  const metrics = await getCachedPublishedSustainability();
  if (!metrics.length) {
    return (
      <Section>
        <Container>
          <PublicEmptyState
            locale={locale}
            density="section"
            title="No sustainability metrics yet."
            description="Verified metrics and labelled initiatives appear after disclosure review."
            primary={{ label: "Contact", href: "contact" }}
          />
        </Container>
      </Section>
    );
  }
  return (
    <Section>
      <Container>
        <p className="text-[0.7rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
          Disclosure
        </p>
        <h2 className="font-display mt-2 text-fs-h2">Published metrics</h2>
        <ul
          className="mt-8 grid gap-[clamp(1rem,2.5vw,1.5rem)]"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))",
          }}
        >
          {metrics.map((m) => (
            <li
              key={m.id}
              className="border-t-2 border-brand-blue/55 pt-4"
            >
              <p className="text-[0.65rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
                {m.disclosureTier.replace(/_/g, " ")}
              </p>
              <p className="mt-2 font-semibold text-ink">{m.label.en}</p>
              {m.disclosureTier === "verified_metric" && m.value ? (
                <p className="font-display mt-2 text-[clamp(1.35rem,1.1rem+0.7vw,1.75rem)] font-semibold">
                  {m.value} {m.unit}
                </p>
              ) : (
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {m.methodologyNote || "Initiative / commitment."}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export async function ExpansionRoadmapBlock({
  locale = "en",
}: {
  locale?: string;
} = {}) {
  const projects = await getCachedPublishedExpansion();
  if (!projects.length) {
    return (
      <Section alt>
        <Container>
          <PublicEmptyState
            locale={locale}
            density="section"
            title="No expansion projects yet."
            description="Disclosure-approved programmes appear here after publish."
            primary={{ label: "Expansion", href: "expansion" }}
            secondary={{ label: "Contact", href: "contact", variant: "outline" }}
          />
        </Container>
      </Section>
    );
  }
  return (
    <Section alt>
      <Container>
        <h2 className="font-display text-2xl font-semibold">
          Expansion roadmap
        </h2>
        <ol className="mt-6 divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {projects.map((p) => (
            <li key={p.id} className="py-4">
              <p className="font-semibold text-ink">
                {p.title.en}{" "}
                <span className="text-muted-foreground text-sm font-normal">
                  ({p.status})
                </span>
              </p>
              {p.expectedCommissioning ? (
                <p className="text-muted-foreground mt-1 text-sm">
                  Commissioning: {p.expectedCommissioning}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/** Logo marquee — CMS logo-strip / gallery embeds (no page H1). */
export async function CustomerLogoStripBlock({
  locale = "en",
}: {
  locale?: string;
} = {}) {
  const logos = await getCachedPublishedLogos();
  if (!logos.length) {
    return (
      <Section>
        <Container>
          <PublicEmptyState
            locale={locale}
            density="section"
            title="No customer logos published yet."
            description="Upload approved logos in Admin → Customers, then publish with website approval."
            primary={{ label: "Customers", href: "customers" }}
            secondary={{ label: "Contact", href: "contact", variant: "outline" }}
          />
        </Container>
      </Section>
    );
  }
  return (
    <Section alt>
      <Container>
        <LogoMarquee
          items={logos.map((l) => ({
            id: l.id,
            name: l.name,
            imageUrl: l.imageUrl,
          }))}
        />
      </Container>
    </Section>
  );
}
