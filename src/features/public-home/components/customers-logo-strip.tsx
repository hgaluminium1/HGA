import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import type { HomeContent } from "@/features/public-home/content/home.en";
import { PublicEmptyState } from "@/features/public-site/components/cms-empty-state";

type CustomersLogoStripProps = {
  content: HomeContent["customers"];
  locale?: string;
};

export function CustomersLogoStrip({
  content,
  locale = "en",
}: CustomersLogoStripProps) {
  const logos = content.logos ?? [];

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
          <Reveal>
            <ul className="mt-[clamp(1.75rem,3.5vw,2.5rem)] grid grid-cols-2 gap-x-4 gap-y-1 min-[480px]:grid-cols-3 min-[1024px]:grid-cols-4">
              {logos.map((logo) => (
                <li
                  key={logo}
                  className="group flex min-h-[3.75rem] items-center justify-center border-b border-black/[0.06] px-2 py-4 text-center transition-colors last:border-b-0 min-[480px]:min-h-[4.25rem]"
                >
                  <span className="font-display text-[clamp(0.8rem,0.72rem+0.3vw,0.95rem)] font-semibold tracking-[-0.01em] text-ink/45 transition-colors duration-300 group-hover:text-ink">
                    {logo}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : (
          <div className="mt-[clamp(1.75rem,3.5vw,2.5rem)]">
            <PublicEmptyState
              locale={locale}
              density="section"
              title="No customer logos yet."
              description="Published customer names appear in this strip once they are added in Admin."
              primary={{ label: "Contact / RFQ", href: "contact" }}
            />
          </div>
        )}
      </Container>
    </Section>
  );
}
