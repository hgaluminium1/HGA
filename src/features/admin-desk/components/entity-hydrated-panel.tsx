"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { BlockType } from "@/modules/cms/browser";
import { cn } from "@/lib/utils";

function primaryFor(
  slug?: string,
  blockType?: BlockType,
): { href: string; label: string } | null {
  if (blockType === "leadership-grid") {
    return { href: "/admin/corporate/people", label: "Edit people" };
  }
  if (blockType === "stats") {
    return { href: "/admin/corporate/capacity", label: "Edit capacity" };
  }
  if (blockType === "cert-grid") {
    return {
      href: "/admin/corporate/certifications",
      label: "Edit certifications",
    };
  }
  if (blockType === "sustainability-metrics") {
    return {
      href: "/admin/corporate/sustainability",
      label: "Edit sustainability",
    };
  }
  if (blockType === "expansion-roadmap") {
    return { href: "/admin/corporate/expansion", label: "Edit expansion" };
  }
  if (blockType === "company-facts") {
    return { href: "/admin/corporate/company", label: "Edit company profile" };
  }
  if (blockType === "customers") {
    return { href: "/admin/corporate/logos", label: "Edit customer logos" };
  }
  if (blockType === "testimonials") {
    return {
      href: "/admin/corporate/testimonials",
      label: "Edit testimonials",
    };
  }
  if (blockType === "products" || blockType === "upcoming-products") {
    return { href: "/admin/catalogue/products", label: "Edit products" };
  }

  if (slug === "leadership" || slug === "chairmans-message") {
    return { href: "/admin/corporate/people", label: "Edit people" };
  }
  if (slug === "capacity") {
    return { href: "/admin/corporate/capacity", label: "Edit capacity" };
  }
  if (slug === "customers") {
    return { href: "/admin/corporate/logos", label: "Edit customer logos" };
  }
  if (slug === "expansion") {
    return { href: "/admin/corporate/expansion", label: "Edit expansion" };
  }
  if (slug === "contact") {
    return { href: "/admin/corporate/company", label: "Edit company profile" };
  }
  if (slug === "careers") {
    return { href: "/admin/careers", label: "Edit open roles" };
  }
  if (slug === "sustainability") {
    return {
      href: "/admin/corporate/sustainability",
      label: "Edit sustainability",
    };
  }

  return null;
}

export function EntityHydratedPanel({
  title,
  help,
  slug,
  blockType,
}: {
  title: string;
  help: string;
  slug?: string;
  blockType?: BlockType;
}) {
  const primary = primaryFor(slug, blockType);

  return (
    <div className="border-line bg-surface rounded-lg border border-dashed p-4">
      <p className="text-[0.9375rem] font-semibold">{title}</p>
      <p className="text-muted-foreground mt-1.5 max-w-prose text-[0.8125rem] leading-snug">
        {help}
      </p>
      <p className="text-muted-foreground mt-3 text-[0.8125rem] leading-snug">
        This section fills itself from company or catalogue records. Edit the
        source data below — then publish this page if you changed layout copy
        elsewhere.
      </p>

      {primary ? (
        <Link
          href={primary.href}
          className={cn(
            buttonVariants({ variant: "default" }),
            "mt-4 inline-flex min-h-9",
          )}
        >
          {primary.label}
        </Link>
      ) : null}
    </div>
  );
}
