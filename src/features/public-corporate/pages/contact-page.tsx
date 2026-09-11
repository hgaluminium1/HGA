import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { SocialLinks } from "@/components/molecules/social-links";
import { CompanyFactsBlock } from "@/features/public-corporate/components/corporate-pages";
import { getCachedCompanyProfile } from "@/features/public-corporate/lib/public-cache";
import {
  FluidSplit,
  SectionIntro,
} from "@/features/public-site/components/corp-kit";
import { EnquiryForm } from "@/features/public-site/components/enquiry-form";
import { PageHero } from "@/features/public-site/components/page-hero";

export async function ContactPage({
  locale,
  defaultProduct,
}: {
  locale: string;
  defaultProduct?: string;
}) {
  const profile = await getCachedCompanyProfile();
  const socialLinks = profile?.socialLinks ?? [];
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
            label: "Registered office / factory",
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
        description="Tell us alloy, geometry and volume — sales responds with feasibility and lead time. One form, clear next step."
        ctaLabel="View products"
        ctaHref="products"
      />

      <Section>
        <Container>
          <div
            className="@container grid gap-[clamp(2rem,5vw,3.5rem)]"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 22rem), 1fr))",
            }}
          >
            <div>
              <SectionIntro
                eyebrow="Enquiry"
                title="Send a programme brief"
                body="The fields mirror what plant and commercial teams need — alloy, temper, tonnage, destination."
              />
              <Reveal className="mt-6">
                <EnquiryForm
                  locale={locale}
                  defaultProduct={defaultProduct}
                />
              </Reveal>
            </div>
            <div className="space-y-[clamp(1.75rem,4vw,2.5rem)]">
              <div>
                <SectionIntro
                  eyebrow="Company"
                  title="Legal & plant identity"
                />
                <div className="mt-6">
                  <CompanyFactsBlock embedded />
                </div>
              </div>
              {socialLinks.length > 0 ? (
                <div>
                  <SectionIntro
                    eyebrow="Connect"
                    title="Follow us"
                    body="Official profiles for news, careers and company updates."
                  />
                  <Reveal className="mt-6">
                    <SocialLinks links={socialLinks} variant="onLight" />
                  </Reveal>
                </div>
              ) : null}
              <div>
                <SectionIntro eyebrow="Find us" title="Campus location" />
                <div className="mt-6 space-y-6">
                  {displayLocations.map((loc) => (
                    <Reveal key={loc.id}>
                      {loc.label ? (
                        <p className="text-sm font-semibold text-ink">
                          {loc.label}
                        </p>
                      ) : null}
                      {loc.address ? (
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
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
                          className="text-brand-blue mt-2 inline-flex min-h-11 items-center text-sm font-semibold underline-offset-2 hover:underline"
                        >
                          Open in Maps
                        </a>
                      ) : null}
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-bg-alt/40">
        <Container>
          <FluidSplit>
            <SectionIntro
              eyebrow="What happens next"
              title="Feasibility first. Quote second."
              body="We confirm die / casting fit and lead time before a commercial offer — the same cadence serious industrial buyers expect."
            />
            <div className="text-muted-foreground self-end text-[0.9375rem] leading-relaxed">
              Prefer email? Use the sales or export lines on the company facts
              panel — RFQ fields still help us answer faster.
            </div>
          </FluidSplit>
        </Container>
      </Section>
    </>
  );
}
