"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { CloudinaryPicker } from "@/features/admin-desk/components/cloudinary-picker";
import { DeskBackLink } from "@/features/admin-desk/components/desk-back-link";
import { DeskSaveBar } from "@/features/admin-desk/components/desk-save-bar";
import {
  ApiClientError,
  createProductApi,
  deleteProductApi,
  duplicateProductApi,
  fetchCategoriesApi,
  fetchProductApi,
  publishProductApi,
  updateProductApi,
} from "@/features/admin-desk/lib/catalog-api";
import type { CategoryDTO, ProductDTO } from "@/modules/catalog/browser";
import { cn } from "@/lib/utils";

const inputClass =
  "h-8 w-full rounded-[6px] border border-[#d2d2d7] bg-white px-2.5 text-[13px] text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-1", className)}>
      <span className="text-[11px] font-medium tracking-tight text-[#86868b]">
        {label}
      </span>
      {children}
    </label>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

type Draft = {
  sku: string;
  nameEn: string;
  slug: string;
  description: string;
  categoryId: string;
  imageUrl: string;
  imageMediaId: string | null;
  isUpcoming: boolean;
};

function fromProduct(p: ProductDTO): Draft {
  return {
    sku: p.sku,
    nameEn: p.name.en,
    slug: p.slug,
    description: p.description ?? "",
    categoryId: p.categoryIds[0] ?? "",
    imageUrl: p.imageUrl ?? "",
    imageMediaId: p.imageMediaId ?? null,
    isUpcoming: p.isUpcoming,
  };
}

const emptyDraft = (): Draft => ({
  sku: "",
  nameEn: "",
  slug: "",
  description: "",
  categoryId: "",
  imageUrl: "",
  imageMediaId: null,
  isUpcoming: false,
});

