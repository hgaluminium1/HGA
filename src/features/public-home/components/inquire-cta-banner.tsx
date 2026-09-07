import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Button } from "@/components/ui/button";
import { localePath } from "@/config/nav.config";
import type { HomeContent } from "@/features/public-home/content/home.en";

type InquireCtaBannerProps = {
  locale: string;
  content: HomeContent["ctaBanner"];
};

export function InquireCtaBanner({ locale, content }: InquireCtaBannerProps) {
  return (
    <section
      data-block="cta-banner"
      className="bg-[linear-gradient(120deg,var(--brand-red-dark),var(--brand-red))]"
    >
      <Container>
        <Reveal className="flex flex-col items-stretch gap-5 py-[clamp(2rem,4vw,2.75rem)] min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-between">
          <h3 className="font-display max-w-[28ch] text-[clamp(1.2rem,1rem+1vw,1.65rem)] font-semibold text-balance text-white">
            {content.title}
          </h3>
          <Button
            className="w-full shrink-0 bg-white text-brand-red-dark hover:bg-white/95 min-[420px]:w-auto"
            render={<Link href={localePath(locale, content.ctaHref)} />}
          >
            {content.ctaLabel}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
