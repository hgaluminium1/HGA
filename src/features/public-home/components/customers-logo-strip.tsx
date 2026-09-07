import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import type { HomeContent } from "@/features/public-home/content/home.en";

type CustomersLogoStripProps = {
  content: HomeContent["customers"];
};

export function CustomersLogoStrip({ content }: CustomersLogoStripProps) {
  const logos = content.logos ?? [];
  if (!logos.length) return null;

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

        <Reveal stagger>
          <ul className="mt-[clamp(1.75rem,3.5vw,2.75rem)] grid grid-cols-2 gap-2.5 min-[480px]:gap-3 min-[640px]:grid-cols-3 min-[1024px]:grid-cols-4">
            {logos.map((logo) => (
              <li
                key={logo}
                className="border-line bg-surface flex min-h-[4.25rem] items-center justify-center rounded-[var(--radius-md)] border px-3 py-3 text-center transition-[border-color,box-shadow] duration-300 hover:border-brand-blue/35 hover:shadow-[var(--shadow-sm)] min-[480px]:min-h-[5rem]"
              >
                <span className="font-display text-ink text-[clamp(0.8rem,0.72rem+0.35vw,1rem)] font-semibold leading-snug tracking-[-0.01em]">
                  {logo}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