export function CatalogueProductEditor({
  productId,
}: {
  productId: string | "new";
}) {
  const router = useRouter();
  const isNew = productId === "new";
  const [id, setId] = useState<string | null>(isNew ? null : productId);
  const [version, setVersion] = useState(1);
  const [status, setStatus] = useState("draft");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [baseline, setBaseline] = useState("");
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== baseline,
    [draft, baseline],
  );

  const canPublish =
    Boolean(draft.nameEn.trim()) &&
    Boolean(draft.slug.trim()) &&
    Boolean(draft.categoryId) &&
    (draft.isUpcoming || Boolean(draft.imageUrl));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cats = await fetchCategoriesApi("flat");
      setCategories(cats.filter((c) => !c.deletedAt));
      if (!isNew && productId !== "new") {
        const p = await fetchProductApi(productId);
        const d = fromProduct(p);
        setId(p.id);
        setVersion(p.version);
        setStatus(p.status);
        setDraft(d);
        setBaseline(JSON.stringify(d));
      } else {
        const d = emptyDraft();
        setDraft(d);
        setBaseline(JSON.stringify(d));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [isNew, productId]);

  useEffect(() => {
    void load();
  }, [load]);

  function patch(partial: Partial<Draft>) {
    setDraft((d) => ({ ...d, ...partial }));
  }

  function ensureSku(slug: string, existing: string) {
    if (existing.trim()) return existing.trim();
    const base = slugify(slug) || "product";
    return `HG-${base}`.slice(0, 48).toUpperCase();
  }

  function payload() {
    const slug = draft.slug.trim();
    return {
      sku: ensureSku(slug, draft.sku),
      name: { en: draft.nameEn.trim() },
      slug,
      description: draft.description,
      categoryIds: draft.categoryId ? [draft.categoryId] : [],
      imageUrl: draft.imageUrl || undefined,
      imageMediaId: draft.imageMediaId,
      isUpcoming: draft.isUpcoming,
      seo: {},
    };
  }

  async function onSave() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      if (!id) {
        const created = await createProductApi(payload());
        setId(created.id);
        setVersion(created.version);
        setStatus(created.status);
        const d = fromProduct(created);
        setDraft(d);
        setBaseline(JSON.stringify(d));
        setMessage("Product created.");
        router.replace(`/admin/catalogue/products/${created.id}`);
      } else {
        const updated = await updateProductApi(id, {
          ...payload(),
          version,
        });
        setVersion(updated.version);
        setStatus(updated.status);
        const d = fromProduct(updated);
        setDraft(d);
        setBaseline(JSON.stringify(d));
        setMessage("Draft saved.");
      }
    } catch (err) {
      if (err instanceof ApiClientError && err.code === "CONFLICT") {
        setError("Someone else saved first. Reload and try again.");
      } else {
        setError(err instanceof Error ? err.message : "Save failed");
      }
    } finally {
      setSaving(false);
    }
  }

  async function onPublish() {
    if (!canPublish) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      let currentId = id;
      let currentVersion = version;
      if (dirty || !currentId) {
        if (!currentId) {
          const created = await createProductApi(payload());
          currentId = created.id;
          currentVersion = created.version;
          setId(created.id);
          router.replace(`/admin/catalogue/products/${created.id}`);
        } else {
          const updated = await updateProductApi(currentId, {
            ...payload(),
            version: currentVersion,
          });
          currentVersion = updated.version;
        }
      }
      const published = await publishProductApi(
        currentId!,
        "publish",
        currentVersion,
      );
      setVersion(published.version);
      setStatus(published.status);
      const d = fromProduct(published);
      setDraft(d);
      setBaseline(JSON.stringify(d));
      setMessage("Published — live on the catalogue.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground text-sm">Loading product…</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[52rem] flex-col pb-2">
      <header className="mb-4 flex flex-col gap-2">
        <DeskBackLink
          href="/admin/catalogue/products"
          label="Back to products"
        />
        <h1 className="font-display text-xl font-semibold tracking-tight">
          {isNew && !id ? "New product" : draft.nameEn || "Product"}
        </h1>
        <p className="text-muted-foreground text-[0.8125rem]">
          Name, one category, photo and short description. That’s all you need.
        </p>
      </header>

      {error && !message ? (
        <p className="mb-3 text-sm text-destructive">{error}</p>
      ) : null}

      {categories.length === 0 ? (
        <p className="mb-3 rounded-[8px] border border-dashed border-[#d2d2d7] bg-[#f5f5f7] px-3 py-2.5 text-[0.8125rem] text-[#1d1d1f]">
          Create a{" "}
          <Link
            href="/admin/catalogue/categories"
            className="font-semibold text-[#0071e3] underline"
          >
            category
          </Link>{" "}
          first, then add products under it.
        </p>
      ) : null}

      <div className="overflow-hidden rounded-[10px] border border-[#d2d2d7] bg-white">
        <div className="grid gap-2.5 p-3 sm:grid-cols-2">
          <Field label="Name">
            <input
              className={inputClass}
              value={draft.nameEn}
              onChange={(e) => {
                const nameEn = e.target.value;
                patch({
                  nameEn,
                  slug: isNew && !id ? slugify(nameEn) : draft.slug,
                });
              }}
            />
          </Field>
          <Field label="Slug">
            <input
              className={inputClass}
              value={draft.slug}
              onChange={(e) => patch({ slug: e.target.value })}
            />
          </Field>
          <Field label="Category">
            <select
              className={inputClass}
              value={draft.categoryId}
              onChange={(e) => patch({ categoryId: e.target.value })}
            >
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name.en}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Upcoming line">
            <label className="flex h-8 items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={draft.isUpcoming}
                onChange={(e) => patch({ isUpcoming: e.target.checked })}
              />
              Coming soon (pipeline)
            </label>
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea
              className={cn(inputClass, "h-auto min-h-[72px] resize-y py-2")}
              value={draft.description}
              onChange={(e) => patch({ description: e.target.value })}
              rows={3}
            />
          </Field>
          <div className="sm:col-span-2">
            <CloudinaryPicker
              kind="image"
              label="Catalogue photo"
              valueUrl={draft.imageUrl}
              onChange={({ url, mediaId }) =>
                patch({
                  imageUrl: url,
                  imageMediaId: mediaId ?? draft.imageMediaId,
                })
              }
            />
          </div>
        </div>
      </div>

      {id ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-8 text-[12px]"
            disabled={saving}
            onClick={async () => {
              try {
                const copy = await duplicateProductApi(id);
                router.push(`/admin/catalogue/products/${copy.id}`);
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Duplicate failed",
                );
              }
            }}
          >
            Duplicate
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-8 text-[12px] text-[#ff3b30]"
            disabled={saving}
            onClick={async () => {
              if (!confirm("Move this product to trash?")) return;
              try {
                await deleteProductApi(id);
                router.push("/admin/catalogue/products");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Delete failed");
              }
            }}
          >
            Trash
          </Button>
          <Link
            href={`/en/products/${draft.slug}`}
            target="_blank"
            className="text-[12px] font-semibold text-[#0071e3] hover:underline"
          >
            Open public page →
          </Link>
        </div>
      ) : null}

      <DeskSaveBar
        saving={saving}
        dirty={dirty || isNew}
        canPublish={canPublish}
        publishBlockedReason={
          !canPublish
            ? !draft.categoryId
              ? "Pick a category first."
              : draft.isUpcoming
                ? "Name and slug are required."
                : "Present products need name, slug, category and a photo."
            : undefined
        }
        statusLabel={status}
        previewHref={draft.slug ? `/en/products/${draft.slug}` : undefined}
        onSave={() => void onSave()}
        onPublish={() => void onPublish()}
        message={message}
        error={error}
      />
    </div>
  );
}
