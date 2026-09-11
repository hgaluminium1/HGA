"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";

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
import type {
  CategoryDTO,
  ChemicalCompositionRow,
  ProductDTO,
  ProductFormType,
} from "@/modules/catalog/browser";
import { cn } from "@/lib/utils";

const inputClass =
  "h-8 w-full rounded-[6px] border border-[#d2d2d7] bg-white px-2.5 text-[13px] text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20";

const FORM_TYPES: { value: ProductFormType; label: string }[] = [
  { value: "extrusion", label: "Extrusion profiles" },
  { value: "billet", label: "Billets" },
  { value: "ingot", label: "Ingots & alloys" },
  { value: "remelt", label: "Remelt (cubes / shots)" },
  { value: "deoxidizer", label: "Deoxidizer" },
  { value: "other", label: "Other" },
];

function Field({
  label,
  children,
  className,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-1", className)}>
      <span className="text-[11px] font-medium tracking-tight text-[#86868b]">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="text-[10px] leading-snug text-[#aeaeb2]">{hint}</span>
      ) : null}
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

function csvToList(s: string) {
  return s
    .split(/[,;\n]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function listToCsv(arr: string[]) {
  return arr.join(", ");
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
  formType: ProductFormType;
  alloyGrades: string;
  tempers: string;
  surfaceFinishes: string;
  anodizingColors: string;
  ralColors: string;
  toleranceStandards: string;
  packaging: string;
  applications: string;
  highlights: string;
  chemicalComposition: ChemicalCompositionRow[];
  maxLengthMm: string;
  minLengthMm: string;
  maxWidthMm: string;
  weightPerMeterKg: string;
  typicalDiameterMm: string;
  typicalPieceWeightKg: string;
  standardsNote: string;
  moqNote: string;
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
    formType: p.formType || "other",
    alloyGrades: listToCsv(p.alloyGrades),
    tempers: listToCsv(p.tempers),
    surfaceFinishes: listToCsv(p.surfaceFinishes),
    anodizingColors: listToCsv(p.anodizingColors),
    ralColors: listToCsv(p.ralColors),
    toleranceStandards: listToCsv(p.toleranceStandards),
    packaging: listToCsv(p.packaging),
    applications: p.applications.join("\n"),
    highlights: p.highlights.join("\n"),
    chemicalComposition: p.chemicalComposition.length
      ? p.chemicalComposition.map((r) => ({ ...r }))
      : [],
    maxLengthMm: p.maxLengthMm != null ? String(p.maxLengthMm) : "",
    minLengthMm: p.minLengthMm != null ? String(p.minLengthMm) : "",
    maxWidthMm: p.maxWidthMm != null ? String(p.maxWidthMm) : "",
    weightPerMeterKg:
      p.weightPerMeterKg != null ? String(p.weightPerMeterKg) : "",
    typicalDiameterMm:
      p.typicalDiameterMm != null ? String(p.typicalDiameterMm) : "",
    typicalPieceWeightKg:
      p.typicalPieceWeightKg != null ? String(p.typicalPieceWeightKg) : "",
    standardsNote: p.standardsNote ?? "",
    moqNote: p.moqNote ?? "",
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
  formType: "other",
  alloyGrades: "",
  tempers: "",
  surfaceFinishes: "",
  anodizingColors: "",
  ralColors: "",
  toleranceStandards: "",
  packaging: "",
  applications: "",
  highlights: "",
  chemicalComposition: [],
  maxLengthMm: "",
  minLengthMm: "",
  maxWidthMm: "",
  weightPerMeterKg: "",
  typicalDiameterMm: "",
  typicalPieceWeightKg: "",
  standardsNote: "",
  moqNote: "",
});

function numOrUndef(s: string) {
  const t = s.trim();
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="col-span-full mt-2 border-t border-[#e8e8ed] pt-3 text-[11px] font-semibold tracking-tight text-[#86868b]">
      {children}
    </p>
  );
}

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

  const patch = (partial: Partial<Draft>) =>
    setDraft((d) => ({ ...d, ...partial }));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cats = await fetchCategoriesApi();
      setCategories(cats.filter((c) => !c.deletedAt));
      if (isNew) {
        const d = emptyDraft();
        setDraft(d);
        setBaseline(JSON.stringify(d));
        return;
      }
      const product = await fetchProductApi(productId);
      const d = fromProduct(product);
      setDraft(d);
      setBaseline(JSON.stringify(d));
      setVersion(product.version);
      setStatus(product.status);
      setId(product.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [isNew, productId]);

  useEffect(() => {
    void load();
  }, [load]);

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
      description: draft.description.trim() || undefined,
      categoryIds: draft.categoryId ? [draft.categoryId] : [],
      imageUrl: draft.imageUrl || undefined,
      imageMediaId: draft.imageMediaId,
      isUpcoming: draft.isUpcoming,
      formType: draft.formType,
      alloyGrades: csvToList(draft.alloyGrades),
      tempers: csvToList(draft.tempers),
      surfaceFinishes: csvToList(draft.surfaceFinishes),
      anodizingColors: csvToList(draft.anodizingColors),
      ralColors: csvToList(draft.ralColors),
      toleranceStandards: csvToList(draft.toleranceStandards),
      packaging: csvToList(draft.packaging),
      applications: draft.applications
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      highlights: draft.highlights
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      chemicalComposition: draft.chemicalComposition
        .filter((r) => r.element.trim())
        .map((r) => ({
          element: r.element.trim(),
          range: r.range.trim(),
        })),
      maxLengthMm: numOrUndef(draft.maxLengthMm),
      minLengthMm: numOrUndef(draft.minLengthMm),
      maxWidthMm: numOrUndef(draft.maxWidthMm),
      weightPerMeterKg: numOrUndef(draft.weightPerMeterKg),
      typicalDiameterMm: numOrUndef(draft.typicalDiameterMm),
      typicalPieceWeightKg: numOrUndef(draft.typicalPieceWeightKg),
      standardsNote: draft.standardsNote.trim() || undefined,
      moqNote: draft.moqNote.trim() || undefined,
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
        setMessage("Draft saved — specs sync to the public PDP.");
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
          Identity, industrial specs and chemistry — all fields sync to the
          public product page on publish.
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
          <Field label="SKU">
            <input
              className={inputClass}
              value={draft.sku}
              onChange={(e) => patch({ sku: e.target.value })}
              placeholder="Auto from slug if empty"
            />
          </Field>
          <Field label="Form type">
            <select
              className={inputClass}
              value={draft.formType}
              onChange={(e) =>
                patch({ formType: e.target.value as ProductFormType })
              }
            >
              {FORM_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
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

          <SectionLabel>Specification dictionaries (comma-separated)</SectionLabel>
          <Field label="Alloy grades" hint="e.g. 6063, 6061, ADC12">
            <input
              className={inputClass}
              value={draft.alloyGrades}
              onChange={(e) => patch({ alloyGrades: e.target.value })}
            />
          </Field>
          <Field label="Tempers" hint="e.g. T5, T6, F">
            <input
              className={inputClass}
              value={draft.tempers}
              onChange={(e) => patch({ tempers: e.target.value })}
            />
          </Field>
          <Field label="Surface finishes">
            <input
              className={inputClass}
              value={draft.surfaceFinishes}
              onChange={(e) => patch({ surfaceFinishes: e.target.value })}
              placeholder="mill, anodized, powder_coated"
            />
          </Field>
          <Field label="Anodizing colours">
            <input
              className={inputClass}
              value={draft.anodizingColors}
              onChange={(e) => patch({ anodizingColors: e.target.value })}
            />
          </Field>
          <Field label="RAL / powder colours">
            <input
              className={inputClass}
              value={draft.ralColors}
              onChange={(e) => patch({ ralColors: e.target.value })}
            />
          </Field>
          <Field label="Tolerance standards">
            <input
              className={inputClass}
              value={draft.toleranceStandards}
              onChange={(e) => patch({ toleranceStandards: e.target.value })}
              placeholder="EN, IS, ASTM"
            />
          </Field>
          <Field label="Packaging" className="sm:col-span-2">
            <input
              className={inputClass}
              value={draft.packaging}
              onChange={(e) => patch({ packaging: e.target.value })}
              placeholder="bundle, pallet, bag, crate"
            />
          </Field>

          <SectionLabel>Dimensions & supply</SectionLabel>
          <Field label="Min length (mm)">
            <input
              className={inputClass}
              inputMode="decimal"
              value={draft.minLengthMm}
              onChange={(e) => patch({ minLengthMm: e.target.value })}
            />
          </Field>
          <Field label="Max length (mm)">
            <input
              className={inputClass}
              inputMode="decimal"
              value={draft.maxLengthMm}
              onChange={(e) => patch({ maxLengthMm: e.target.value })}
            />
          </Field>
          <Field label="Max width / CCD (mm)">
            <input
              className={inputClass}
              inputMode="decimal"
              value={draft.maxWidthMm}
              onChange={(e) => patch({ maxWidthMm: e.target.value })}
            />
          </Field>
          <Field label="Typical diameter (mm)">
            <input
              className={inputClass}
              inputMode="decimal"
              value={draft.typicalDiameterMm}
              onChange={(e) => patch({ typicalDiameterMm: e.target.value })}
            />
          </Field>
          <Field label="Weight per metre (kg/m)">
            <input
              className={inputClass}
              inputMode="decimal"
              value={draft.weightPerMeterKg}
              onChange={(e) => patch({ weightPerMeterKg: e.target.value })}
            />
          </Field>
          <Field label="Typical piece weight (kg)">
            <input
              className={inputClass}
              inputMode="decimal"
              value={draft.typicalPieceWeightKg}
              onChange={(e) => patch({ typicalPieceWeightKg: e.target.value })}
            />
          </Field>
          <Field label="Standards note" className="sm:col-span-2">
            <input
              className={inputClass}
              value={draft.standardsNote}
              onChange={(e) => patch({ standardsNote: e.target.value })}
            />
          </Field>
          <Field label="MOQ / supply note" className="sm:col-span-2">
            <input
              className={inputClass}
              value={draft.moqNote}
              onChange={(e) => patch({ moqNote: e.target.value })}
            />
          </Field>

          <SectionLabel>Applications & highlights (one per line)</SectionLabel>
          <Field label="Applications" className="sm:col-span-2">
            <textarea
              className={cn(inputClass, "h-auto min-h-[64px] resize-y py-2")}
              value={draft.applications}
              onChange={(e) => patch({ applications: e.target.value })}
              rows={3}
            />
          </Field>
          <Field label="Highlights (Why HG)" className="sm:col-span-2">
            <textarea
              className={cn(inputClass, "h-auto min-h-[64px] resize-y py-2")}
              value={draft.highlights}
              onChange={(e) => patch({ highlights: e.target.value })}
              rows={3}
            />
          </Field>

          <SectionLabel>Chemical composition</SectionLabel>
          <div className="col-span-full flex flex-col gap-2">
            {draft.chemicalComposition.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_1fr_auto] gap-2 rounded-[8px] border border-[#e8e8ed] bg-[#fafafa] p-2"
              >
                <input
                  className={inputClass}
                  placeholder="Element"
                  value={row.element}
                  onChange={(e) => {
                    const next = [...draft.chemicalComposition];
                    next[i] = { ...row, element: e.target.value };
                    patch({ chemicalComposition: next });
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="Range"
                  value={row.range}
                  onChange={(e) => {
                    const next = [...draft.chemicalComposition];
                    next[i] = { ...row, range: e.target.value };
                    patch({ chemicalComposition: next });
                  }}
                />
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded text-[#ff3b30] hover:bg-[#ff3b30]/10"
                  aria-label="Remove row"
                  onClick={() =>
                    patch({
                      chemicalComposition: draft.chemicalComposition.filter(
                        (_, idx) => idx !== i,
                      ),
                    })
                  }
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              className="h-8 justify-start px-2 text-[12px] font-medium text-[#0071e3] hover:bg-[#0071e3]/08 hover:text-[#0071e3]"
              onClick={() =>
                patch({
                  chemicalComposition: [
                    ...draft.chemicalComposition,
                    { element: "", range: "" },
                  ],
                })
              }
            >
              <Plus className="size-3.5" />
              Add composition row
            </Button>
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
