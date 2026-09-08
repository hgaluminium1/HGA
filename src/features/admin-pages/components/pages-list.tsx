"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/features/admin-pages/components/save-bar";
import { createPageApi, fetchPages } from "@/features/admin-pages/lib/api";
import {
  PAGE_TEMPLATES,
  defaultBlockData,
  type BlockType,
  type PageDTO,
} from "@/modules/cms/browser";

export function PagesList() {
  const router = useRouter();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [ensuring, setEnsuring] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["pages"],
    queryFn: () => fetchPages({}),
  });

  const bySlug = useMemo(() => {
    const map = new Map<string, PageDTO>();
    for (const page of query.data?.items ?? []) {
      map.set(page.slug, page);
    }
    return map;
  }, [query.data]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PAGE_TEMPLATES.filter(
      (t) =>
        !term ||
        t.label.toLowerCase().includes(term) ||
        t.slug.toLowerCase().includes(term),
    );
  }, [q]);

  const ensureMut = useMutation({
    mutationFn: async (slug: string) => {
      const existing = bySlug.get(slug);
      if (existing) return existing;
      const template = PAGE_TEMPLATES.find((t) => t.slug === slug);
      if (!template) throw new Error("Unknown template");
      setEnsuring(slug);
      return createPageApi({
        title: template.label,
        slug: template.slug,
        locale: "en",
        seo: { title: template.label, description: template.description },
        blocks: template.sections.map((s, order) => ({
          id: s.id,
          type: s.type as BlockType,
          order,
          appearance: "default",
          data: defaultBlockData(s.type),
        })),
      });
    },
    onSuccess: (page) => {
      setEnsuring(null);
      void qc.invalidateQueries({ queryKey: ["pages"] });
      router.push(`/admin/pages/${page.id}`);
    },
    onError: (err) => {
      setEnsuring(null);
      setToast((err as Error).message);
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Website pages
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Fixed templates — open a page to edit section content. New URLs need
            a developer.
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter pages…"
          className="border-line bg-surface min-h-11 min-w-[200px] rounded-[var(--radius-md)] border px-3 text-sm"
        />
      </div>

      {toast ? (
        <p className="mt-4 text-sm text-destructive">{toast}</p>
      ) : null}

      {query.isLoading ? (
        <p className="text-muted-foreground mt-8 text-sm">Loading…</p>
      ) : null}

      <ul className="mt-6 space-y-2">
        {filtered.map((template) => {
          const page = bySlug.get(template.slug);
          return (
            <li
              key={template.slug}
              className="border-line bg-surface flex flex-wrap items-center gap-3 rounded-[var(--radius-lg)] border p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{template.label}</p>
                <p className="text-muted-foreground text-xs">
                  /{template.slug || "(home)"} · {template.description}
                </p>
              </div>
              {page ? (
                <StatusBadge status={page.status} />
              ) : (
                <span className="text-muted-foreground text-xs">
                  Not created
                </span>
              )}
              {page ? (
                <Link
                  href={`/admin/pages/${page.id}`}
                  className="border-line hover:border-brand-blue hover:text-brand-blue inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold"
                >
                  Edit
                </Link>
              ) : (
                <Button
                  type="button"
                  className="min-h-11"
                  disabled={ensuring === template.slug || ensureMut.isPending}
                  onClick={() => ensureMut.mutate(template.slug)}
                >
                  {ensuring === template.slug ? "Creating…" : "Create & edit"}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
