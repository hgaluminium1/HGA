"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PAGE_EDIT_DESTINATION } from "@/features/admin-desk/lib/page-edit-destinations";
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
          Open any page to edit what visitors see. Some pages open a section
          list; others open people, metrics, or roles directly.
        </p>
      </header>

      <ul className="divide-line border-line divide-y overflow-hidden rounded-lg border">
        {PAGE_TEMPLATES.map((page) => {
          const dest = PAGE_EDIT_DESTINATION[page.slug];
          const href = dest?.href ?? `/admin/pages/${page.slug}`;
          return (
            <li key={page.slug}>
              <Link
                href={href}
                className="bg-surface hover:bg-black/[0.02] flex items-start justify-between gap-3 px-3.5 py-3 transition"
              >
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-semibold">{page.label}</p>
                  <p className="text-muted-foreground mt-0.5 text-[0.75rem] leading-snug">
                    {page.description}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[0.6875rem] font-semibold text-[#0071e3]">
                    {dest?.label ?? "Edit sections"}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-[0.6875rem] uppercase tracking-wide">
                    {statusBySlug[page.slug] ?? "—"}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
