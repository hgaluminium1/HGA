import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { PublicEmptyState } from "@/features/public-site/components/cms-empty-state";
import {
  FluidAutoGrid,
  SectionIntro,
} from "@/features/public-site/components/corp-kit";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import { PageHero } from "@/features/public-site/components/page-hero";
import {
  getCachedPublishedCaseStudies,
  getCachedPublishedLogos,
  getCachedPublishedTestimonials,
} from "@/features/public-corporate/lib/public-cache";

export async function CustomersPage({ locale }: { locale: string }) {
  const [logos, cases, testimonials] = await Promise.all([
    getCachedPublishedLogos(),
    getCachedPublishedCaseStudies(),
    getCachedPublishedTestimonials(),
  ]);

  const empty = !logos.length && !cases.length && !testimonials.length;

  return (
    <>
      <PageHero
        locale={locale}
        title="Proof, not name-dropping"
        description="Approved organisation tiles and anonymised programme stories. Brand marks appear only with explicit permission."
        secondaryLabel="Industries"
        secondaryHref="industries"
      />

      {empty ? (
        <PublicEmptyState
          locale={locale}
          title="No customer proof yet."
          description="Approved logos, case studies and testimonials appear here once published in Admin."
          primary={{ label: "Contact / RFQ", href: "contact" }}
        />
      ) : (
        <>
          {logos.length ? (
            <Section>
              <Container>
                <SectionIntro
                  eyebrow="Organisations"
                  title="Teams we supply"
                  body="Name tiles until logo permission is on file — the Apple pattern of restraint over decorative marquees."
                />
                <ul
                  className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-lg)] bg-black/[0.06] ring-1 ring-black/[0.06]"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(min(100%, 11rem), 1fr))",
                  }}
                >
                  {logos.map((l) => (
                    <li
                      key={l.id}
                      className="flex min-h-[4.5rem] items-center justify-center bg-white px-3 py-5 text-center"
                    >
                      <span className="font-display text-[0.875rem] font-semibold text-ink/50 transition-colors hover:text-ink">
                        {l.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </Container>
            </Section>
          ) : null}

          {cases.length ? (
            <Section className="bg-bg-alt/40">
              <Container>
                <SectionIntro
                  eyebrow="Case studies"
                  title="Programmes, not press releases"
                />
                <ul className="mt-8 divide-y divide-black/[0.08] border-y border-black/[0.08]">
                  {cases.map((c) => (
                    <li
                      key={c.id}
                      className="grid gap-2 py-[clamp(1.2rem,2.5vw,1.75rem)]"
                    >
                      <p className="font-display text-[1.15rem] font-semibold text-ink">
                        {c.title.en}
                      </p>
                      <p className="text-muted-foreground text-[0.8125rem]">
                        {c.industry} · {c.region}
                      </p>
                      {c.summary.en ? (
                        <p className="text-muted-foreground max-w-[60ch] text-[0.9375rem] leading-relaxed">
                          {c.summary.en}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Container>
            </Section>
          ) : null}

          {testimonials.length ? (
            <Section>
              <Container>
                <SectionIntro
                  eyebrow="Voices"
                  title="What partners say"
                />
                <FluidAutoGrid min="18rem" className="mt-8">
                  {testimonials.map((t) => (
                    <Reveal key={t.id}>
                      <blockquote className="border-t-2 border-brand-blue/55 pt-4">
                        <p className="text-[1.02rem] leading-relaxed text-ink">
                          “{t.quote.en}”
                        </p>
                        <footer className="text-muted-foreground mt-4 text-[0.8125rem]">
                          {t.authorName}
                          {t.authorTitle ? `, ${t.authorTitle}` : ""}
                          {t.company ? ` — ${t.company}` : ""}
                        </footer>
                      </blockquote>
                    </Reveal>
                  ))}
                </FluidAutoGrid>
              </Container>
            </Section>
          ) : null}
        </>
      )}

      <InquireBand locale={locale} />
    </>
  );
}
