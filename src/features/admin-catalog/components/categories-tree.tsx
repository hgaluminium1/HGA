"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/features/admin-pages/components/save-bar";
import { categoriesConfig } from "@/config/categories.config";
import type { CategoryDTO } from "@/modules/catalog/browser";
import {
  ApiClientError,
  createCategoryApi,
  deleteCategoryApi,
  fetchCategoryTree,
  updateCategoryApi,
} from "@/features/admin-catalog/lib/api";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function CategoryNode({
  node,
  depth,
  onRefresh,
}: {
  node: CategoryDTO;
  depth: number;
  onRefresh: () => void;
}) {
  const [open, setOpen] = useState(depth < 1);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(node.name.en);
  const [adding, setAdding] = useState(false);
  const [childName, setChildName] = useState("");
  const qc = useQueryClient();

  const saveMut = useMutation({
    mutationFn: () =>
      updateCategoryApi(node.id, {
        name: { en: name },
        version: node.version,
      }),
    onSuccess: () => {
      setEditing(false);
      void qc.invalidateQueries({ queryKey: ["categories"] });
      onRefresh();
    },
    onError: (err) => {
      if (err instanceof ApiClientError && err.status === 409) {
        alert(err.message);
        void qc.invalidateQueries({ queryKey: ["categories"] });
      }
    },
  });

  const addMut = useMutation({
    mutationFn: () =>
      createCategoryApi({
        name: { en: childName },
        slug: slugify(childName),
        parentId: node.id,
        status: "draft",
      }),
    onSuccess: () => {
      setAdding(false);
      setChildName("");
      setOpen(true);
      void qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const delMut = useMutation({
    mutationFn: () => deleteCategoryApi(node.id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["categories"] }),
    onError: (err) => alert((err as Error).message),
  });

  const warnDeep = depth + 1 >= categoriesConfig.softMaxLevel;

  return (
    <li className="border-line border-b last:border-b-0">
      <div
        className="flex flex-wrap items-center gap-2 py-3"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {(node.children?.length ?? 0) > 0 ? (
          <button
            type="button"
            className="min-h-11 min-w-11 text-sm"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "▾" : "▸"}
          </button>
        ) : (
          <span className="min-w-11" />
        )}
        {editing ? (
          <input
            className="border-line min-h-11 flex-1 rounded-[var(--radius-md)] border px-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <div className="min-w-0 flex-1">
            <p className="font-medium text-ink">{node.name.en}</p>
            <p className="text-muted-foreground text-xs">/{node.slug}</p>
          </div>
        )}
        <StatusBadge
          status={node.status === "published" ? "published" : "draft"}
        />
        {editing ? (
          <Button
            type="button"
            className="min-h-11"
            onClick={() => saveMut.mutate()}
          >
            Save
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          onClick={() => setAdding((v) => !v)}
        >
          Add subcategory
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="min-h-11"
          onClick={() => {
            if (confirm(`Delete “${node.name.en}”?`)) delMut.mutate();
          }}
        >
          Delete
        </Button>
      </div>
      {warnDeep && adding ? (
        <p className="text-amber-700 px-4 pb-2 text-xs">
          Soft max depth ({categoriesConfig.softMaxLevel}) reached — still
          allowed, but keep trees shallow if possible.
        </p>
      ) : null}
      {adding ? (
        <div
          className="flex flex-wrap gap-2 pb-3"
          style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
        >
          <input
            className="border-line min-h-11 flex-1 rounded-[var(--radius-md)] border px-2 text-sm"
            placeholder="Subcategory name"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
          />
          <Button
            type="button"
            className="min-h-11"
            disabled={!childName || addMut.isPending}
            onClick={() => addMut.mutate()}
          >
            Create
          </Button>
        </div>
      ) : null}
      {open && node.children?.length ? (
        <ul>
          {node.children.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onRefresh={onRefresh}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function CategoriesTree() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["categories", "tree"],
    queryFn: fetchCategoryTree,
  });
  const [creating, setCreating] = useState(false);
  const [rootName, setRootName] = useState("");

  const createMut = useMutation({
    mutationFn: () =>
      createCategoryApi({
        name: { en: rootName },
        slug: slugify(rootName),
        parentId: null,
        status: "draft",
      }),
    onSuccess: () => {
      setCreating(false);
      setRootName("");
      void qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Categories
        </h1>
        <Button
          type="button"
          className="ml-auto min-h-11"
          onClick={() => setCreating(true)}
        >
          Create root category
        </Button>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        N-level tree — expand rows to manage subcategories.
      </p>

      {creating ? (
        <div className="border-line bg-surface mt-4 flex max-w-lg flex-wrap gap-2 rounded-[var(--radius-lg)] border p-4">
          <input
            className="border-line min-h-11 flex-1 rounded-[var(--radius-md)] border px-3"
            placeholder="Category name"
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
          />
          <Button
            type="button"
            className="min-h-11"
            disabled={!rootName || createMut.isPending}
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
      ) : null}

      {query.isLoading ? (
        <p className="text-muted-foreground mt-8 text-sm">Loading…</p>
      ) : null}
      {query.data && query.data.tree.length === 0 ? (
        <div className="border-line mt-8 rounded-[var(--radius-lg)] border border-dashed p-8 text-center">
          <p className="font-medium">No categories yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Create a root category or run npm run seed:categories.
          </p>
        </div>
      ) : null}

      <ul className="border-line bg-surface mt-6 overflow-hidden rounded-[var(--radius-lg)] border">
        {query.data?.tree.map((node) => (
          <CategoryNode
            key={node.id}
            node={node}
            depth={0}
            onRefresh={() => void query.refetch()}
          />
        ))}
      </ul>
    </div>
  );
}
