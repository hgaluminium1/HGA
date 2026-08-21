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
      className="bg-[linear-gradient(120deg,var(--maroon-800),var(--maroon-700))]"
    >
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 py-[2.6rem] min-[760px]:flex-row min-[760px]:items-center">
          <h3 className="font-display max-w-[24ch] text-[clamp(1.25rem,2.4vw,1.7rem)] font-semibold text-white">
            {content.title}
          </h3>
          <Button render={<Link href={localePath(locale, content.ctaHref)} />}>
            {content.ctaLabel}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
