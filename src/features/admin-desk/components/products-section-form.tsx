"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

const inputClass =
  "h-8 w-full rounded-[6px] border border-[#d2d2d7] bg-white px-2.5 text-[13px] text-[#1d1d1f] outline-none transition placeholder:text-[#86868b] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20";

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

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

/** Compact products-band copy editor. Cards hydrate from published catalogue. */
export function ProductsSectionForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const d = asRecord(value);

  function patch(partial: Record<string, unknown>) {
    onChange({ ...d, ...partial });
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#d2d2d7] bg-white">
      <div className="grid gap-2.5 p-3 sm:grid-cols-2">
        <Field label="Eyebrow">
          <input
            className={inputClass}
            value={typeof d.eyebrow === "string" ? d.eyebrow : ""}
            onChange={(e) => patch({ eyebrow: e.target.value })}
            placeholder="Our Products"
          />
        </Field>
        <Field label="Headline">
          <input
            className={inputClass}
            value={typeof d.title === "string" ? d.title : ""}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Present catalogue lines"
          />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <textarea
            className={cn(inputClass, "h-auto min-h-[64px] resize-y py-2 leading-snug")}
            value={typeof d.description === "string" ? d.description : ""}
            onChange={(e) => patch({ description: e.target.value })}
            rows={2}
            placeholder="Short intro under the headline"
          />
        </Field>
      </div>
      <div className="border-t border-[#e8e8ed] bg-[#fafafa] px-3 py-2.5">
        <p className="text-[12px] leading-snug text-[#1d1d1f]">
          Cards load from{" "}
          <strong className="font-semibold">published catalogue products</strong>{" "}
          (present lines only). Edit product photos and names in Catalogue.
        </p>
        <p className="mt-1.5 text-[11px] text-[#86868b]">
          On phones the band scrolls horizontally; from tablet up it becomes a
          2–3 column grid.
        </p>
        <Link
          href="/admin/catalogue/products"
          className="mt-2 inline-block text-[12px] font-semibold text-[#0071e3] hover:underline"
        >
          Open catalogue →
        </Link>
      </div>
    </div>
  );
}

/** Upcoming strip headings — product cards come from isUpcoming catalogue rows. */
export function UpcomingProductsSectionForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const d = asRecord(value);

  function patch(partial: Record<string, unknown>) {
    onChange({ ...d, ...partial });
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#d2d2d7] bg-white">
      <div className="grid gap-2.5 p-3 sm:grid-cols-2">
        <Field label="Eyebrow">
          <input
            className={inputClass}
            value={typeof d.eyebrow === "string" ? d.eyebrow : ""}
            onChange={(e) => patch({ eyebrow: e.target.value })}
            placeholder="Pipeline"
          />
        </Field>
        <Field label="Headline">
          <input
            className={inputClass}
            value={typeof d.title === "string" ? d.title : ""}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Upcoming products"
          />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <textarea
            className={cn(inputClass, "h-auto min-h-[64px] resize-y py-2 leading-snug")}
            value={typeof d.description === "string" ? d.description : ""}
            onChange={(e) => patch({ description: e.target.value })}
            rows={2}
            placeholder="Coming soon — register interest for early allocation"
          />
        </Field>
      </div>
      <div className="border-t border-[#e8e8ed] bg-[#fafafa] px-3 py-2.5">
        <p className="text-[12px] leading-snug text-[#1d1d1f]">
          Cards load from catalogue products marked{" "}
          <strong className="font-semibold">upcoming / coming soon</strong>.
          Same responsive card system as the products band.
        </p>
        <Link
          href="/admin/catalogue/products"
          className="mt-2 inline-block text-[12px] font-semibold text-[#0071e3] hover:underline"
        >
          Open catalogue →
        </Link>
      </div>
    </div>
  );
}
