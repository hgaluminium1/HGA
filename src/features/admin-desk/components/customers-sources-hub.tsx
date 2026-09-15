"use client";

import Link from "next/link";

import { DeskBackLink } from "@/features/admin-desk/components/desk-back-link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SOURCES = [
  {
    href: "/admin/corporate/logos",
    title: "Customer logos",
    body: "Shared logo strip on Customers and Home.",
  },
  {
    href: "/admin/corporate/case-studies",
    title: "Case studies",
    body: "Project stories on the Customers page.",
  },
  {
    href: "/admin/corporate/testimonials",
    title: "Testimonials",
    body: "Shared quotes on Customers and the Home testimonial band.",
  },
  {
    href: "/admin/pages/home/customers",
    title: "Home customers headlines",
    body: "Eyebrow / title / description for the Home logo band only.",
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
          Logos, case studies and testimonials are shared across Home and the
          public Customers page. Edit each source once — Home section headlines
          stay under Pages → Home.
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
