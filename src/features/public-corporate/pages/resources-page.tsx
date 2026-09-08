import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { localePath } from "@/config/nav.config";
import { CertGridBlock } from "@/features/public-corporate/components/corporate-pages";
import {
  FluidSplit,
  SectionIntro,
} from "@/features/public-site/components/corp-kit";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import { PageHero } from "@/features/public-site/components/page-hero";

const RESOURCES = [
  {
    title: "Mill test certificate samples",
    body: "Example MTC layout for extrusion and billet lots — request the pack that matches your programme.",
    tag: "Certificates",
  },
  {
    title: "Alloy / temper capability note",
    body: "Working window for common 6xxx grades and tempers on our press and billet lines.",
    tag: "Capability",
  },
  {
    title: "Extrusion CCD & length guide",
    body: "Dimensional and cut-length guidance for RFQ geometry conversations.",
    tag: "Technical",
  },
  {
    title: "Packing & logistics overview",
    body: "Bundle, stretch and crate options — what travels with the metal for domestic and export.",
    tag: "Logistics",
  },
  {
    title: "ISO / QMS summary",
    body: "High-level quality system note aligned to published certifications.",
    tag: "Quality",
  },
  {
    title: "RFQ field checklist",
    body: "Alloy, temper, CCD, tonnage, destination — the minimum set for a fast commercial answer.",
    tag: "Buying",
  },
] as const;

export async function ResourcesPage({ locale }: { locale: string }) {
  const contact = localePath(locale, "contact");

  return (
    <>
      <PageHero
        locale={locale}
        title="Technical packs for serious RFQs"
        description="Request datasheets, certificate samples and capability notes — gated by enquiry so packs stay current and relevant."
        ctaLabel="Request a pack"
        ctaHref="contact"
      />

      <Section>
        <Container>
          <SectionIntro
            eyebrow="Resources"
            title="Ask for the pack. Get the right files."
            body="FAANG-grade B2B sites treat downloads as a workflow, not a dusty FTP dump. Tell us which programme you are qualifying — we send the matching set."
          />

          <ul className="mt-10 divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {RESOURCES.map((r) => (
              <li
                key={r.title}
                className="grid gap-3 py-[clamp(1.15rem,2.5vw,1.6rem)] @container min-[640px]:grid-cols-[1fr_auto] min-[640px]:items-center"
              >
                <div>
                  <p className="text-[0.65rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
                    {r.tag}
                  </p>
                  <p className="mt-1 font-semibold text-ink">{r.title}</p>
                  <p className="text-muted-foreground mt-1 max-w-[52ch] text-[0.9375rem] leading-relaxed">
                    {r.body}
                  </p>
                </div>
                <Link
                  href={contact}
                  className="text-brand-blue inline-flex min-h-10 items-center justify-self-start text-[0.875rem] font-semibold hover:underline min-[640px]:justify-self-end"
                >
                  Request
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="bg-bg-alt/40">
        <Container>
          <FluidSplit>
            <SectionIntro
              eyebrow="Why request, not anonymous download"
              title="Current packs beat stale PDFs"
              body="Capability and certificate samples change with dies, alloys and audit cycles. A short enquiry keeps what you receive aligned to what we can actually supply."
            />
            <Reveal className="self-end">
              <Link
                href={contact}
                className="bg-ink hover:bg-ink/90 inline-flex min-h-11 items-center rounded-[var(--radius-md)] px-5 text-[0.875rem] font-semibold text-white transition-colors"
              >
                Open enquiry form
              </Link>
            </Reveal>
          </FluidSplit>
        </Container>
      </Section>

      <CertGridBlock />
      <InquireBand locale={locale} />
    </>
  );
}
