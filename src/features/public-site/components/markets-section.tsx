import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/atoms/container";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { PublicEmptyState } from "@/features/public-site/components/cms-empty-state";
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

/** @deprecated Stock sector images removed — typography-first markets. */
export const SECTOR_IMAGE: Record<string, string> = {};

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
  description = "Application sectors shaped by extrusion, billet and remelt demand.",
  limit = 8,
}: MarketsSectionProps) {
  const segments = loadIndustrySegments().slice(0, limit);
  if (!segments.length) {
    return (
      <Section data-block="markets">
        <Container>
          <PublicEmptyState
            locale={locale}
            density="section"
            title="No market segments configured yet."
            description="Industry seed data appears here once published."
            primary={{ label: "Industries", href: "industries" }}
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section data-block="markets">
      <Container>
        <Reveal>
          <div className="mb-[clamp(1.75rem,3.5vw,2.75rem)] flex flex-col gap-4 min-[720px]:flex-row min-[720px]:items-end min-[720px]:justify-between">
            <div className="max-w-xl">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2 className="text-fs-h2 mt-2.5 text-balance">{title}</h2>
              {description ? (
                <p className="text-fs-lead text-muted-foreground mt-3.5">
                  {description}
                </p>
              ) : null}
            </div>
            <Link
              href={localePath(locale, "industries")}
              className="text-brand-blue inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold tracking-tight hover:text-brand-blue-dark"
            >
              Explore industries
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal>
          <ul className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {segments.map((s) => (
              <li
                key={s.key}
                className="flex flex-wrap items-baseline justify-between gap-3 py-4"
              >
                <div className="min-w-0 max-w-[40rem]">
                  <p className="font-semibold text-ink">{s.label}</p>
                  <p className="text-muted-foreground mt-1 text-[0.875rem] leading-relaxed">
                    {s.applications.slice(0, 2).join(" · ") || s.description}
                  </p>
                </div>
                <Link
                  href={localePath(locale, "industries")}
                  className="text-brand-blue shrink-0 text-sm font-semibold hover:underline"
                >
                  View →
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
