import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import { Button } from "@/components/ui/button";
import { localePath } from "@/config/nav.config";
import type { HomeContent } from "@/features/public-home/content/home.en";

type CareersTeaserSectionProps = {
  locale: string;
  content: HomeContent["careers"];
};

export function CareersTeaserSection({
  locale,
  content,
}: CareersTeaserSectionProps) {
  return (
    <Section data-block="careers-teaser" id="careers">
      <Container>
        <Reveal className="mx-auto mb-10 max-w-[700px] text-center">
          <SectionHeader
            center
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.body}
            className="mb-6"
          />
          <Button
            size="sm"
            render={<Link href={localePath(locale, content.ctaHref)} />}
          >
            {content.ctaLabel}
          </Button>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 gap-4 overflow-hidden rounded-[var(--radius-lg)] min-[720px]:grid-cols-[1fr_1.6fr]">
            {content.images.map((image) => (
              <div
                key={image.src}
                className="relative min-h-[260px] overflow-hidden rounded-[var(--radius-md)] min-[720px]:min-h-[320px]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 720px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
