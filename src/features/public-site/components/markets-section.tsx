import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import { localePath } from "@/config/nav.config";
import industriesSeed from "../../../../config/industries.seed.json";

export type IndustrySegment = {
  key: string;
  label: string;
  description: string;
  productFocus: string[];
  applications: string[];
};

export function loadIndustrySegments(): IndustrySegment[] {
  return industriesSeed as IndustrySegment[];
}

type MarketsSectionProps = {
  locale: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  limit?: number;
};

export function MarketsSection({
  locale,
  eyebrow = "Markets",
  title = "Markets we serve",
  description = "Application sectors shaped by extrusion, billet and remelt demand — not a claim list of prospective brands.",
  limit,
}: MarketsSectionProps) {
  const segments = loadIndustrySegments().slice(
    0,
    limit ?? Number.POSITIVE_INFINITY,
  );
  if (!segments.length) return null;

  return (
    <Section data-block="markets">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        </Reveal>
        <Reveal stagger>
          <ul className="grid gap-3 min-[520px]:grid-cols-2 min-[520px]:gap-4 min-[1024px]:grid-cols-4">
            {segments.map((s) => (
              <li
                key={s.key}
                className="border-line bg-surface rounded-[var(--radius-lg)] border p-4 transition-[border-color] duration-300 hover:border-brand-blue/40 min-[480px]:p-5"
              >
                <p className="font-display text-[clamp(1rem,0.95rem+0.3vw,1.15rem)] font-semibold text-ink">
                  {s.label}
                </p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {s.description}
                </p>
                {s.applications.length ? (
                  <p className="mt-3 text-xs leading-snug text-text-faint">
                    {s.applications.slice(0, 3).join(" · ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Reveal>
        <p className="mt-7 min-[768px]:mt-8">
          <Link
            href={localePath(locale, "industries")}
            className="text-brand-blue text-sm font-semibold hover:underline"
          >
            Explore all industries →
          </Link>
        </p>
      </Container>
    </Section>
  );
}
