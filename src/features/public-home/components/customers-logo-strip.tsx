import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import type { HomeContent } from "@/features/public-home/content/home.en";

type CustomersLogoStripProps = {
  content: HomeContent["customers"];
};

export function CustomersLogoStrip({ content }: CustomersLogoStripProps) {
  return (
    <Section data-block="customers" id="customers" alt>
      <Container>
        <Reveal>
          <SectionHeader
            center
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
            className="max-w-[50rem]"
          />
        </Reveal>

        <Reveal stagger>
          <div className="mt-[clamp(2rem,4vw,3rem)] grid grid-cols-2 gap-4 min-[560px]:grid-cols-3 min-[900px]:grid-cols-6">
            {content.logos.map((logo) => (
              <div
                key={logo}
                className="border-line bg-surface flex h-[84px] items-center justify-center rounded-[var(--radius-md)] border opacity-60 grayscale transition-[filter,opacity,transform] duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:opacity-100 hover:grayscale-0"
              >
                <span className="font-display text-ink text-[1.05rem] font-bold tracking-[-0.01em]">
                  {logo}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
