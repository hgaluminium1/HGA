"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CloudinaryPicker } from "@/features/admin-desk/components/cloudinary-picker";
import { DeskBackLink } from "@/features/admin-desk/components/desk-back-link";
import {
  ApiClientError,
  createCategoryApi,
  deleteCategoryApi,
  fetchCategoriesApi,
  updateCategoryApi,
} from "@/features/admin-desk/lib/catalog-api";
import type { CategoryDTO } from "@/modules/catalog/browser";
import { cn } from "@/lib/utils";

const inputClass =
  "h-8 w-full rounded-[6px] border border-[#d2d2d7] bg-white px-2.5 text-[13px] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function CatalogueCategoriesPanel() {
  const [items, setItems] = useState<CategoryDTO[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [version, setVersion] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategoriesApi("flat");
      setItems(data.filter((c) => !c.deletedAt).sort((a, b) => a.order - b.order));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function select(c: CategoryDTO) {
    setCreating(false);
    setSelectedId(c.id);
    setName(c.name.en);
    setSlug(c.slug);
    setDescription(c.description?.en ?? "");
    setImageUrl(c.imageUrl ?? "");
    setStatus(c.status === "published" ? "published" : "draft");
    setVersion(c.version);
    setMessage(null);
    setError(null);
  }

  function startCreate() {
    setCreating(true);
    setSelectedId(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setStatus("draft");
    setVersion(1);
    setMessage(null);
    setError(null);
  }

  async function onSave() {
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      if (creating || !selectedId) {
        const created = await createCategoryApi({
          name: { en: name.trim() },
          slug: slug.trim(),
          parentId: null,
          description: { en: description },
          imageUrl: imageUrl || undefined,
          status,
        });
        setMessage("Category created.");
        await load();
        select(created);
      } else {
        const updated = await updateCategoryApi(selectedId, {
          name: { en: name.trim() },
          slug: slug.trim(),
          description: { en: description },
          imageUrl: imageUrl || undefined,
          status,
          version,
        });
        setMessage("Saved.");
        setVersion(updated.version);
        await load();
      }
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Save failed",
      );
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!selectedId || creating) return;
    if (!confirm("Delete this category? Products in it may block deletion."))
      return;
    setSaving(true);
    try {
      await deleteCategoryApi(selectedId);
      setSelectedId(null);
      setCreating(false);
      setMessage("Deleted.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[64rem] flex-col gap-4 pb-4">
      <header className="flex flex-col gap-2">
        <DeskBackLink href="/admin/pages" label="Back to pages" />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">
              Categories
            </h1>
            <p className="text-muted-foreground mt-1 text-[0.8125rem]">
              Flat list only. Each category can hold many products — no nested
              folders.
            </p>
          </div>
          <Button className="h-9 text-[0.8125rem]" onClick={startCreate}>
            <Plus className="size-3.5" />
            New category
          </Button>
        </div>
      </header>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? <p className="text-sm text-teal-700">{message}</p> : null}

      <div className="grid gap-4 min-[900px]:grid-cols-[1fr_1.1fr]">
        <div className="border-line overflow-hidden rounded-[10px] border bg-white">
          {loading ? (
            <p className="text-muted-foreground p-4 text-sm">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground p-4 text-sm">
              No categories yet. Create one, then add products under it.
            </p>
          ) : (
            <ul className="divide-line divide-y">
              {items.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={cn(
                      "hover:bg-black/[0.02] flex w-full items-center gap-2 px-3 py-2.5 text-left text-[0.8125rem]",
                      selectedId === c.id && !creating && "bg-[#0071e3]/06",
                    )}
                    onClick={() => select(c)}
                  >
                    <span className="min-w-0 flex-1 truncate font-semibold">
                      {c.name.en}
                    </span>
                    <span className="text-[0.625rem] font-semibold uppercase tracking-wide text-[#aeaeb2]">
                      {c.status}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-line rounded-[10px] border bg-white p-3">
          {creating || selectedId ? (
            <div className="flex flex-col gap-2.5">
              <p className="text-[11px] font-semibold tracking-wide text-[#86868b] uppercase">
                {creating ? "New category" : "Edit category"}
              </p>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-[#86868b]">Name</span>
                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (creating) setSlug(slugify(e.target.value));
                  }}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-[#86868b]">Slug</span>
                <input
                  className={inputClass}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-[#86868b]">Description</span>
                <textarea
                  className={cn(inputClass, "h-auto min-h-[64px] py-2")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </label>
              <CloudinaryPicker
                kind="image"
                label="Image"
                valueUrl={imageUrl}
                onChange={({ url }) => setImageUrl(url)}
              />
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-[#86868b]">Status</span>
                <select
                  className={inputClass}
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "draft" | "published")
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="h-8 text-[12px]"
                  disabled={saving}
                  onClick={() => void onSave()}
                >
                  {saving ? "Saving…" : "Save"}
                </Button>
                {!creating && selectedId ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 text-[12px] text-[#ff3b30]"
                    disabled={saving}
                    onClick={() => void onDelete()}
                  >
                    Delete
                  </Button>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Select a category or create a new one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
