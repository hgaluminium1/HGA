import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { CertGridBlock } from "@/features/public-corporate/components/corporate-pages";
import {
  FluidAutoGrid,
  NumberedRail,
  SectionIntro,
} from "@/features/public-site/components/corp-kit";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import { PageHero } from "@/features/public-site/components/page-hero";

const GATES = [
  {
    title: "Incoming & melt identity",
    body: "Charge and cast identity held so chemistry claims survive the shift handoff.",
  },
  {
    title: "In-process dimensional gates",
    body: "First-piece and running checks against drawings / CCD limits before volume continues.",
  },
  {
    title: "Release & mill certificates",
    body: "Documented release criteria; certificates travel with consignments for buyer QA packs.",
  },
  {
    title: "Audit & improvement loop",
    body: "ISO-aligned practices with scheduled third-party audits and NCR learning cycles.",
  },
] as const;

const LAB = [
  {
    title: "Chemistry",
    body: "Spectro sampling aligned to programme requirements — not decorative lab photos.",
  },
  {
    title: "Mechanicals",
    body: "Hardness / tensile where the temper and alloy demand it for the lot.",
  },
  {
    title: "Surface & finish",
    body: "Visual and finish gates for architectural and anodising-bound sections.",
  },
] as const;

export async function QualityPage({ locale }: { locale: string }) {
  return (
    <>
      <PageHero
        locale={locale}
        title="Quality that survives the buyer’s QA pack"
        description="Process control, mill certificates and ISO-aligned practices — built for engineers who open the folder before they open the PO."
        secondaryLabel="Request resources"
        secondaryHref="resources"
      />

      <Section>
        <Container>
          <SectionIntro
            eyebrow="Quality systems"
            title="Control the lot. Prove the lot. Ship the lot."
            body="Dimensional checks, chemistry verification and documented release criteria underpin extrusion and remelt programmes. Certificates are an output of the line — not a PDF bolted on after dispatch."
          />
        </Container>
      </Section>

      <Section className="bg-bg-alt/40">
        <Container>
          <SectionIntro
            eyebrow="Release flow"
            title="How a lot clears the gate"
            body="Scannable stages — the same pattern top industrial suppliers use so procurement and plant QA share one mental model."
          />
          <div className="mt-8 max-w-3xl">
            <NumberedRail items={GATES} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionIntro
            eyebrow="Lab & inspection"
            title="What we measure when it matters"
          />
          <FluidAutoGrid min="14rem" className="mt-8">
            {LAB.map((item) => (
              <div
                key={item.title}
                className="border-t-2 border-brand-blue/55 pt-4"
              >
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="text-muted-foreground mt-2 text-[0.9375rem] leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </FluidAutoGrid>
        </Container>
      </Section>

      <CertGridBlock />
      <InquireBand locale={locale} title="Need a sample mill certificate?" />
    </>
  );
}
