"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/features/admin-pages/components/save-bar";
import {
  createPageApi,
  deletePageApi,
  fetchPages,
} from "@/features/admin-pages/lib/api";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PagesList() {
  const router = useRouter();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["pages", q],
    queryFn: () => fetchPages({ q: q || undefined }),
  });

  const createMut = useMutation({
    mutationFn: createPageApi,
    onSuccess: (page) => {
      void qc.invalidateQueries({ queryKey: ["pages"] });
      router.push(`/admin/pages/${page.id}`);
    },
  });

  const deleteMut = useMutation({
    mutationFn: deletePageApi,
    onSuccess: (page) => {
      void qc.invalidateQueries({ queryKey: ["pages"] });
      setToast(`“${page.title}” moved to Trash`);
      const id = page.id;
      const t = window.setTimeout(() => setToast(null), 10_000);
      // expose undo via restore in toast
      (window as unknown as { __undoDelete?: () => void }).__undoDelete = () => {
        window.clearTimeout(t);
        void fetch(`/api/v1/pages/${id}/trash`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "restore" }),
        }).then(() => {
          void qc.invalidateQueries({ queryKey: ["pages"] });
          setToast(null);
        });
      };
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Pages</h1>
        <div className="ml-auto flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pages…"
            className="border-line bg-surface min-h-11 min-w-[200px] rounded-[var(--radius-md)] border px-3 text-sm"
          />
          <Button
            type="button"
            className="min-h-11"
            onClick={() => setCreating(true)}
          >
            Create page
          </Button>
        </div>
      </div>

      {creating ? (
        <div className="border-line bg-surface mt-6 max-w-lg rounded-[var(--radius-lg)] border p-4">
          <h2 className="text-sm font-semibold">New page</h2>
          <label className="mt-3 block text-sm">
            Title
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(slugify(e.target.value));
              }}
            />
          </label>
          <label className="mt-3 block text-sm">
            Slug
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </label>
          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              className="min-h-11"
              disabled={!title || createMut.isPending}
              onClick={() =>
                createMut.mutate({ title, slug, locale: "en" })
              }
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
          {createMut.isError ? (
            <p className="mt-2 text-sm text-destructive">
              {(createMut.error as Error).message}
            </p>
          ) : null}
        </div>
      ) : null}

      {query.isLoading ? (
        <p className="text-muted-foreground mt-8 text-sm">Loading pages…</p>
      ) : null}
      {query.isError ? (
        <p className="mt-8 text-sm text-destructive">
          {(query.error as Error).message}
        </p>
      ) : null}

      {query.data && query.data.items.length === 0 ? (
        <div className="border-line mt-10 rounded-[var(--radius-lg)] border border-dashed p-10 text-center">
          <p className="font-medium text-ink">No pages yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Create a page to start editing sections.
          </p>
          <Button
            type="button"
            className="mt-4 min-h-11"
            onClick={() => setCreating(true)}
          >
            Create page
          </Button>
        </div>
      ) : null}

      <ul className="mt-6 space-y-3 md:hidden">
        {query.data?.items.map((page) => (
          <li
            key={page.id}
            className="border-line bg-surface rounded-[var(--radius-lg)] border p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link
                  href={`/admin/pages/${page.id}`}
                  className="font-semibold text-ink underline-offset-2 hover:underline"
                >
                  {page.title}
                </Link>
                <p className="text-muted-foreground text-xs">/{page.slug || "home"}</p>
              </div>
              <StatusBadge status={page.status} />
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                render={<Link href={`/admin/pages/${page.id}`} />}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="min-h-11"
                onClick={() => {
                  if (confirm(`Move “${page.title}” to Trash?`)) {
                    deleteMut.mutate(page.id);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-line bg-surface mt-6 hidden overflow-hidden rounded-[var(--radius-lg)] border md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {query.data?.items.map((page) => (
              <tr key={page.id} className="border-line border-t">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="font-medium text-ink hover:underline"
                  >
                    {page.title}
                  </Link>
                </td>
                <td className="text-muted-foreground px-4 py-3">
                  /{page.slug || "home"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={page.status} />
                </td>
                <td className="text-muted-foreground px-4 py-3">
                  {new Date(page.updatedAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="min-h-11"
                      render={<Link href={`/admin/pages/${page.id}`} />}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="min-h-11"
                      onClick={() => {
                        if (confirm(`Move “${page.title}” to Trash?`)) {
                          deleteMut.mutate(page.id);
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

      {toast ? (
        <div className="bg-ink text-on-dark fixed right-4 bottom-4 z-50 flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-sm shadow-lg">
          <span>{toast}</span>
          <button
            type="button"
            className="underline"
            onClick={() =>
              (
                window as unknown as { __undoDelete?: () => void }
              ).__undoDelete?.()
            }
          >
            Undo
          </button>
        </div>
      ) : null}
    </div>
  );
}
