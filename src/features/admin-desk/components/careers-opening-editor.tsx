"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { DeskBackLink } from "@/features/admin-desk/components/desk-back-link";
import { DeskSaveBar } from "@/features/admin-desk/components/desk-save-bar";
import {
  ApiClientError,
  createOpeningApi,
  deleteOpeningApi,
  fetchOpeningApi,
  publishOpeningApi,
  updateOpeningApi,
} from "@/features/admin-desk/lib/careers-api";
import {
  CAREER_DEPARTMENTS,
  CAREER_EMPLOYMENT_TYPES,
  type CareerDepartment,
  type CareerEmploymentType,
  type CareerOpeningDTO,
} from "@/modules/careers/browser";
import { cn } from "@/lib/utils";

const inputClass =
  "h-8 w-full rounded-[6px] border border-[#d2d2d7] bg-white px-2.5 text-[13px] text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20";

const DEPT_LABEL: Record<CareerDepartment, string> = {
  operations: "Operations",
  quality: "Quality",
  maintenance: "Maintenance",
  commercial: "Commercial",
  engineering: "Engineering",
  hr: "People & HR",
  other: "Other",
};

const TYPE_LABEL: Record<CareerEmploymentType, string> = {
  full_time: "Full-time",
  contract: "Contract",
  internship: "Internship",
};

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
  title: string;
  slug: string;
  department: CareerDepartment;
  location: string;
  employmentType: CareerEmploymentType;
  summary: string;
  description: string;
  applyEmail: string;
  sortOrder: number;
};

function fromOpening(o: CareerOpeningDTO): Draft {
  return {
    title: o.title,
    slug: o.slug,
    department: o.department,
    location: o.location,
    employmentType: o.employmentType,
    summary: o.summary,
    description: o.description,
    applyEmail: o.applyEmail ?? "",
    sortOrder: o.sortOrder,
  };
}

const emptyDraft = (): Draft => ({
  title: "",
  slug: "",
  department: "operations",
  location: "Kadi, Gujarat",
  employmentType: "full_time",
  summary: "",
  description: "",
  applyEmail: "",
  sortOrder: 0,
});

