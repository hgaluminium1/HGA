import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { buttonVariants } from "@/components/ui/button";
import { localePath } from "@/config/nav.config";
import { cn } from "@/lib/utils";

/** Stable mock heroes per page job — overridden when CMS provides media later. */
export const PAGE_HERO_IMAGES = {
  about: "https://picsum.photos/seed/hg-hero-about/1600/900",
  journey: "https://picsum.photos/seed/hg-hero-journey/1600/900",
  leadership: "https://picsum.photos/seed/hg-hero-lead/1600/900",
  capacity: "https://picsum.photos/seed/hg-hero-cap/1600/900",
  customers: "https://picsum.photos/seed/hg-hero-cust/1600/900",
  expansion: "https://picsum.photos/seed/hg-hero-exp/1600/900",
  industries: "https://picsum.photos/seed/hg-hero-ind/1600/900",
  manufacturing: "https://picsum.photos/seed/hg-hero-mfg/1600/900",
  quality: "https://picsum.photos/seed/hg-hero-qa/1600/900",
  sustainability: "https://picsum.photos/seed/hg-hero-esg/1600/900",
  procurement: "https://picsum.photos/seed/hg-hero-proc/1600/900",
  careers: "https://picsum.photos/seed/hg-hero-car/1600/900",
  resources: "https://picsum.photos/seed/hg-hero-res/1600/900",
  contact: "https://picsum.photos/seed/hg-hero-contact/1600/900",
  default: "https://picsum.photos/seed/hg-hero-default/1600/900",
} as const;

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
  showCta?: boolean;
  /** Full-bleed photo plane — preferred over pure gradient. */
  imageSrc?: string;
  imageAlt?: string;
};

/**
 * Inner-page hero — photo plane when provided, otherwise brand gradient.
 * One job: brand + title + short support + CTA group.
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
  imageSrc,
  imageAlt = "",
}: PageHeroProps) {
  const hasPhoto = Boolean(imageSrc);

  return (
    <section
      className={cn(
        "relative overflow-hidden text-white",
        !hasPhoto &&
          (tone === "brand"
            ? "bg-[linear-gradient(125deg,var(--brand-blue-darker)_0%,var(--ink)_52%,var(--brand-blue-dark)_100%)]"
            : "bg-ink"),
      )}
    >
      {hasPhoto ? (
        <>
          <Image
            src={imageSrc!}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(105deg,rgb(0_18_47_/_0.88)_0%,rgb(0_18_47_/_0.55)_55%,rgb(3_66_171_/_0.45)_100%)]"
            aria-hidden
          />
        </>
      ) : (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 12% 20%, rgba(3,66,171,0.5), transparent 48%), radial-gradient(ellipse at 88% 75%, rgba(232,1,21,0.16), transparent 42%)",
          }}
          aria-hidden
        />
      )}
      <Container className="relative py-[clamp(2.75rem,7vw,4.75rem)]">
        <p className="text-[0.72rem] font-bold tracking-[0.14em] text-brand-red uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display mt-2.5 max-w-[18ch] text-[clamp(1.85rem,1.3rem+2.2vw,3.25rem)] font-semibold leading-[1.08] text-balance">
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
