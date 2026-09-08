"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

/** Primary escape hatch for desk section / page editors. */
export function DeskBackLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-muted-foreground hover:text-foreground inline-flex h-8 w-fit items-center gap-1.5 rounded-md px-1.5 text-[0.8125rem] font-semibold tracking-tight transition-colors hover:bg-black/[0.04]",
        className,
      )}
    >
      <ArrowLeft className="size-3.5 stroke-[2.25]" aria-hidden />
      {label}
    </Link>
  );
}
