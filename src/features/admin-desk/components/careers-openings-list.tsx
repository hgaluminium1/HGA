"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DeskBackLink } from "@/features/admin-desk/components/desk-back-link";
import {
  ApiClientError,
  fetchOpeningsApi,
} from "@/features/admin-desk/lib/careers-api";
import type { CareerOpeningDTO } from "@/modules/careers/browser";
import { cn } from "@/lib/utils";

const DEPT_LABEL: Record<CareerOpeningDTO["department"], string> = {
  operations: "Operations",
  quality: "Quality",
  maintenance: "Maintenance",
  commercial: "Commercial",
  engineering: "Engineering",
  hr: "People & HR",
  other: "Other",
};

function statusTone(status: CareerOpeningDTO["status"]) {
  if (status === "published") return "text-teal-700 bg-teal-50";
  return "text-[#86868b] bg-[#f5f5f7]";
}

export function CareersOpeningsList() {
  const [items, setItems] = useState<CareerOpeningDTO[]>([]);
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOpeningsApi({
        q: query || undefined,
        status: "all",
      });
      setItems(data.items);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Failed to load openings",
      );
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto flex w-full max-w-[56rem] flex-col gap-4 pb-4">
      <header className="flex flex-col gap-2">
        <DeskBackLink href="/admin/pages" label="Back to pages" />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">
              Careers
            </h1>
            <p className="text-muted-foreground mt-1 text-[0.8125rem]">
              Open roles on the public careers page. Publish when ready to hire.
            </p>
          </div>
          <Button
            className="h-9 text-[0.8125rem]"
            render={<Link href="/admin/careers/new" />}
          >
            <Plus className="size-3.5" />
            New opening
          </Button>
        </div>
      </header>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(q.trim());
        }}
      >
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-[#aeaeb2]" />
          <input
            className="border-line h-9 w-full rounded-md border bg-white pr-3 pl-8 text-[0.8125rem] outline-none focus:border-[#0071e3]"
            placeholder="Search title, location…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Button type="submit" variant="outline" className="h-9 text-[0.8125rem]">
          Search
        </Button>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <ul className="divide-line border-line divide-y overflow-hidden rounded-[10px] border bg-white">
        {items.map((o) => (
          <li key={o.id}>
            <Link
              href={`/admin/careers/${o.id}`}
              className="hover:bg-black/[0.02] flex items-center gap-3 px-3.5 py-3 transition"
            >
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-[0.875rem] font-semibold">
                    {o.title}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide",
                      statusTone(o.status),
                    )}
                  >
                    {o.status}
                  </span>
                </span>
                <span className="text-muted-foreground mt-0.5 block truncate text-[0.75rem]">
                  {DEPT_LABEL[o.department]} · {o.location} · /{o.slug}
                </span>
              </span>
            </Link>
          </li>
        ))}
        {!loading && items.length === 0 ? (
          <li className="text-muted-foreground px-3.5 py-8 text-center text-sm">
            No openings yet. Create the first role.
          </li>
        ) : null}
      </ul>

      {loading && items.length === 0 ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : null}
    </div>
  );
}
