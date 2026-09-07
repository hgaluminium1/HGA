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
  /** Hide primary CTA when page has its own action pattern. */
  showCta?: boolean;
};

/**
 * Shared inner-page hero — logo blue/red family (synced with site chrome).
 */
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
  showCta = true,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden text-white",
        tone === "brand"
          ? "bg-[linear-gradient(125deg,var(--brand-blue-darker)_0%,var(--ink)_48%,var(--brand-red-dark)_120%)]"
          : "bg-ink",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 15% 20%, rgba(3,66,171,0.45), transparent 50%), radial-gradient(ellipse at 85% 80%, rgba(232,1,21,0.18), transparent 45%)",
        }}
        aria-hidden
      />
      <Container className="relative py-[clamp(2.5rem,6vw,4.25rem)]">
        <p className="text-[0.72rem] font-bold tracking-[0.14em] text-brand-red uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display mt-2.5 max-w-[20ch] text-[clamp(1.85rem,1.3rem+2.2vw,3.25rem)] font-semibold leading-[1.08] text-balance">
          {title}
        </h1>
        {description ? (
          <p className="text-on-dark-muted mt-3.5 max-w-[40rem] text-[clamp(0.95rem,0.9rem+0.25vw,1.1rem)] leading-relaxed">
            {description}
          </p>
        ) : null}
        {showCta || (secondaryLabel && secondaryHref) ? (
          <div className="mt-7 flex flex-wrap gap-3">
            {showCta ? (
              <Link
                href={localePath(locale, ctaHref)}
                className={cn(buttonVariants({ variant: "default" }), "min-h-11")}
              >
                {ctaLabel}
              </Link>
            ) : null}
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
        ) : null}
      </Container>
    </section>
  );
}
