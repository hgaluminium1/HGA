import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import {
  CertGridBlock,
  StatsBlock,
} from "@/features/public-corporate/components/corporate-pages";
import {
  FluidAutoGrid,
  NumberedRail,
  SectionIntro,
} from "@/features/public-site/components/corp-kit";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import { PageHero } from "@/features/public-site/components/page-hero";

const STEPS = [
  {
    title: "Melt & chemistry",
    body: "Secondary pathways and melt practice tuned for billet and remelt programmes — identity held from charge to cast.",
  },
  {
    title: "Cast & homogenise",
    body: "Billet casting with homogenising cycles that set the extrusion window before metal ever sees a die.",
  },
  {
    title: "Extrude",
    body: "Press cycles with die control, temperature discipline and first-piece gates shared with QC.",
  },
  {
    title: "Finish & dispatch",
    body: "Cut-to-length, packing and mill certificates with every consignment — release criteria before wheels turn.",
  },
] as const;

const CAMPUS = [
  {
    title: "Integrated campus",
    body: "Melting, casting, homogenising and extrusion share one Gujarat site — fewer handoffs, clearer lot identity.",
  },
  {
    title: "Utilities that hold the line",
    body: "Hydraulics, furnaces and plant utilities maintained for uptime — process windows only matter if equipment does.",
  },
  {
    title: "QC adjacent to flow",
    body: "Dimensional and chemistry gates sit next to production — certificates are an output of the line, not an afterthought.",
  },
] as const;

export async function ManufacturingPage({ locale }: { locale: string }) {
  return (
    <>
      <PageHero
        locale={locale}
        title="Infrastructure built around metal flow"
        description="Integrated melting, casting and extrusion at our Kadi / Mahesana campus — process you can tour through an RFQ."
        secondaryLabel="Capacity metrics"
        secondaryHref="capacity"
      />

      <Section>
        <Container>
          <SectionIntro
            eyebrow="Infrastructure"
            title="One campus. Four disciplined stages."
            body="Buyers evaluate plants by how metal moves — not by brochure floor area. This page maps the flow; Capacity publishes the verified numbers."
          />
        </Container>
      </Section>

      <Section className="bg-bg-alt/40">
        <Container>
          <SectionIntro
            eyebrow="Process"
            title="From charge to certificate"
            body="Each stage has a job. Together they produce extrusion, billets and remelt with traceable release."
          />
          <div className="mt-8 max-w-3xl">
            <NumberedRail items={STEPS} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionIntro
            eyebrow="Campus"
            title="What “integrated” means here"
          />
          <FluidAutoGrid min="17rem" className="mt-8">
            {CAMPUS.map((c) => (
              <div
                key={c.title}
                className="border-t-2 border-brand-blue/55 pt-4"
              >
                <p className="font-semibold text-ink">{c.title}</p>
                <p className="text-muted-foreground mt-3 text-[0.9375rem] leading-relaxed">
                  {c.body}
                </p>
              </div>
            ))}
          </FluidAutoGrid>
        </Container>
      </Section>

      <StatsBlock />
      <CertGridBlock />
      <InquireBand locale={locale} title="Tour the process with an RFQ" />
    </>
  );
}
