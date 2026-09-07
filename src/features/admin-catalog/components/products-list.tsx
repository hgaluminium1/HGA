"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/features/admin-pages/components/save-bar";
import {
  createProductApi,
  deleteProductApi,
  fetchProducts,
} from "@/features/admin-catalog/lib/api";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ProductsList() {
  const router = useRouter();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");

  const query = useQuery({
    queryKey: ["products", q],
    queryFn: () => fetchProducts({ q: q || undefined }),
  });

  const createMut = useMutation({
    mutationFn: () =>
      createProductApi({
        name: { en: name },
        sku: sku || slugify(name).toUpperCase(),
        slug: slugify(name),
      }),
    onSuccess: (product) => {
      void qc.invalidateQueries({ queryKey: ["products"] });
      router.push(`/admin/products/${product.id}`);
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["products"] }),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Products
        </h1>
        <div className="ml-auto flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="border-line bg-surface min-h-11 min-w-[200px] rounded-[var(--radius-md)] border px-3 text-sm"
          />
          <Button
            type="button"
            className="min-h-11"
            onClick={() => setCreating(true)}
          >
            Create product
          </Button>
        </div>
      </div>

      {creating ? (
        <div className="border-line bg-surface mt-6 max-w-lg space-y-3 rounded-[var(--radius-lg)] border p-4">
          <label className="block text-sm font-medium">
            Name
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!sku) setSku(slugify(e.target.value).toUpperCase());
              }}
            />
          </label>
          <label className="block text-sm font-medium">
            SKU
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              className="min-h-11"
              disabled={!name || createMut.isPending}
              onClick={() => createMut.mutate()}
            >
              Create
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={() => setCreating(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {query.isLoading ? (
        <p className="text-muted-foreground mt-8 text-sm">Loading…</p>
      ) : null}

      {query.data && query.data.items.length === 0 ? (
        <div className="border-line mt-8 rounded-[var(--radius-lg)] border border-dashed p-8 text-center">
          <p className="font-medium">No products yet</p>
          <Button
            type="button"
            className="mt-4 min-h-11"
            onClick={() => setCreating(true)}
          >
            Create product
          </Button>
        </div>
      ) : null}

      <ul className="mt-6 space-y-3 md:hidden">
        {query.data?.items.map((p) => (
          <li
            key={p.id}
            className="border-line bg-surface rounded-[var(--radius-lg)] border p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link
                  href={`/admin/products/${p.id}`}
                  className="font-semibold hover:underline"
                >
                  {p.name.en}
                </Link>
                <p className="text-muted-foreground text-xs">{p.sku}</p>
              </div>
              <StatusBadge
                status={p.status === "published" ? "published" : "draft"}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              className="mt-2 min-h-11"
              onClick={() => {
                if (confirm(`Delete “${p.name.en}”?`)) deleteMut.mutate(p.id);
              }}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>

      <div className="border-line bg-surface mt-6 hidden overflow-hidden rounded-[var(--radius-lg)] border md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {query.data?.items.map((p) => (
              <tr key={p.id} className="border-line border-t">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="font-medium hover:underline"
                  >
                    {p.name.en}
                  </Link>
                </td>
                <td className="text-muted-foreground px-4 py-3">{p.sku}</td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={p.status === "published" ? "published" : "draft"}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-11"
                      render={<Link href={`/admin/products/${p.id}`} />}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-11"
                      onClick={() => {
                        if (confirm(`Delete “${p.name.en}”?`)) {
                          deleteMut.mutate(p.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
