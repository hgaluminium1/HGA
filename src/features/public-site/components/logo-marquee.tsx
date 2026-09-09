"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

export type LogoMarqueeItem = {
  id?: string;
  name: string;
  imageUrl?: string | null;
};

type LogoMarqueeProps = {
  items: LogoMarqueeItem[];
  className?: string;
  /** Seconds for one full loop. Stripe/Linear pace ≈ 40–55s. */
  durationSec?: number;
};

/**
 * Professional logo marquee — Apple / Stripe / Linear pattern:
 * infinite dual-track CSS scroll, pause on hover/focus, reduced-motion → static wrap.
 * Prefer logo image when present; otherwise restrained typography name.
 */
export function LogoMarquee({
  items,
  className,
  durationSec = 48,
}: LogoMarqueeProps) {
  if (!items.length) return null;

  // Duplicate once for seamless -50% translate loop.
  const track = [...items, ...items];

  return (
    <div
      className={cn(
        "logo-marquee group/marquee relative -mx-[var(--pad-inline)] overflow-hidden",
        className,
      )}
      role="region"
      aria-label="Customer logos"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg-alt to-transparent min-[720px]:w-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg-alt to-transparent min-[720px]:w-20"
        aria-hidden
      />

      <ul
        className="logo-marquee__track flex w-max items-center gap-10 py-2 min-[720px]:gap-14"
        style={{ ["--marquee-duration" as string]: `${durationSec}s` }}
      >
        {track.map((item, i) => {
          const key = `${item.id ?? item.name}-${i}`;
          const src = item.imageUrl?.trim();
          return (
            <li
              key={key}
              className="flex h-14 w-[9.5rem] shrink-0 items-center justify-center min-[720px]:h-16 min-[720px]:w-[11rem]"
              aria-hidden={i >= items.length}
            >
              {src ? (
                <span className="relative block h-9 w-full min-[720px]:h-10">
                  <Image
                    src={src}
                    alt={i < items.length ? item.name : ""}
                    fill
                    className="object-contain opacity-55 grayscale transition-[opacity,filter] duration-300 group-hover/marquee:opacity-70 hover:!opacity-100 hover:!grayscale-0"
                    sizes="11rem"
                  />
                </span>
              ) : (
                <span className="font-display max-w-full truncate px-1 text-center text-[0.8125rem] font-semibold tracking-[-0.01em] text-ink/40 transition-colors duration-300 hover:text-ink/80 min-[720px]:text-[0.875rem]">
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
