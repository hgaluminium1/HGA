"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { MediaPicker } from "@/features/admin-media/components/media-picker";
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
  const [description, setDescription] = useState(node.description?.en ?? "");
  const [imageUrl, setImageUrl] = useState(node.imageUrl ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [childName, setChildName] = useState("");
  const qc = useQueryClient();

  const saveMut = useMutation({
    mutationFn: () =>
      updateCategoryApi(node.id, {
        name: { en: name },
        description: { en: description },
        imageUrl: imageUrl || null,
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

  const publishMut = useMutation({
    mutationFn: (status: "published" | "draft") =>
      updateCategoryApi(node.id, { status, version: node.version }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["categories"] });
      onRefresh();
    },
    onError: (err) => alert((err as Error).message),
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
        {node.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={node.imageUrl}
            alt=""
            className="size-10 rounded-[var(--radius-sm)] object-cover"
          />
        ) : (
          <span className="bg-bg-alt size-10 rounded-[var(--radius-sm)]" />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-ink">{node.name.en}</p>
          <p className="text-muted-foreground text-xs">/{node.slug}</p>
        </div>
        <StatusBadge
          status={node.status === "published" ? "published" : "draft"}
        />
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          onClick={() => {
            setName(node.name.en);
            setDescription(node.description?.en ?? "");
            setImageUrl(node.imageUrl ?? "");
            setEditing((v) => !v);
          }}
        >
          {editing ? "Close" : "Edit"}
        </Button>
        {node.status === "published" ? (
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            disabled={publishMut.isPending}
            onClick={() => publishMut.mutate("draft")}
          >
            Unpublish
          </Button>
        ) : (
          <Button
            type="button"
            className="min-h-11"
            disabled={publishMut.isPending}
            onClick={() => publishMut.mutate("published")}
          >
            Publish
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

      {editing ? (
        <div
          className="border-line bg-bg-alt mb-3 space-y-3 rounded-[var(--radius-md)] border p-4"
          style={{ marginLeft: `${depth * 16 + 8}px`, marginRight: 8 }}
        >
          <p className="text-muted-foreground text-xs">
            Description and image appear on category landing pages. Photos from
            Media (R2).
          </p>
          <label className="block text-sm font-medium">
            Name
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium">
            Description
            <textarea
              className="border-line mt-1 min-h-20 w-full rounded-[var(--radius-md)] border px-2 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <label className="block min-w-0 flex-1 text-sm font-medium">
              Image URL
              <input
                className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-2 text-sm"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </label>
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={() => setPickerOpen(true)}
            >
              Choose media
            </Button>
          </div>
          <Button
            type="button"
            className="min-h-11"
            disabled={saveMut.isPending}
            onClick={() => saveMut.mutate()}
          >
            Save category
          </Button>
          <MediaPicker
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            kind="image"
            onSelect={(m) => setImageUrl(m.url)}
          />
        </div>
      ) : null}

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
        Publish categories, add descriptions and R2 images — landings and
        catalogue use this data. No JSON required.
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
            Create a root category, then Publish when ready for the public site.
          </p>
          <Button
            type="button"
            className="mt-4 min-h-11"
            onClick={() => setCreating(true)}
          >
            Create root category
          </Button>
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
