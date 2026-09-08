import { Container } from "@/components/atoms/container";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Section } from "@/components/atoms/section";
import { getCachedPublishedSustainability } from "@/features/public-corporate/lib/public-cache";
import {
  FluidAutoGrid,
  SectionIntro,
} from "@/features/public-site/components/corp-kit";
import { PublicEmptyState } from "@/features/public-site/components/cms-empty-state";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import { PageHero } from "@/features/public-site/components/page-hero";

const PILLARS = [
  {
    title: "Secondary pathways",
    body: "Remelt reduces primary intensity for many applications — we say so only where the process actually uses secondary routes.",
  },
  {
    title: "Plant discipline",
    body: "Energy, scrap handling and process yield sit next to production KPIs — not in a separate brochure chapter.",
  },
  {
    title: "Disclosure tiers",
    body: "Verified metrics, named initiatives, or commitments — never unverified claims dressed as data.",
  },
] as const;

function tierLabel(tier: string) {
  return tier.replace(/_/g, " ");
}

export async function SustainabilityPage({ locale }: { locale: string }) {
  const metrics = await getCachedPublishedSustainability();

  return (
    <>
      <PageHero
        locale={locale}
        title="Sustainability with disclosure discipline"
        description="Secondary aluminium pathways, responsible operations and transparent tiers — built for assessors and buyers who read footnotes."
      />

      <Section>
        <Container>
          <SectionIntro
            eyebrow="Approach"
            title="Clarity over green theatre"
            body="Industrial buyers and ESG assessors need scannable truth. We publish what we can verify, name what we are working on, and keep commitments labelled as commitments."
          />
          <ul className="mt-8 max-w-2xl space-y-5">
            {PILLARS.map((p) => (
              <li key={p.title}>
                <p className="font-semibold text-ink">{p.title}</p>
                <p className="text-muted-foreground mt-1 text-[0.9375rem] leading-relaxed">
                  {p.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="bg-bg-alt/40" id="metrics">
        <Container>
          <SectionIntro
            eyebrow="Published metrics & initiatives"
            title="What we show on the record"
            body="Each row carries a disclosure tier so you know whether you are reading a verified number, an initiative, or a commitment."
          />
          {metrics.length ? (
            <FluidAutoGrid min="16rem" className="mt-10">
              {metrics.map((m) => (
                <article
                  key={m.id}
                  className="border-t-2 border-brand-blue/55 pt-4"
                >
                  <Eyebrow>{tierLabel(m.disclosureTier)}</Eyebrow>
                  <h3 className="mt-2 font-semibold text-ink">{m.label.en}</h3>
                  {m.disclosureTier === "verified_metric" && m.value ? (
                    <p className="font-display mt-3 text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-semibold tracking-tight text-ink">
                      {m.value}
                      {m.unit ? (
                        <span className="text-muted-foreground ml-1.5 text-[0.45em] font-normal">
                          {m.unit}
                        </span>
                      ) : null}
                    </p>
                  ) : (
                    <p className="text-muted-foreground mt-3 text-[0.9375rem] leading-relaxed">
                      {m.methodologyNote ||
                        "Initiative / commitment — details available on enquiry."}
                    </p>
                  )}
                </article>
              ))}
            </FluidAutoGrid>
          ) : (
            <div className="mt-8">
              <PublicEmptyState
                locale={locale}
                density="section"
                title="No sustainability metrics yet."
                description="Verified numbers and labelled initiatives appear here once published in Admin."
                primary={{ label: "Contact / RFQ", href: "contact" }}
              />
            </div>
          )}
        </Container>
      </Section>

      <InquireBand locale={locale} />
    </>
  );
}
