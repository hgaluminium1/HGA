import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const FALLBACK_LOGO = "/HGLogo.jpeg";
const DEFAULT_HEIGHT = 40;

type BrandLockupProps = {
  href: string;
  className?: string;
  /** Kept for callers; no longer forces a white plate (transparent PNG-safe). */
  inverted?: boolean;
  /** CMS logo URL; falls back to packaged mark. */
  src?: string | null;
  /** Display height in px (28–64). */
  heightPx?: number;
};

function clampHeight(n: number | undefined): number {
  if (n == null || !Number.isFinite(n)) return DEFAULT_HEIGHT;
  return Math.min(64, Math.max(28, Math.round(n)));
}

/** Fluid-width lockup — height from CMS so it never crowds header actions. */
export function BrandLockup({
  href,
  className,
  src,
  heightPx,
}: BrandLockupProps) {
  const h = clampHeight(heightPx);
  const imageSrc = src?.trim() || FALLBACK_LOGO;
  const maxW = Math.round(h * 2.75);

  return (
    <Link
      href={href}
      className={cn("inline-flex min-w-0 shrink items-center", className)}
      aria-label="HG Aluminium Smelters Limited home"
    >
      <span
        className="relative inline-flex items-center justify-center overflow-hidden"
        style={{ height: h }}
      >
        <Image
          src={imageSrc}
          alt=""
          width={maxW * 2}
          height={h * 2}
          priority
          className="h-full w-auto object-contain"
          style={{ maxWidth: `min(${maxW}px, 46vw)` }}
        />
      </span>
    </Link>
  );
}
