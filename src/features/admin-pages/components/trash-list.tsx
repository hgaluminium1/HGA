"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  fetchPages,
  purgePageApi,
  restorePageApi,
} from "@/features/admin-pages/lib/api";
import {
  fetchCategoriesFlat,
  fetchProducts,
  purgeCategoryApi,
  purgeProductApi,
  restoreCategoryApi,
  restoreProductApi,
} from "@/features/admin-catalog/lib/api";

type Tab = "pages" | "products" | "categories";

export function TrashList() {
  const { data: session } = useSession();
  const canPurge = session?.user?.role === "superadmin";
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("pages");

  const pagesQuery = useQuery({
    queryKey: ["pages", "trash"],
    queryFn: () => fetchPages({ trash: true }),
    enabled: tab === "pages",
  });
  const productsQuery = useQuery({
    queryKey: ["products", "trash"],
    queryFn: () => fetchProducts({ trash: true }),
    enabled: tab === "products",
  });
  const categoriesQuery = useQuery({
    queryKey: ["categories", "trash"],
    queryFn: () => fetchCategoriesFlat({ trash: true }),
    enabled: tab === "categories",
  });

  const restorePageMut = useMutation({
    mutationFn: restorePageApi,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["pages"] }),
  });
  const purgePageMut = useMutation({
    mutationFn: purgePageApi,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["pages"] }),
  });
  const restoreProductMut = useMutation({
    mutationFn: restoreProductApi,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["products"] }),
  });
  const purgeProductMut = useMutation({
    mutationFn: purgeProductApi,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["products"] }),
  });
  const restoreCategoryMut = useMutation({
    mutationFn: restoreCategoryApi,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["categories"] }),
  });
  const purgeCategoryMut = useMutation({
    mutationFn: purgeCategoryApi,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Trash</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Restore soft-deleted items. Permanent purge is limited to superadmin.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            ["pages", "Pages"],
            ["products", "Products"],
            ["categories", "Categories"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`min-h-11 rounded-[var(--radius-md)] px-3 text-sm font-medium ${
              tab === id ? "bg-brand/10 text-brand" : "border-line border"
            }`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "pages" ? (
        <>
          {pagesQuery.isLoading ? (
            <p className="text-muted-foreground mt-8 text-sm">Loading…</p>
          ) : null}
          {pagesQuery.data?.items.length === 0 ? (
            <p className="text-muted-foreground mt-8 text-sm">No pages in trash</p>
          ) : null}
          <ul className="mt-6 space-y-3">
            {pagesQuery.data?.items.map((page) => (
              <li
                key={page.id}
                className="border-line bg-surface flex flex-wrap items-center gap-3 rounded-[var(--radius-lg)] border p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{page.title}</p>
                  <p className="text-muted-foreground text-xs">/{page.slug}</p>
                </div>
                <Button
                  type="button"
                  className="min-h-11"
                  onClick={() => restorePageMut.mutate(page.id)}
                >
                  Restore
                </Button>
                {canPurge ? (
                  <Button
                    type="button"
                    variant="destructive"
                    className="min-h-11"
                    onClick={() => {
                      if (confirm(`Permanently delete “${page.title}”?`)) {
                        purgePageMut.mutate(page.id);
                      }
                    }}
                  >
                    Purge
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {tab === "products" ? (
        <>
          {productsQuery.isLoading ? (
            <p className="text-muted-foreground mt-8 text-sm">Loading…</p>
          ) : null}
          {productsQuery.data?.items.length === 0 ? (
            <p className="text-muted-foreground mt-8 text-sm">
              No products in trash
            </p>
          ) : null}
          <ul className="mt-6 space-y-3">
            {productsQuery.data?.items.map((p) => (
              <li
                key={p.id}
                className="border-line bg-surface flex flex-wrap items-center gap-3 rounded-[var(--radius-lg)] border p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{p.name.en}</p>
                  <p className="text-muted-foreground text-xs">{p.sku}</p>
                </div>
                <Button
                  type="button"
                  className="min-h-11"
                  onClick={() => restoreProductMut.mutate(p.id)}
                >
                  Restore
                </Button>
                {canPurge ? (
                  <Button
                    type="button"
                    variant="destructive"
                    className="min-h-11"
                    onClick={() => {
                      if (confirm(`Permanently delete “${p.name.en}”?`)) {
                        purgeProductMut.mutate(p.id);
                      }
                    }}
                  >
                    Purge
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {tab === "categories" ? (
        <>
          {categoriesQuery.isLoading ? (
            <p className="text-muted-foreground mt-8 text-sm">Loading…</p>
          ) : null}
          {categoriesQuery.data?.items.length === 0 ? (
            <p className="text-muted-foreground mt-8 text-sm">
              No categories in trash
            </p>
          ) : null}
          <ul className="mt-6 space-y-3">
            {categoriesQuery.data?.items.map((c) => (
              <li
                key={c.id}
                className="border-line bg-surface flex flex-wrap items-center gap-3 rounded-[var(--radius-lg)] border p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{c.name.en}</p>
                  <p className="text-muted-foreground text-xs">/{c.slug}</p>
                </div>
                <Button
                  type="button"
                  className="min-h-11"
                  onClick={() => restoreCategoryMut.mutate(c.id)}
                >
                  Restore
                </Button>
                {canPurge ? (
                  <Button
                    type="button"
                    variant="destructive"
                    className="min-h-11"
                    onClick={() => {
                      if (confirm(`Permanently delete “${c.name.en}”?`)) {
                        purgeCategoryMut.mutate(c.id);
                      }
                    }}
                  >
                    Purge
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
