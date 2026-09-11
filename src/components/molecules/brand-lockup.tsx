import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const FALLBACK_LOGO = "/HGLogo.jpeg";
const DEFAULT_HEIGHT = 40;

type BrandLockupProps = {
  href: string;
  className?: string;
  /** Footer / dark chrome — light plate behind the mark for contrast. */
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
  inverted = false,
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
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden",
          inverted &&
            "rounded-[var(--radius-md)] bg-white px-2 py-1 shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.12)]",
        )}
        style={{ height: inverted ? h + 8 : h }}
      >
        <Image
          src={imageSrc}
          alt=""
          width={maxW * 2}
          height={h * 2}
          priority
          className="h-full w-auto object-contain"
          style={{
            maxWidth: `min(${maxW}px, 46vw)`,
            height: inverted ? h : "100%",
          }}
        />
      </span>
    </Link>
  );
}
