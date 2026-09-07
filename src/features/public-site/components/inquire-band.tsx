import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Button } from "@/components/ui/button";
import { localePath } from "@/config/nav.config";

type InquireBandProps = {
  locale: string;
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function InquireBand({
  locale,
  title = "Need alloys, billets, or custom extrusion profiles?",
  ctaLabel = "Talk to sales",
  ctaHref = "contact",
}: InquireBandProps) {
  return (
    <section className="bg-[linear-gradient(120deg,var(--maroon-800),var(--maroon-700))]">
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 py-[2.4rem] min-[760px]:flex-row min-[760px]:items-center">
          <h2 className="font-display max-w-[28ch] text-[clamp(1.2rem,2.2vw,1.65rem)] font-semibold text-white">
            {title}
          </h2>
          <Button render={<Link href={localePath(locale, ctaHref)} />}>
            {ctaLabel}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
