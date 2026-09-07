"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  SaveBar,
  StatusBadge,
} from "@/features/admin-pages/components/save-bar";
import {
  ApiClientError,
  duplicateProductApi,
  fetchCategoriesFlat,
  fetchDictionaries,
  fetchProduct,
  publishProductApi,
  updateProductApi,
} from "@/features/admin-catalog/lib/api";
import { MediaPicker } from "@/features/admin-media";

function MultiSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <fieldset className="border-line rounded-[var(--radius-md)] border p-3">
      <legend className="px-1 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            No options — add them under Dictionaries.
          </p>
        ) : null}
        {options.map((opt) => {
          const checked = value.includes(opt.value);
          return (
            <label
              key={opt.value}
              className="border-line inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border px-3 text-sm"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  onChange(
                    checked
                      ? value.filter((v) => v !== opt.value)
                      : [...value, opt.value],
                  );
                }}
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ProductEditor({ productId }: { productId: string }) {
  const qc = useQueryClient();
  const productQuery = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
  });
  const dictQuery = useQuery({
    queryKey: ["dictionaries"],
    queryFn: fetchDictionaries,
  });
  const catsQuery = useQuery({
    queryKey: ["categories", "flat"],
    queryFn: () => fetchCategoriesFlat(),
  });

  const [tab, setTab] = useState<"basic" | "specs" | "seo" | "publishing">(
    "basic",
  );
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [alloyGrades, setAlloyGrades] = useState<string[]>([]);
  const [tempers, setTempers] = useState<string[]>([]);
  const [surfaceFinishes, setSurfaceFinishes] = useState<string[]>([]);
  const [anodizingColors, setAnodizingColors] = useState<string[]>([]);
  const [ralColors, setRalColors] = useState<string[]>([]);
  const [toleranceStandards, setToleranceStandards] = useState<string[]>([]);
  const [packaging, setPackaging] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageMediaId, setImageMediaId] = useState<string | null>(null);
  const [drawingMediaIds, setDrawingMediaIds] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"image" | "drawing">("image");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [version, setVersion] = useState(1);
  const [baseline, setBaseline] = useState("");

  useEffect(() => {
    if (!productQuery.data) return;
    const p = productQuery.data;
    setName(p.name.en);
    setSku(p.sku);
    setSlug(p.slug);
    setCategoryIds(p.categoryIds);
    setAlloyGrades(p.alloyGrades);
    setTempers(p.tempers);
    setSurfaceFinishes(p.surfaceFinishes);
    setAnodizingColors(p.anodizingColors);
    setRalColors(p.ralColors);
    setToleranceStandards(p.toleranceStandards);
    setPackaging(p.packaging);
    setDescription(p.description ?? "");
    setImageUrl(p.imageUrl ?? "");
    setImageMediaId(p.imageMediaId ?? null);
    setDrawingMediaIds(p.drawingMediaIds ?? []);
    setSeoTitle(p.seo?.title ?? "");
    setSeoDescription(p.seo?.description ?? "");
    setIsUpcoming(Boolean(p.isUpcoming));
    setVersion(p.version);
    setBaseline(
      JSON.stringify({
        name: p.name.en,
        sku: p.sku,
        slug: p.slug,
        categoryIds: p.categoryIds,
        alloyGrades: p.alloyGrades,
        tempers: p.tempers,
        surfaceFinishes: p.surfaceFinishes,
        anodizingColors: p.anodizingColors,
        ralColors: p.ralColors,
        toleranceStandards: p.toleranceStandards,
        packaging: p.packaging,
        description: p.description ?? "",
        imageUrl: p.imageUrl ?? "",
        imageMediaId: p.imageMediaId ?? null,
        drawingMediaIds: p.drawingMediaIds ?? [],
        seoTitle: p.seo?.title ?? "",
        seoDescription: p.seo?.description ?? "",
        isUpcoming: Boolean(p.isUpcoming),
      }),
    );
  }, [productQuery.data]);

  const current = useMemo(
    () =>
      JSON.stringify({
        name,
        sku,
        slug,
        categoryIds,
        alloyGrades,
        tempers,
        surfaceFinishes,
        anodizingColors,
        ralColors,
        toleranceStandards,
        packaging,
        description,
        imageUrl,
        imageMediaId,
        drawingMediaIds,
        seoTitle,
        seoDescription,
        isUpcoming,
      }),
    [
      name,
      sku,
      slug,
      categoryIds,
      alloyGrades,
      tempers,
      surfaceFinishes,
      anodizingColors,
      ralColors,
      toleranceStandards,
      packaging,
      description,
      imageUrl,
      imageMediaId,
      drawingMediaIds,
      seoTitle,
      seoDescription,
      isUpcoming,
    ],
  );
  const dirty = Boolean(baseline) && current !== baseline;

  const dictOpts = (key: string) =>
    (dictQuery.data?.items.find((d) => d.key === key)?.items ?? [])
      .filter((i) => i.active)
      .map((i) => ({ value: i.value, label: i.label.en }));

  const saveMut = useMutation({
    mutationFn: () =>
      updateProductApi(productId, {
        name: { en: name },
        sku,
        slug,
        categoryIds,
        alloyGrades,
        tempers,
        surfaceFinishes,
        anodizingColors,
        ralColors,
        toleranceStandards,
        packaging,
        description,
        imageUrl: imageUrl || null,
        imageMediaId,
        drawingMediaIds,
        seo: { title: seoTitle, description: seoDescription },
        isUpcoming,
        version,
      }),
    onSuccess: (p) => {
      setVersion(p.version);
      void qc.invalidateQueries({ queryKey: ["product", productId] });
      void qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      if (err instanceof ApiClientError && err.status === 409) {
        alert(err.message);
        void productQuery.refetch();
      }
    },
  });

  const publishMut = useMutation({
    mutationFn: (action: "publish" | "unpublish") =>
      publishProductApi(productId, version, action),
    onSuccess: (p) => {
      setVersion(p.version);
      void qc.invalidateQueries({ queryKey: ["product", productId] });
    },
    onError: (err) => {
      if (err instanceof ApiClientError && err.status === 409) {
        alert(err.message);
        void productQuery.refetch();
      }
    },
  });

  const [scheduleAt, setScheduleAt] = useState("");
  const scheduleMut = useMutation({
    mutationFn: () =>
      updateProductApi(productId, {
        status: "scheduled",
        scheduledPublishAt: new Date(scheduleAt).toISOString(),
        version,
      }),
    onSuccess: (p) => {
      setVersion(p.version);
      void qc.invalidateQueries({ queryKey: ["product", productId] });
      void qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      if (err instanceof ApiClientError && err.status === 409) {
        alert(err.message);
        void productQuery.refetch();
      }
    },
  });

  const dupMut = useMutation({
    mutationFn: () => duplicateProductApi(productId),
    onSuccess: (p) => {
      window.location.href = `/admin/products/${p.id}`;
    },
  });

  if (productQuery.isLoading) {
    return <p className="text-muted-foreground text-sm">Loading…</p>;
  }
  if (!productQuery.data) {
    return <p className="text-sm text-destructive">Product not found</p>;
  }

  const product = productQuery.data;

  return (
    <div>
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold">{name}</h1>
            <StatusBadge
              status={product.status === "published" ? "published" : "draft"}
            />
          </div>
          <p className="text-muted-foreground text-sm">{sku}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          onClick={() => dupMut.mutate()}
        >
          Duplicate
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-[var(--color-line)] pb-2">
        {(
          [
            ["basic", "Basic"],
            ["specs", "Specs"],
            ["seo", "SEO"],
            ["publishing", "Publishing"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`min-h-11 rounded-[var(--radius-md)] px-3 text-sm font-medium ${
              tab === id ? "bg-brand/10 text-brand" : ""
            }`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "basic" ? (
        <div className="mt-6 grid max-w-xl gap-4">
          <label className="text-sm font-medium">
            Name
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="text-sm font-medium">
            SKU
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </label>
          <label className="text-sm font-medium">
            Slug
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </label>
          <fieldset className="border-line rounded-[var(--radius-md)] border p-3">
            <legend className="px-1 text-sm font-medium">Categories</legend>
            <div className="flex flex-wrap gap-2">
              {(catsQuery.data?.items ?? []).map((c) => (
                <label
                  key={c.id}
                  className="inline-flex min-h-11 items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(c.id)}
                    onChange={() =>
                      setCategoryIds((prev) =>
                        prev.includes(c.id)
                          ? prev.filter((x) => x !== c.id)
                          : [...prev, c.id],
                      )
                    }
                  />
                  {c.name.en}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="text-sm font-medium">
            Description
            <textarea
              className="border-line mt-1 min-h-28 w-full rounded-[var(--radius-md)] border px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <div className="border-line space-y-2 rounded-[var(--radius-md)] border p-3">
            <p className="text-sm font-medium">Product image</p>
            <p className="text-muted-foreground break-all text-xs">
              {imageUrl || "No image selected"}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                onClick={() => {
                  setPickerMode("image");
                  setPickerOpen(true);
                }}
              >
                Pick from media
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="min-h-11"
                onClick={() => {
                  setImageUrl("");
                  setImageMediaId(null);
                }}
              >
                Clear
              </Button>
            </div>
            <p className="text-sm font-medium">Profile drawings</p>
            <p className="text-muted-foreground text-xs">
              {drawingMediaIds.length
                ? `${drawingMediaIds.length} drawing(s)`
                : "None"}
            </p>
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={() => {
                setPickerMode("drawing");
                setPickerOpen(true);
              }}
            >
              Add drawing
            </Button>
          </div>
        </div>
      ) : null}

      {tab === "specs" ? (
        <div className="mt-6 grid max-w-3xl gap-4">
          <MultiSelect
            label="Alloy grades"
            options={dictOpts("alloy_grade")}
            value={alloyGrades}
            onChange={setAlloyGrades}
          />
          <MultiSelect
            label="Tempers"
            options={dictOpts("temper")}
            value={tempers}
            onChange={setTempers}
          />
          <MultiSelect
            label="Surface finishes"
            options={dictOpts("surface_finish")}
            value={surfaceFinishes}
            onChange={setSurfaceFinishes}
          />
          <MultiSelect
            label="Anodizing colors"
            options={dictOpts("anodizing_color")}
            value={anodizingColors}
            onChange={setAnodizingColors}
          />
          <MultiSelect
            label="RAL colors"
            options={dictOpts("ral_color")}
            value={ralColors}
            onChange={setRalColors}
          />
          <MultiSelect
            label="Tolerance standards"
            options={dictOpts("tolerance_standard")}
            value={toleranceStandards}
            onChange={setToleranceStandards}
          />
          <MultiSelect
            label="Packaging"
            options={dictOpts("packaging")}
            value={packaging}
            onChange={setPackaging}
          />
        </div>
      ) : null}

      {tab === "seo" ? (
        <div className="mt-6 grid max-w-xl gap-4">
          <label className="text-sm font-medium">
            SEO title
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />
          </label>
          <label className="text-sm font-medium">
            SEO description
            <textarea
              className="border-line mt-1 min-h-24 w-full rounded-[var(--radius-md)] border px-3 py-2"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />
          </label>
        </div>
      ) : null}

      {tab === "publishing" ? (
        <div className="mt-6 max-w-xl space-y-4">
          <p className="text-sm">
            Status: {product.status}
            {product.scheduledPublishAt ? (
              <span className="text-muted-foreground ml-2 text-xs">
                due {new Date(product.scheduledPublishAt).toLocaleString()}
              </span>
            ) : null}
          </p>
          <label className="border-line flex min-h-11 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border px-3">
            <input
              type="checkbox"
              checked={isUpcoming}
              onChange={(e) => setIsUpcoming(e.target.checked)}
            />
            <span className="text-sm">
              Upcoming product — shows in “Coming soon”, not main catalogue
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="min-h-11"
              disabled={product.status === "published"}
              onClick={() => {
                if (confirm("Publish this product?")) {
                  publishMut.mutate("publish");
                }
              }}
            >
              Publish
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              disabled={product.status === "draft"}
              onClick={() => {
                if (confirm("Unpublish?")) publishMut.mutate("unpublish");
              }}
            >
              Unpublish
            </Button>
          </div>
          <label className="block text-sm font-medium">
            Schedule publish at
            <input
              type="datetime-local"
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={scheduleAt}
              onChange={(e) => setScheduleAt(e.target.value)}
            />
          </label>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            disabled={!scheduleAt || scheduleMut.isPending}
            onClick={() => scheduleMut.mutate()}
          >
            Schedule
          </Button>
        </div>
      ) : null}

      <SaveBar
        dirty={dirty}
        saving={saveMut.isPending}
        onSave={() => saveMut.mutate()}
        onDiscard={() => {
          if (!dirty || confirm("Discard unsaved changes?")) {
            void productQuery.refetch();
          }
        }}
        extra={
          saveMut.isError ? (
            <span className="text-sm text-destructive">
              {(saveMut.error as Error).message}
            </span>
          ) : null
        }
      />

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        kind={pickerMode === "drawing" ? "profile_drawing" : undefined}
        onSelect={(media) => {
          if (pickerMode === "image") {
            setImageUrl(media.url);
            setImageMediaId(media.id);
          } else {
            setDrawingMediaIds((prev) =>
              prev.includes(media.id) ? prev : [...prev, media.id],
            );
          }
        }}
      />
    </div>
  );
}
