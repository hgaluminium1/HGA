import { Container } from "@/components/atoms/container";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Section } from "@/components/atoms/section";
import { PublicEmptyState } from "@/features/public-site/components/cms-empty-state";
import { SectionIntro } from "@/features/public-site/components/corp-kit";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import { PageHero } from "@/features/public-site/components/page-hero";
import { getCachedPublishedExpansion } from "@/features/public-corporate/lib/public-cache";

export async function ExpansionPage({ locale }: { locale: string }) {
  const projects = await getCachedPublishedExpansion();

  return (
    <>
      <PageHero
        locale={locale}
        title="Expansion with disclosure gates"
        description="Confirmed and planned capacity programmes. INR figures appear only when public disclosure is approved."
        secondaryLabel="Capacity today"
        secondaryHref="capacity"
      />

      {!projects.length ? (
        <PublicEmptyState
          locale={locale}
          title="No expansion projects yet."
          description="Confirmed and planned programmes appear here once disclosure-approved in Admin."
          primary={{ label: "Contact / RFQ", href: "contact" }}
        />
      ) : (
        <>
          <Section>
            <Container>
              <SectionIntro
                eyebrow="Roadmap"
                title="What we are building next"
                body="Status labels stay honest — planned, confirmed, proposed. Financials stay hidden until disclosure is approved."
              />
            </Container>
          </Section>

          <Section className="bg-bg-alt/40">
            <Container>
              <ol className="relative space-y-0">
                {projects.map((p, i) => (
                  <li
                    key={p.id}
                    className="grid grid-cols-[auto_1fr] gap-x-[clamp(1rem,3vw,1.75rem)] border-b border-black/[0.08] py-[clamp(1.5rem,3vw,2.25rem)] last:border-b-0"
                  >
                    <div className="flex flex-col items-center">
                      <span className="bg-brand-blue size-2.5 rounded-full" />
                      {i < projects.length - 1 ? (
                        <span className="bg-brand-blue/25 mt-2 w-px flex-1 min-h-[2rem]" />
                      ) : null}
                    </div>
                    <div>
                      <Eyebrow>{p.status}</Eyebrow>
                      <h3 className="font-display mt-2 text-[clamp(1.2rem,1.05rem+0.6vw,1.55rem)] font-semibold text-ink">
                        {p.title.en}
                      </h3>
                      {p.description.en ? (
                        <p className="text-muted-foreground mt-2 max-w-[58ch] text-[0.9375rem] leading-relaxed">
                          {p.description.en}
                        </p>
                      ) : null}
                      {p.locationNote ? (
                        <p className="text-muted-foreground mt-2 text-[0.8125rem]">
                          {p.locationNote}
                        </p>
                      ) : null}
                      {(p.expectedStart || p.expectedCommissioning) && (
                        <p className="text-text-faint mt-3 text-[0.75rem]">
                          {[
                            p.expectedStart
                              ? `Start: ${p.expectedStart}`
                              : null,
                            p.expectedCommissioning
                              ? `Commissioning: ${p.expectedCommissioning}`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                      {p.publicDisclosureApproved &&
                      (p.projectCostInr != null ||
                        p.estimatedRevenueInr != null) ? (
                        <p className="mt-3 text-[0.875rem] font-semibold text-ink">
                          {p.projectCostInr != null
                            ? `Project cost: ₹${p.projectCostInr} Cr`
                            : null}
                          {p.projectCostInr != null &&
                          p.estimatedRevenueInr != null
                            ? " · "
                            : null}
                          {p.estimatedRevenueInr != null
                            ? `Est. revenue: ₹${p.estimatedRevenueInr} Cr`
                            : null}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </Container>
          </Section>
        </>
      )}

      <InquireBand locale={locale} title="Discuss partnership or offtake?" />
    </>
  );
}
