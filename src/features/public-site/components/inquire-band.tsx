import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { localePath } from "@/config/nav.config";

type InquireBandProps = {
  locale: string;
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * Sitewide CTA band — industrial gradient (red → ink → blue) + white pill.
 * Matches home InquireCtaBanner; avoids red-on-red primary Button overrides.
 */
export function InquireBand({
  locale,
  title = "Have a die, alloy or tonnage in mind? Tell us your programme.",
  ctaLabel = "Inquire Now",
  ctaHref = "contact",
}: InquireBandProps) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,var(--brand-red)_0%,transparent_42%),linear-gradient(300deg,var(--brand-blue)_0%,transparent_50%)] opacity-90"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_12px)] opacity-60"
        aria-hidden
      />
      <Container className="relative z-[1]">
        <Reveal className="flex flex-col items-stretch gap-5 py-[clamp(1.75rem,3.5vw,2.5rem)] min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-between min-[720px]:gap-10">
          <h2 className="font-display max-w-[32ch] text-[clamp(1.2rem,1rem+1vw,1.65rem)] font-semibold leading-[1.25] text-balance text-white">
            {title}
          </h2>
          <Link
            href={localePath(locale, ctaHref)}
            className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-[0.9rem] font-semibold tracking-tight text-ink transition-[transform,background] hover:bg-white/95 hover:scale-[1.01] min-[420px]:w-auto"
          >
            {ctaLabel}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