export function CareersOpeningEditor({
  openingId,
}: {
  openingId: string | "new";
}) {
  const router = useRouter();
  const isNew = openingId === "new";
  const [id, setId] = useState<string | null>(isNew ? null : openingId);
  const [version, setVersion] = useState(1);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [baseline, setBaseline] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== baseline,
    [draft, baseline],
  );

  const canPublish =
    Boolean(draft.title.trim()) &&
    Boolean(draft.slug.trim()) &&
    Boolean(draft.location.trim()) &&
    Boolean(draft.summary.trim());

  const patch = (partial: Partial<Draft>) =>
    setDraft((d) => ({ ...d, ...partial }));

  const load = useCallback(async () => {
    if (isNew) {
      setBaseline(JSON.stringify(emptyDraft()));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const o = await fetchOpeningApi(openingId);
      const d = fromOpening(o);
      setDraft(d);
      setBaseline(JSON.stringify(d));
      setVersion(o.version);
      setStatus(o.status);
      setId(o.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load opening");
    } finally {
      setLoading(false);
    }
  }, [isNew, openingId]);

  useEffect(() => {
    void load();
  }, [load]);

  function payload() {
    return {
      title: draft.title.trim(),
      slug: draft.slug.trim(),
      department: draft.department,
      location: draft.location.trim(),
      employmentType: draft.employmentType,
      summary: draft.summary.trim(),
      description: draft.description.trim(),
      applyEmail: draft.applyEmail.trim(),
      sortOrder: draft.sortOrder,
    };
  }

  async function onSave() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      if (!id) {
        const created = await createOpeningApi(payload());
        setId(created.id);
        setVersion(created.version);
        setStatus(created.status);
        const d = fromOpening(created);
        setDraft(d);
        setBaseline(JSON.stringify(d));
        setMessage("Opening created.");
        router.replace(`/admin/careers/${created.id}`);
      } else {
        const updated = await updateOpeningApi(id, {
          ...payload(),
          version,
        });
        setVersion(updated.version);
        setStatus(updated.status);
        const d = fromOpening(updated);
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
          const created = await createOpeningApi(payload());
          currentId = created.id;
          currentVersion = created.version;
          setId(created.id);
          router.replace(`/admin/careers/${created.id}`);
        } else {
          const updated = await updateOpeningApi(currentId, {
            ...payload(),
            version: currentVersion,
          });
          currentVersion = updated.version;
        }
      }
      const published = await publishOpeningApi(
        currentId!,
        "publish",
        currentVersion,
      );
      setVersion(published.version);
      setStatus(published.status);
      const d = fromOpening(published);
      setDraft(d);
      setBaseline(JSON.stringify(d));
      setMessage("Published — live on /careers.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground text-sm">Loading opening…</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[52rem] flex-col pb-2">
      <header className="mb-4 flex flex-col gap-2">
        <DeskBackLink href="/admin/careers" label="Back to careers" />
        <h1 className="font-display text-xl font-semibold tracking-tight">
          {isNew && !id ? "New opening" : draft.title || "Opening"}
        </h1>
        <p className="text-muted-foreground text-[0.8125rem]">
          Title, team, location and a short summary are required before publish.
        </p>
      </header>

      {error && !message ? (
        <p className="mb-3 text-sm text-destructive">{error}</p>
      ) : null}

      <div className="overflow-hidden rounded-[10px] border border-[#d2d2d7] bg-white">
        <div className="grid gap-2.5 p-3 sm:grid-cols-2">
          <Field label="Title" className="sm:col-span-2">
            <input
              className={inputClass}
              value={draft.title}
              onChange={(e) => {
                const title = e.target.value;
                patch({
                  title,
                  slug: isNew && !id ? slugify(title) : draft.slug,
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
          <Field label="Location">
            <input
              className={inputClass}
              value={draft.location}
              onChange={(e) => patch({ location: e.target.value })}
            />
          </Field>
          <Field label="Department">
            <select
              className={inputClass}
              value={draft.department}
              onChange={(e) =>
                patch({ department: e.target.value as CareerDepartment })
              }
            >
              {CAREER_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {DEPT_LABEL[d]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Employment type">
            <select
              className={inputClass}
              value={draft.employmentType}
              onChange={(e) =>
                patch({
                  employmentType: e.target.value as CareerEmploymentType,
                })
              }
            >
              {CAREER_EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sort order">
            <input
              type="number"
              className={inputClass}
              value={draft.sortOrder}
              onChange={(e) =>
                patch({ sortOrder: Number(e.target.value) || 0 })
              }
            />
          </Field>
          <Field label="Apply email (optional)">
            <input
              type="email"
              className={inputClass}
              placeholder="Defaults to company HR email"
              value={draft.applyEmail}
              onChange={(e) => patch({ applyEmail: e.target.value })}
            />
          </Field>
          <Field label="Summary" className="sm:col-span-2">
            <textarea
              className={cn(inputClass, "h-auto min-h-[56px] resize-y py-2")}
              value={draft.summary}
              onChange={(e) => patch({ summary: e.target.value })}
              rows={2}
              maxLength={400}
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea
              className={cn(inputClass, "h-auto min-h-[160px] resize-y py-2")}
              value={draft.description}
              onChange={(e) => patch({ description: e.target.value })}
              rows={8}
              placeholder="Responsibilities, requirements, what success looks like…"
            />
          </Field>
        </div>
      </div>

      {id ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-8 text-[12px] text-[#ff3b30]"
            disabled={saving}
            onClick={async () => {
              if (!confirm("Move this opening to trash?")) return;
              try {
                await deleteOpeningApi(id);
                router.push("/admin/careers");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Delete failed");
              }
            }}
          >
            Trash
          </Button>
          <Link
            href="/en/careers"
            target="_blank"
            className="text-[12px] font-semibold text-[#0071e3] hover:underline"
          >
            Open public careers →
          </Link>
        </div>
      ) : null}

      <DeskSaveBar
        saving={saving}
        dirty={dirty || !id}
        canPublish={canPublish}
        publishBlockedReason={
          canPublish
            ? undefined
            : "Add title, slug, location and summary before publish."
        }
        statusLabel={status}
        previewHref="/en/careers"
        onSave={() => void onSave()}
        onPublish={() => void onPublish()}
        message={message}
        error={error}
      />
    </div>
  );
}
