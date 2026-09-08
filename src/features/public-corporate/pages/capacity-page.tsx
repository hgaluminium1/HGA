import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { PublicEmptyState } from "@/features/public-site/components/cms-empty-state";
import {
  FluidAutoGrid,
  MetricCell,
  SectionIntro,
} from "@/features/public-site/components/corp-kit";
import { InquireBand } from "@/features/public-site/components/inquire-band";
import { PageHero } from "@/features/public-site/components/page-hero";
import { getCachedPublishedCapacity } from "@/features/public-corporate/lib/public-cache";

export async function CapacityPage({ locale }: { locale: string }) {
  const metrics = await getCachedPublishedCapacity();

  if (!metrics.length) {
    return (
      <>
        <PageHero
          locale={locale}
          title="Production capacity"
          description="Verified metrics only — draft or unverified figures stay off this page."
          secondaryLabel="Infrastructure"
          secondaryHref="manufacturing"
        />
        <PublicEmptyState
          locale={locale}
          title="No capacity metrics yet."
          description="Verified plant metrics appear here once an editor publishes them in Admin."
          primary={{ label: "Contact / RFQ", href: "contact" }}
        />
        <InquireBand locale={locale} title="Planning a volume programme?" />
      </>
    );
  }

  const hero = metrics[0]!;
  const grouped = new Map<string, typeof metrics>();
  for (const m of metrics) {
    const key = m.category || "plant";
    const list = grouped.get(key) ?? [];
    list.push(m);
    grouped.set(key, list);
  }

  return (
    <>
      <PageHero
        locale={locale}
        title="Capacity you can plan a programme against"
        description="Verified metrics only — draft or unverified figures stay off this page. Numbers without sources do not appear."
        secondaryLabel="Infrastructure"
        secondaryHref="manufacturing"
      />

      <Section>
        <Container>
          <SectionIntro
            eyebrow="At scale"
            title={hero.label.en}
            body="Lead metric from published plant capacity. Category groups below map extrusion, billet, press and commercial windows."
          />
          <Reveal className="mt-6 max-w-md">
            <MetricCell
              label="Published lead metric"
              value={hero.value}
              unit={hero.unit}
              note={hero.sourceNote || undefined}
              featured
            />
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-bg-alt/40">
        <Container>
          {[...grouped.entries()].map(([cat, items]) => (
            <div key={cat} className="mt-12 first:mt-0">
              <SectionIntro
                eyebrow="Category"
                title={cat.replace(/_/g, " ")}
              />
              <FluidAutoGrid min="14rem" className="mt-6">
                {items.map((m) => (
                  <MetricCell
                    key={m.id}
                    label={m.label.en}
                    value={m.value}
                    unit={m.unit}
                    note={m.sourceNote || undefined}
                  />
                ))}
              </FluidAutoGrid>
            </div>
          ))}
        </Container>
      </Section>

      <InquireBand locale={locale} title="Planning a volume programme?" />
    </>
  );
}
