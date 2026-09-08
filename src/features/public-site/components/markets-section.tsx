import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/atoms/container";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
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

/** Stable industrial mock imagery per sector (picsum seeds). */
const SECTOR_IMAGE: Record<string, string> = {
  solar: "https://picsum.photos/seed/hg-mkt-solar/800/600",
  infrastructure: "https://picsum.photos/seed/hg-mkt-infra/800/600",
  automotive_ev: "https://picsum.photos/seed/hg-mkt-auto/800/600",
  industrial: "https://picsum.photos/seed/hg-mkt-ind/800/600",
  railways: "https://picsum.photos/seed/hg-mkt-rail/800/600",
  cable_electrical: "https://picsum.photos/seed/hg-mkt-cable/800/600",
  steel_deox: "https://picsum.photos/seed/hg-mkt-steel/800/600",
  aerospace: "https://picsum.photos/seed/hg-mkt-aero/800/600",
};

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
  if (!segments.length) return null;

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

        <Reveal stagger>
          <ul className="-mx-[var(--pad-inline)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--pad-inline)] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[640px]:mx-0 min-[640px]:grid min-[640px]:grid-cols-2 min-[640px]:gap-4 min-[640px]:overflow-visible min-[640px]:px-0 min-[640px]:pb-0 min-[640px]:snap-none min-[1024px]:grid-cols-4">
            {segments.map((s) => {
              const src =
                SECTOR_IMAGE[s.key] ??
                `https://picsum.photos/seed/hg-mkt-${s.key}/800/600`;
              return (
                <li
                  key={s.key}
                  className="w-[min(72vw,16.5rem)] shrink-0 snap-start min-[640px]:w-auto min-[640px]:min-w-0"
                >
                  <Link
                    href={localePath(locale, "industries")}
                    className="group flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 rounded-[var(--radius-lg)]"
                  >
                    <span className="relative isolate block aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-bg-alt ring-1 ring-black/[0.06] transition-[box-shadow,transform] duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-md)]">
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 72vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <span
                        className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
                        aria-hidden
                      />
                      <span className="absolute inset-x-0 bottom-0 p-3.5 text-white">
                        <span className="font-display block text-[0.95rem] font-semibold leading-snug">
                          {s.label}
                        </span>
                      </span>
                    </span>
                    <span className="text-muted-foreground mt-2.5 line-clamp-2 text-[0.8125rem] leading-relaxed">
                      {s.applications.slice(0, 2).join(" · ") || s.description}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
