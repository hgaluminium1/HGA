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
    <section className="bg-[linear-gradient(120deg,var(--brand-red-dark),var(--brand-red))]">
      <Container>
        <Reveal className="flex flex-col items-stretch gap-5 py-[clamp(1.75rem,3.5vw,2.4rem)] min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-between">
          <h2 className="font-display max-w-[28ch] text-[clamp(1.2rem,1rem+1vw,1.65rem)] font-semibold text-balance text-white">
            {title}
          </h2>
          <Button
            className="w-full shrink-0 bg-white text-brand-red-dark hover:bg-white/95 min-[420px]:w-auto"
            render={<Link href={localePath(locale, ctaHref)} />}
          >
            {ctaLabel}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
