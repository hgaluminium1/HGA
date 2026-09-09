import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import type { HomeContent } from "@/features/public-home/content/home.en";
import { PublicEmptyState } from "@/features/public-site/components/cms-empty-state";
import {
  LogoMarquee,
  type LogoMarqueeItem,
} from "@/features/public-site/components/logo-marquee";

type CustomersLogoStripProps = {
  content: HomeContent["customers"];
  locale?: string;
  /** Live corporate logos (preferred over CMS name fallbacks). */
  items?: LogoMarqueeItem[];
};

function normalizeItems(
  content: HomeContent["customers"],
  items?: LogoMarqueeItem[],
): LogoMarqueeItem[] {
  if (items?.length) return items;
  return (content.logos ?? []).map((name) => ({ name }));
}

export function CustomersLogoStrip({
  content,
  locale = "en",
  items,
}: CustomersLogoStripProps) {
  const logos = normalizeItems(content, items);

  return (
    <Section data-block="customers" id="customers" alt>
      <Container>
        <Reveal>
          <SectionHeader
            center
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
            className="mx-auto max-w-[42rem]"
          />
        </Reveal>

        {logos.length ? (
          <div className="mt-[clamp(1.75rem,3.5vw,2.5rem)]">
            <LogoMarquee items={logos} />
          </div>
        ) : (
          <div className="mt-[clamp(1.75rem,3.5vw,2.5rem)]">
            <PublicEmptyState
              locale={locale}
              density="section"
              title="No customer logos yet."
              description="Upload approved logos in Admin → Customers. Names show until a logo file is attached."
              primary={{ label: "Contact / RFQ", href: "contact" }}
            />
          </div>
        )}
      </Container>
    </Section>
  );
}
