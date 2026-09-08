"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchPages } from "@/features/admin-desk/lib/api";
import { PAGE_TEMPLATES } from "@/modules/cms/browser";

export function PagesList() {
  const [statusBySlug, setStatusBySlug] = useState<Record<string, string>>({});

  useEffect(() => {
    void (async () => {
      try {
        const { items } = await fetchPages();
        const map: Record<string, string> = {};
        for (const p of items) {
          if (!p.deletedAt) map[p.slug] = p.status;
        }
        setStatusBySlug(map);
      } catch {
        // Templates still list without live status
      }
    })();
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[52rem] flex-col gap-4">
      <header>
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Pages
        </h1>
        <p className="text-muted-foreground mt-1 max-w-prose text-[0.8125rem] leading-snug">
          Pick a page, then edit one section at a time. Section types are fixed —
          you only change the content.
        </p>
      </header>

      <ul className="divide-line border-line divide-y overflow-hidden rounded-lg border">
        {PAGE_TEMPLATES.map((page) => (
          <li key={page.slug}>
            <Link
              href={`/admin/pages/${page.slug}`}
              className="bg-surface hover:bg-black/[0.02] flex items-start justify-between gap-3 px-3.5 py-3 transition"
            >
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-semibold">{page.label}</p>
                <p className="text-muted-foreground mt-0.5 text-[0.75rem] leading-snug">
                  {page.description}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-muted-foreground text-[0.6875rem] font-semibold uppercase tracking-wide">
                  {statusBySlug[page.slug] ?? "—"}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[0.6875rem]">
                  {page.mode === "sections"
                    ? `${page.sections.length} sections`
                    : "Company data"}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
