import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandLockupProps = {
  href: string;
  className?: string;
  inverted?: boolean;
};

/** Fixed-height lockup — width is fluid so it never crowds actions on narrow screens. */
export function BrandLockup({
  href,
  className,
  inverted = false,
}: BrandLockupProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex min-w-0 shrink items-center", className)}
      aria-label="HG Aluminium Smelters Limited home"
    >
      <span
        className={cn(
          "relative inline-flex h-10 items-center justify-center overflow-hidden bg-white min-[400px]:h-11",
          inverted
            ? "rounded-[var(--radius-md)] px-2 py-1 shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.12)]"
            : "rounded-sm",
        )}
      >
        <Image
          src="/HGLogo.jpeg"
          alt=""
          width={603}
          height={619}
          priority
          className="h-full w-auto max-w-[min(9.5rem,46vw)] object-contain min-[400px]:max-w-[min(11rem,42vw)]"
        />
      </span>
    </Link>
  );
}
