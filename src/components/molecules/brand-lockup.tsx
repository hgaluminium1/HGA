import Image from "next/image";
import Link from "next/link";

import { FALLBACK_BRAND_ICON } from "@/features/public-site/lib/brand-logo-shared";
import { cn } from "@/lib/utils";

const DEFAULT_HEIGHT = 40;

type BrandLockupProps = {
  href: string;
  className?: string;
  /** Footer / dark chrome — light plate behind the mark for contrast. */
  inverted?: boolean;
  /** CMS logo URL; falls back to packaged mark. */
  src?: string | null;
  /** Display height in px (28–72). */
  heightPx?: number;
};

function clampHeight(n: number | undefined): number {
  if (n == null || !Number.isFinite(n)) return DEFAULT_HEIGHT;
  return Math.min(72, Math.max(28, Math.round(n)));
}

/** Fluid-width lockup — height from CMS so it never crowds header actions. */
export function BrandLockup({
  href,
  className,
  inverted = false,
  src,
  heightPx,
}: BrandLockupProps) {
  const h = clampHeight(heightPx);
  const imageSrc = src?.trim() || FALLBACK_BRAND_ICON;
  // Wordmarks / stacked logos need horizontal room (was 2.75 — too tight).
  const maxW = Math.round(h * 4.25);

  return (
    <Link
      href={href}
      className={cn("inline-flex min-w-0 shrink items-center", className)}
      aria-label="HG Aluminium Smelters Limited home"
    >
      <span
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden",
          // Always give the mark a light plate so dark-background uploads stay legible.
          "rounded-[var(--radius-md)] bg-white px-2 py-1",
          inverted &&
            "shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.12)]",
        )}
        style={{ height: h + 8 }}
      >
        <Image
          src={imageSrc}
          alt="HG Aluminium Smelters Limited"
          width={maxW * 2}
          height={h * 2}
          priority
          className="h-full w-auto object-contain"
          style={{
            maxWidth: `min(${maxW}px, 52vw)`,
            height: h,
          }}
        />
      </span>
    </Link>
  );
}
