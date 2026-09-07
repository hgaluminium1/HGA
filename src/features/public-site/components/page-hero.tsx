import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { buttonVariants } from "@/components/ui/button";
import { localePath } from "@/config/nav.config";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  locale: string;
  eyebrow?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  tone?: "brand" | "ink";
};

export function PageHero({
  locale,
  eyebrow = "HG Aluminium",
  title,
  description,
  ctaLabel = "Inquire",
  ctaHref = "contact",
  secondaryLabel,
  secondaryHref,
  tone = "brand",
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        tone === "brand"
          ? "bg-[linear-gradient(135deg,var(--violet-900)_0%,var(--maroon-800)_55%,var(--violet-800)_100%)]"
          : "bg-ink",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 20%, rgba(148,50,168,0.35), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(232,169,60,0.12), transparent 45%)",
        }}
        aria-hidden
      />
      <Container className="relative py-[clamp(3.5rem,8vw,5.5rem)]">
        <p className="text-[0.72rem] font-bold tracking-[0.14em] text-gold uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display mt-3 max-w-[18ch] text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.1] text-white">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-[40rem] text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] text-on-dark-muted">
            {description}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={localePath(locale, ctaHref)}
            className={cn(buttonVariants({ variant: "default" }), "min-h-11")}
          >
            {ctaLabel}
          </Link>
          {secondaryLabel && secondaryHref ? (
            <Link
              href={localePath(locale, secondaryHref)}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "min-h-11 border-white/35 bg-transparent text-white hover:bg-white/10",
              )}
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
