"use client";

import Link from "next/link";

import { DeskBackLink } from "@/features/admin-desk/components/desk-back-link";
import { isEntityHydratedBlock } from "@/features/admin-desk/lib/section-kinds";
import { getPageTemplate } from "@/modules/cms/browser";

export function PageSectionsList({ slug }: { slug: string }) {
  const template = getPageTemplate(slug);

  if (!template) {
    return (
      <div className="max-w-[52rem]">
        <DeskBackLink href="/admin/pages" label="Back to pages" />
        <p className="mt-3 text-sm text-destructive">Unknown page: {slug}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[52rem] flex-col gap-4">
      <header className="flex flex-col gap-2">
        <DeskBackLink href="/admin/pages" label="Back to pages" />
        <p className="text-muted-foreground text-[0.6875rem] font-semibold tracking-wide uppercase">
          <Link href="/admin/pages" className="hover:underline">
            Pages
          </Link>
        </p>
        <h1 className="font-display text-xl font-semibold tracking-tight">
          {template.label}
        </h1>
        <p className="text-muted-foreground max-w-prose text-[0.8125rem] leading-snug">
          {template.description} Open a section in the list below — or use the
          sidebar while editing.
        </p>
      </header>

      {template.mode === "entity" || template.sections.length === 0 ? (
        <div className="border-line rounded-lg border border-dashed p-4">
          <p className="text-[0.9375rem] font-semibold">Company data page</p>
          <p className="text-muted-foreground mt-1.5 text-[0.8125rem] leading-snug">
            This page is filled from company records.{" "}
            <Link
              href={`/admin/pages/${slug}/overview`}
              className="font-semibold underline"
            >
              Open overview
            </Link>{" "}
            to publish the page document.
          </p>
        </div>
      ) : (
        <ul className="divide-line border-line divide-y overflow-hidden rounded-lg border">
          {template.sections.map((section, index) => {
            const entity = isEntityHydratedBlock(section.type);
            return (
              <li key={section.id}>
                <Link
                  href={`/admin/pages/${slug}/${section.id}`}
                  className="bg-surface hover:bg-black/[0.02] flex items-start gap-3 px-3.5 py-3 transition"
                >
                  <span className="text-muted-foreground mt-0.5 w-5 shrink-0 text-[0.6875rem] font-semibold tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-[0.9375rem] font-semibold">
                        {section.title}
                      </p>
                      <span className="text-muted-foreground text-[0.625rem] font-semibold uppercase tracking-wide">
                        {entity ? "Auto" : "Edit"}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-[0.75rem] leading-snug">
                      {section.help}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
