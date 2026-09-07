import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import { PageHero } from "@/features/public-site/components/page-hero";
import { CmsEmptyState } from "@/features/public-site/components/cms-empty-state";
import {
  getCachedPublishedCapacity,
  getCachedPublishedCaseStudies,
  getCachedPublishedCertifications,
  getCachedPublishedLogos,
  getCachedPublishedPeople,
  getCachedPublishedSustainability,
  getCachedPublishedTestimonials,
  getCachedCompanyProfile,
  getCachedPublishedExpansion,
} from "@/features/public-corporate/lib/public-cache";
import type { Address, CompanyProfileDTO } from "@/modules/corporate/types";

function formatAddress(a: Address) {
  return [a.line1, a.line2, `${a.city}, ${a.state} ${a.postalCode}`, a.country]
    .filter(Boolean)
    .join(", ");
}

export async function LeadershipGridBlock() {
  const people = await getCachedPublishedPeople();
  if (!people.length) return null;
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
            <li
              key={p.id}
              className="border-line bg-surface rounded-[var(--radius-lg)] border p-6"
            >
              <p className="font-display text-lg font-semibold">{p.name.en}</p>
              <p className="text-muted-foreground text-sm">
                {p.boardDesignation || p.role}
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
      <CmsEmptyState locale={locale} title="Leadership isn’t published yet." />
    );
  }
  const order = ["chairman", "md", "director", "company_secretary", "executive"];
  const sorted = [...people].sort(
    (a, b) => order.indexOf(a.role) - order.indexOf(b.role) || a.sortOrder - b.sortOrder,
  );
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
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((p) => (
              <li
                key={p.id}
                className="border-line bg-surface rounded-[var(--radius-lg)] border p-6"
              >
                <p className="text-[0.65rem] font-bold tracking-[0.12em] text-brand-accent uppercase">
                  {p.role.replace("_", " ")}
                </p>
                <p className="font-display mt-2 text-xl font-semibold">{p.name.en}</p>
                <p className="text-muted-foreground text-sm">
                  {p.boardDesignation || p.role}
                </p>
                {p.yearsExperience ? (
                  <p className="text-text-faint mt-1 text-xs">
                    {p.yearsExperience}+ years experience
                  </p>
                ) : null}
                {p.bio.en ? (
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
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

export async function CapacityPage({ locale }: { locale: string }) {
  const metrics = await getCachedPublishedCapacity();
  if (!metrics.length) {
    return (
      <CmsEmptyState
        locale={locale}
        title="Capacity metrics aren’t published yet."
      />
    );
  }
  return (
    <>
      <PageHero
        locale={locale}
        title="Production capacity"
        description="Verified metrics only — draft or unverified figures stay off this page."
        secondaryLabel="Manufacturing"
        secondaryHref="manufacturing"
      />
      <Section>
        <Container>
          <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((m) => (
              <div
                key={m.id}
                className="border-line bg-surface rounded-[var(--radius-lg)] border p-5"
              >
                <dt className="text-muted-foreground text-sm">{m.label.en}</dt>
                <dd className="font-display mt-2 text-3xl font-semibold tracking-tight">
                  {m.value}
                  {m.unit ? (
                    <span className="text-muted-foreground ml-1 text-base font-normal">
                      {m.unit}
                    </span>
                  ) : null}
                </dd>
                {m.sourceNote ? (
                  <p className="text-text-faint mt-3 text-xs">{m.sourceNote}</p>
                ) : null}
              </div>
            ))}
          </dl>
        </Container>
      </Section>
      <InquireBand locale={locale} title="Planning a volume programme?" />
    </>
  );
}

export async function CustomersPage({ locale }: { locale: string }) {
  const [logos, cases, testimonials] = await Promise.all([
    getCachedPublishedLogos(),
    getCachedPublishedCaseStudies(),
    getCachedPublishedTestimonials(),
  ]);
  if (!logos.length && !cases.length && !testimonials.length) {
    return (
      <CmsEmptyState
        locale={locale}
        title="Customer proof isn’t published yet."
      />
    );
  }
  return (
    <>
      <PageHero
        locale={locale}
        title="Customers & proof"
        description="Approved name tiles and anonymised project stories. Brand logos appear only with explicit permission."
        secondaryLabel="Industries"
        secondaryHref="industries"
      />
      <Section>
        <Container>
          {logos.length ? (
            <>
              <h2 className="font-display text-2xl font-semibold">
                Organisations we serve
              </h2>
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {logos.map((l) => (
                  <li
                    key={l.id}
                    className="border-line bg-surface flex min-h-[5.5rem] items-center justify-center rounded-[var(--radius-md)] border px-3 text-center text-sm font-semibold"
                  >
                    {l.name}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {cases.length ? (
            <div className={logos.length ? "mt-12" : undefined}>
              <h2 className="font-display text-2xl font-semibold">
                Case studies
              </h2>
              <ul className="mt-6 space-y-4">
                {cases.map((c) => (
                  <li
                    key={c.id}
                    className="border-line rounded-[var(--radius-lg)] border p-5"
                  >
                    <p className="font-display text-lg font-semibold">
                      {c.title.en}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {c.industry} · {c.region}
                    </p>
                    {c.summary.en ? (
                      <p className="mt-3 text-sm leading-relaxed">{c.summary.en}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {testimonials.length ? (
            <div className="mt-12">
              <h2 className="font-display text-2xl font-semibold">
                What partners say
              </h2>
              <ul className="mt-6 grid gap-4 md:grid-cols-2">
                {testimonials.map((t) => (
                  <li
                    key={t.id}
                    className="border-line rounded-[var(--radius-lg)] border p-5"
                  >
                    <p className="text-sm leading-relaxed italic">
                      “{t.quote.en}”
                    </p>
                    <p className="text-muted-foreground mt-3 text-sm">
                      {t.authorName}
                      {t.company ? ` — ${t.company}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
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
}: {
  embedded?: boolean;
} = {}) {
  const profile = await getCachedCompanyProfile();
  if (!profile) return null;
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

export async function StatsBlock() {
  const metrics = await getCachedPublishedCapacity();
  if (!metrics.length) return null;
  return (
    <Section alt>
      <Container>
        <h2 className="font-display text-2xl font-semibold">At a glance</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.slice(0, 8).map((m) => (
            <div key={m.id}>
              <dt className="text-muted-foreground text-sm">{m.label.en}</dt>
              <dd className="font-display text-xl font-semibold">
                {m.value} {m.unit}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}

export async function CertGridBlock() {
  const certs = await getCachedPublishedCertifications();
  if (!certs.length) return null;
  return (
    <Section>
      <Container>
        <h2 className="font-display text-2xl font-semibold">Certifications</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {certs.map((c) => (
            <li
              key={c.id}
              className="border-line rounded-[var(--radius-lg)] border p-4"
            >
              <p className="font-semibold">{c.name}</p>
              <p className="text-muted-foreground text-sm">{c.issuer}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export async function SustainabilityMetricsBlock() {
  const metrics = await getCachedPublishedSustainability();
  if (!metrics.length) return null;
  return (
    <Section>
      <Container>
        <h2 className="font-display text-2xl font-semibold">Sustainability</h2>
        <ul className="mt-6 space-y-4">
          {metrics.map((m) => (
            <li
              key={m.id}
              className="border-line rounded-[var(--radius-lg)] border p-4"
            >
              <p className="text-xs font-semibold tracking-wide text-brand-accent uppercase">
                {m.disclosureTier.replace("_", " ")}
              </p>
              <p className="font-semibold">{m.label.en}</p>
              {m.disclosureTier === "verified_metric" && m.value ? (
                <p className="mt-1 text-lg">
                  {m.value} {m.unit}
                </p>
              ) : (
                <p className="text-muted-foreground mt-1 text-sm">
                  {m.methodologyNote || "Initiative / commitment — see details."}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export async function ExpansionPage({ locale }: { locale: string }) {
  const projects = await getCachedPublishedExpansion();
  if (!projects.length) {
    return (
      <CmsEmptyState
        locale={locale}
        title="Expansion projects aren’t published yet."
      />
    );
  }
  return (
    <>
      <PageHero
        locale={locale}
        title="Expansion roadmap"
        description="Confirmed and planned capacity programmes. INR figures appear only when public disclosure is approved."
        secondaryLabel="Capacity"
        secondaryHref="capacity"
      />
      <Section>
        <Container>
          <ul className="space-y-5">
            {projects.map((p) => (
              <li
                key={p.id}
                className="border-line rounded-[var(--radius-lg)] border p-6"
              >
                <p className="text-xs font-bold tracking-[0.12em] text-brand-accent uppercase">
                  {p.status}
                </p>
                <p className="font-display mt-1 text-xl font-semibold">
                  {p.title.en}
                </p>
                {p.description.en ? (
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {p.description.en}
                  </p>
                ) : null}
                {p.locationNote ? (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {p.locationNote}
                  </p>
                ) : null}
                {(p.expectedStart || p.expectedCommissioning) && (
                  <p className="text-text-faint mt-3 text-xs">
                    {[
                      p.expectedStart ? `Start: ${p.expectedStart}` : null,
                      p.expectedCommissioning
                        ? `Commissioning: ${p.expectedCommissioning}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                {p.publicDisclosureApproved &&
                (p.projectCostInr != null || p.estimatedRevenueInr != null) ? (
                  <p className="mt-3 text-sm font-medium">
                    {p.projectCostInr != null
                      ? `Project cost: ₹${p.projectCostInr} Cr`
                      : null}
                    {p.projectCostInr != null && p.estimatedRevenueInr != null
                      ? " · "
                      : null}
                    {p.estimatedRevenueInr != null
                      ? `Est. revenue: ₹${p.estimatedRevenueInr} Cr`
                      : null}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <InquireBand locale={locale} title="Discuss partnership or offtake?" />
    </>
  );
}

export async function ExpansionRoadmapBlock() {
  const projects = await getCachedPublishedExpansion();
  if (!projects.length) return null;
  return (
    <Section alt>
      <Container>
        <h2 className="font-display text-2xl font-semibold">
          Expansion roadmap
        </h2>
        <ol className="mt-6 space-y-4">
          {projects.map((p) => (
            <li
              key={p.id}
              className="border-line rounded-[var(--radius-md)] border p-4"
            >
              <p className="font-semibold">
                {p.title.en}{" "}
                <span className="text-muted-foreground text-sm font-normal">
                  ({p.status})
                </span>
              </p>
              {p.expectedCommissioning ? (
                <p className="text-muted-foreground text-sm">
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

/** Name tiles only — for CMS logo-strip / gallery embeds (no page H1). */
export async function CustomerLogoStripBlock() {
  const logos = await getCachedPublishedLogos();
  if (!logos.length) return null;
  return (
    <Section alt>
      <Container>
        <h2 className="font-display text-2xl font-semibold">Customers</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {logos.map((l) => (
            <li
              key={l.id}
              className="border-line bg-surface flex min-h-[4.5rem] items-center justify-center rounded-[var(--radius-md)] border px-2 text-center text-sm font-semibold"
            >
              {l.name}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
