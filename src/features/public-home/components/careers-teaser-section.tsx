import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/atoms/container";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
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
  const images = content.images ?? [];

  return (
    <Section data-block="careers-teaser" id="careers">
      <Container>
        <div className="grid gap-8 min-[900px]:grid-cols-[1fr_1.35fr] min-[900px]:items-center min-[900px]:gap-12">
          <Reveal>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <h2 className="text-fs-h2 mt-2.5 text-balance">{content.title}</h2>
            <p className="text-fs-lead text-muted-foreground mt-3.5 max-w-[40ch]">
              {content.body}
            </p>
            <Link
              href={localePath(locale, content.ctaHref)}
              className="bg-brand-blue hover:bg-brand-blue-dark mt-6 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] px-5 text-[0.875rem] font-semibold text-white transition-colors"
            >
              {content.ctaLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-2 gap-2.5 min-[480px]:gap-3">
              {images[0] ? (
                <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] bg-bg-alt ring-1 ring-black/[0.06] min-[900px]:aspect-[5/3]">
                  <Image
                    src={images[0].src}
                    alt={images[0].alt}
                    fill
                    sizes="(min-width: 900px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              {images.slice(1, 3).map((image) => (
                <div
                  key={image.src}
                  className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-bg-alt ring-1 ring-black/[0.06]"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 900px) 20vw, 45vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
