import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandLockupProps = {
  href: string;
  className?: string;
  inverted?: boolean;
};

export function BrandLockup({
  href,
  className,
  inverted = false,
}: BrandLockupProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex shrink-0 items-center gap-2.5", className)}
      aria-label="HG Aluminium Smelters home"
    >
      <span
        className={cn(
          "flex size-[42px] shrink-0 items-center justify-center rounded-xl shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.08)]",
          inverted
            ? "bg-white/12"
            : "bg-linear-to-br from-violet-700 to-ink",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6"
          aria-hidden
        >
          <path d="M4 19V6l4 3V6l4 3V6l4 3V6l4 3v10z" />
        </svg>
      </span>
      <span className="font-display leading-none">
        <strong
          className={cn(
            "block text-[1.18rem] font-bold tracking-tight",
            inverted ? "text-on-dark" : "text-ink",
          )}
        >
          HG Aluminium
        </strong>
        <span
          className={cn(
            "mt-0.5 block text-[0.62rem] font-bold tracking-[0.12em] uppercase",
            inverted ? "text-gold" : "text-brand-accent",
          )}
        >
          Smelters Ltd.
        </span>
      </span>
    </Link>
  );
}
