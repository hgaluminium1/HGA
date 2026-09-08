"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DeskBackLink } from "@/features/admin-desk/components/desk-back-link";
import {
  ApiClientError,
  fetchCategoriesApi,
  fetchProductsApi,
} from "@/features/admin-desk/lib/catalog-api";
import type { CategoryDTO, ProductDTO } from "@/modules/catalog/browser";
import { cn } from "@/lib/utils";

function statusTone(status: ProductDTO["status"]) {
  if (status === "published") return "text-teal-700 bg-teal-50";
  if (status === "scheduled") return "text-amber-700 bg-amber-50";
  return "text-[#86868b] bg-[#f5f5f7]";
}

export function CatalogueProductsList() {
  const [items, setItems] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (opts?: { reset?: boolean; cursor?: string | null }) => {
    setLoading(true);
    setError(null);
    try {
      const [data, cats] = await Promise.all([
        fetchProductsApi({
          q: query || undefined,
          cursor: opts?.reset ? undefined : opts?.cursor,
          limit: 40,
        }),
        opts?.reset || !opts?.cursor
          ? fetchCategoriesApi("flat").catch(() => [])
          : Promise.resolve(null),
      ]);
      if (cats) setCategories(cats.filter((c) => !c.deletedAt));
      setItems((prev) =>
        opts?.reset || !opts?.cursor ? data.items : [...prev, ...data.items],
      );
      setCursor(data.nextCursor);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Failed to load products",
      );
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void load({ reset: true });
  }, [load]);

  const categoryName = (ids: string[]) => {
    const id = ids[0];
    if (!id) return "No category";
    return categories.find((c) => c.id === id)?.name.en ?? "Category";
  };

  return (
    <div className="mx-auto flex w-full max-w-[56rem] flex-col gap-4 pb-4">
      <header className="flex flex-col gap-2">
        <DeskBackLink href="/admin/pages" label="Back to pages" />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">
              Products
            </h1>
            <p className="text-muted-foreground mt-1 text-[0.8125rem]">
              Each product belongs to one category. Create categories first,
              then add products under them.
            </p>
          </div>
          <Button
            className="h-9 text-[0.8125rem]"
            render={<Link href="/admin/catalogue/products/new" />}
          >
            <Plus className="size-3.5" />
            New product
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
            placeholder="Search name, SKU, slug…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Button type="submit" variant="outline" className="h-9 text-[0.8125rem]">
          Search
        </Button>
      </form>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      <ul className="divide-line border-line divide-y overflow-hidden rounded-[10px] border bg-white">
        {items.map((p) => (
          <li key={p.id}>
            <Link
              href={`/admin/catalogue/products/${p.id}`}
              className="hover:bg-black/[0.02] flex items-center gap-3 px-3.5 py-3 transition"
            >
              <span className="bg-bg-alt relative size-11 shrink-0 overflow-hidden rounded-[6px] ring-1 ring-black/[0.06]">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-[0.875rem] font-semibold">
                    {p.name.en}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide",
                      statusTone(p.status),
                    )}
                  >
                    {p.status}
                  </span>
                  {p.isUpcoming ? (
                    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-ink/60">
                      Upcoming
                    </span>
                  ) : null}
                </span>
                <span className="text-muted-foreground mt-0.5 block truncate text-[0.75rem]">
                  {categoryName(p.categoryIds)}
                  {p.isUpcoming ? " · Upcoming" : ""}
                </span>
              </span>
            </Link>
          </li>
        ))}
        {!loading && items.length === 0 ? (
          <li className="text-muted-foreground px-3.5 py-8 text-center text-sm">
            No products yet. Create the first catalogue line.
          </li>
        ) : null}
      </ul>

      {cursor ? (
        <Button
          type="button"
          variant="outline"
          className="h-9 self-center text-[0.8125rem]"
          disabled={loading}
          onClick={() => void load({ cursor })}
        >
          {loading ? "Loading…" : "Load more"}
        </Button>
      ) : null}
      {loading && items.length === 0 ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : null}
    </div>
  );
}
