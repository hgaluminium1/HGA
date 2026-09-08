"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DeskBackLink } from "@/features/admin-desk/components/desk-back-link";
import { corporateStatusTone } from "@/features/admin-desk/components/corporate-form-ui";
import { ApiClientError } from "@/features/admin-desk/lib/corporate-api";
import { cn } from "@/lib/utils";

export type CorporateEntityListProps<T> = {
  title: string;
  description: string;
  basePath: string;
  newLabel: string;
  searchPlaceholder: string;
  emptyLabel: string;
  fetchItems: (q?: string) => Promise<{ items: T[] }>;
  getId: (item: T) => string;
  getTitle: (item: T) => string;
  getSubtitle: (item: T) => string;
  getStatus: (item: T) => string;
};

export function CorporateEntityList<T>({
  title,
  description,
  basePath,
  newLabel,
  searchPlaceholder,
  emptyLabel,
  fetchItems,
  getId,
  getTitle,
  getSubtitle,
  getStatus,
}: CorporateEntityListProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchItems(query || undefined);
      setItems(data.items);
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : `Failed to load ${title}`,
      );
    } finally {
      setLoading(false);
    }
  }, [fetchItems, query, title]);

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
              {title}
            </h1>
            <p className="text-muted-foreground mt-1 text-[0.8125rem]">
              {description}
            </p>
          </div>
          <Button
            className="h-9 text-[0.8125rem]"
            render={<Link href={`${basePath}/new`} />}
          >
            <Plus className="size-3.5" />
            {newLabel}
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
            placeholder={searchPlaceholder}
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
        {items.map((item) => {
          const status = getStatus(item);
          return (
            <li key={getId(item)}>
              <Link
                href={`${basePath}/${getId(item)}`}
                className="hover:bg-black/[0.02] flex items-center gap-3 px-3.5 py-3 transition"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-[0.875rem] font-semibold">
                      {getTitle(item)}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide",
                        corporateStatusTone(status),
                      )}
                    >
                      {status}
                    </span>
                  </span>
                  <span className="text-muted-foreground mt-0.5 block truncate text-[0.75rem]">
                    {getSubtitle(item)}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
        {!loading && items.length === 0 ? (
          <li className="text-muted-foreground px-3.5 py-8 text-center text-sm">
            {emptyLabel}
          </li>
        ) : null}
      </ul>

      {loading && items.length === 0 ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : null}
    </div>
  );
}
