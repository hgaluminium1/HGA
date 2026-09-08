import Image from "next/image";
import Link from "next/link";

import { Eyebrow } from "@/components/atoms/eyebrow";
import { Reveal } from "@/components/atoms/reveal";
import { localePath } from "@/config/nav.config";
import { cn } from "@/lib/utils";

/** Apple-like section intro — one job, fluid type, tight measure. */
export function SectionIntro({
  eyebrow,
  title,
  body,
  className,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-[40rem]", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-fs-h2 mt-2.5 text-balance">{title}</h2>
      {body ? (
        <p className="text-fs-lead text-muted-foreground mt-3.5 max-w-[48ch]">
          {body}
        </p>
      ) : null}
    </Reveal>
  );
}

/**
 * Fluid split — intrinsic columns via auto-fit, not device breakpoints.
 * Uses container queries so the same component behaves in any parent width.
 */
export function FluidSplit({
  children,
  className,
  reverse,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={cn(
        "corp-split @container grid items-center gap-[clamp(1.5rem,4vw,3.5rem)]",
        reverse && "corp-split--reverse",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Intrinsic auto-fit metric / tile grid — scales continuously. */
export function FluidAutoGrid({
  children,
  min = "15rem",
  className,
}: {
  children: React.ReactNode;
  min?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("grid gap-[clamp(1rem,2.5vw,1.75rem)]", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}), 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

export function MetricCell({
  label,
  value,
  unit,
  note,
  featured,
}: {
  label: string;
  value: string;
  unit?: string;
  note?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-t-2 pt-4",
        featured ? "border-brand-red/70" : "border-brand-blue/60",
      )}
    >
      <p className="text-muted-foreground text-[0.8125rem] leading-snug">
        {label}
      </p>
      <p
        className={cn(
          "font-display mt-2 font-semibold tracking-tight text-ink",
          featured
            ? "text-[clamp(2.25rem,1.6rem+2.2vw,3.75rem)]"
            : "text-[clamp(1.45rem,1.15rem+1vw,2.1rem)]",
        )}
      >
        {value}
        {unit ? (
          <span className="text-muted-foreground ml-1.5 text-[0.45em] font-normal">
            {unit}
          </span>
        ) : null}
      </p>
      {note ? (
        <p className="text-text-faint mt-2.5 text-[0.75rem] leading-relaxed">
          {note}
        </p>
      ) : null}
    </div>
  );
}

export function PillarList({
  items,
}: {
  items: ReadonlyArray<{ title: string; body: string }>;
}) {
  return (
    <ul className="mt-8 space-y-[clamp(1.1rem,2vw,1.5rem)]">
      {items.map((item) => (
        <li key={item.title}>
          <p className="font-semibold text-ink">{item.title}</p>
          <p className="text-muted-foreground mt-1 text-[0.9375rem] leading-relaxed">
            {item.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function MediaFrame({
  src,
  alt,
  aspect = "aspect-[16/10]",
  className,
  priority,
}: {
  src: string;
  alt: string;
  aspect?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] bg-bg-alt ring-1 ring-black/[0.06]",
        aspect,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 900px) 42vw, 100vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}

export function TextLinkRow({
  locale,
  href,
  label,
}: {
  locale: string;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={localePath(locale, href)}
      className="text-brand-blue inline-flex items-center gap-1 text-[0.875rem] font-semibold hover:underline"
    >
      {label}
      <span aria-hidden>→</span>
    </Link>
  );
}

export function NumberedRail({
  items,
}: {
  items: ReadonlyArray<{ title: string; body: string }>;
}) {
  return (
    <ol className="space-y-0">
      {items.map((item, i) => (
        <li
          key={item.title}
          className="grid grid-cols-[auto_1fr] gap-x-4 border-b border-black/[0.08] py-[clamp(1.1rem,2.2vw,1.5rem)] last:border-b-0"
        >
          <span className="text-brand-blue pt-0.5 text-[0.8125rem] font-bold tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="font-semibold text-ink">{item.title}</p>
            <p className="text-muted-foreground mt-1 text-[0.9375rem] leading-relaxed">
              {item.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
