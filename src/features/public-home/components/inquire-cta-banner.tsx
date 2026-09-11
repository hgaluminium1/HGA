import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
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
      className="relative overflow-hidden bg-ink text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,var(--brand-red)_0%,transparent_42%),linear-gradient(300deg,var(--brand-blue)_0%,transparent_50%)] opacity-90"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_12px)] opacity-60"
        aria-hidden
      />
      <Container className="relative z-[1]">
        <Reveal className="flex flex-col items-start gap-6 py-[clamp(2.25rem,5vw,3.25rem)] min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-between min-[720px]:gap-10">
          <h3 className="font-display max-w-[28ch] text-[clamp(1.35rem,1.05rem+1.2vw,1.85rem)] font-semibold leading-[1.2] text-balance">
            {content.title}
          </h3>
          <Link
            href={localePath(locale, content.ctaHref)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 text-[0.875rem] font-semibold tracking-tight text-ink transition-[transform,background] hover:bg-white/95 hover:scale-[1.01]"
          >
            {content.ctaLabel}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
