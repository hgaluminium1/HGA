"use client";

import Link from "next/link";

import { DeskBackLink } from "@/features/admin-desk/components/desk-back-link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SOURCES = [
  {
    href: "/admin/corporate/logos",
    title: "Customer logos",
    body: "Names shown in the logo strip on the Customers page and Home.",
  },
  {
    href: "/admin/corporate/case-studies",
    title: "Case studies",
    body: "Project stories that appear under customer proof.",
  },
  {
    href: "/admin/corporate/testimonials",
    title: "Testimonials",
    body: "Quotes shown on the Customers page and Home testimonial band.",
  },
] as const;

/**
 * Composite page hub — Customers is filled from three data sources.
 */
export function CustomersSourcesHub() {
  return (
    <div className="mx-auto flex w-full max-w-[52rem] flex-col gap-4">
      <header className="flex flex-col gap-2">
        <DeskBackLink href="/admin/pages" label="Back to pages" />
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Customers — edit sources
        </h1>
        <p className="text-muted-foreground max-w-prose text-[0.8125rem] leading-snug">
          The public Customers page combines logos, case studies and
          testimonials. Edit each source below, then check{" "}
          <Link href="/en/customers" className="font-semibold underline" target="_blank">
            /customers
          </Link>
          .
        </p>
      </header>

      <ul className="divide-line border-line divide-y overflow-hidden rounded-lg border">
        {SOURCES.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="bg-surface hover:bg-black/[0.02] flex items-start justify-between gap-3 px-3.5 py-3 transition"
            >
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-semibold">{s.title}</p>
                <p className="text-muted-foreground mt-0.5 text-[0.75rem] leading-snug">
                  {s.body}
                </p>
              </div>
              <span className="shrink-0 text-[0.6875rem] font-semibold text-[#0071e3]">
                Open →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/en/customers"
        target="_blank"
        className={cn(buttonVariants({ variant: "outline" }), "self-start")}
      >
        Preview public page
      </Link>
    </div>
  );
}
