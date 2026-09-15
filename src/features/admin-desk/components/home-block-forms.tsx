"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CloudinaryPicker } from "@/features/admin-desk/components/cloudinary-picker";
import { cn } from "@/lib/utils";

const inputClass =
  "h-8 w-full rounded-[6px] border border-[#d2d2d7] bg-white px-2.5 text-[13px] text-[#1d1d1f] outline-none transition placeholder:text-[#86868b] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20";

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function str(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
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

function Shell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#d2d2d7] bg-white">
      {children}
      {footer ? (
        <div className="border-t border-[#e8e8ed] bg-[#fafafa] px-3 py-2.5 text-[11px] leading-snug text-[#86868b]">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

function useDraft(value: unknown, onChange: (next: unknown) => void) {
  const d = asRecord(value);
  function patch(partial: Record<string, unknown>) {
    onChange({ ...d, ...partial });
  }
  return { d, patch };
}

export function MissionSectionForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const { d, patch } = useDraft(value, onChange);
  return (
    <Shell footer="Full-bleed photo with mission statement. Optional video opens in a player.">
      <div className="grid gap-3 p-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <CloudinaryPicker
            kind="image"
            label="Background photo"
            valueUrl={str(d.imageSrc)}
            onChange={({ url }) => patch({ imageSrc: url })}
          />
        </div>
        <Field label="Photo description" className="sm:col-span-2">
          <input
            className={inputClass}
            value={str(d.imageAlt)}
            onChange={(e) => patch({ imageAlt: e.target.value })}
          />
        </Field>
        <Field label="Mission statement" className="sm:col-span-2">
          <textarea
            className={cn(inputClass, "h-auto min-h-[72px] resize-y py-2")}
            value={str(d.statement)}
            onChange={(e) => patch({ statement: e.target.value })}
            rows={3}
          />
        </Field>
        <div>
          <CloudinaryPicker
            kind="video"
            label="Optional video"
            valueUrl={str(d.videoSrc)}
            onChange={({ url }) => patch({ videoSrc: url })}
          />
        </div>
        <div>
          <CloudinaryPicker
            kind="image"
            label="Video poster"
            valueUrl={str(d.videoPoster)}
            onChange={({ url }) => patch({ videoPoster: url })}
          />
        </div>
      </div>
    </Shell>
  );
}

export function CtaBannerSectionForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const { d, patch } = useDraft(value, onChange);
  return (
    <Shell footer="Mid-page inquire band — one headline, one button.">
      <div className="grid gap-2.5 p-3 sm:grid-cols-2">
        <Field label="Headline" className="sm:col-span-2">
          <input
            className={inputClass}
            value={str(d.title)}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </Field>
        <Field label="Button label">
          <input
            className={inputClass}
            value={str(d.ctaLabel)}
            onChange={(e) => patch({ ctaLabel: e.target.value })}
          />
        </Field>
        <Field label="Button link">
          <input
            className={inputClass}
            value={str(d.ctaHref)}
            onChange={(e) => patch({ ctaHref: e.target.value })}
            placeholder="contact"
          />
        </Field>
      </div>
    </Shell>
  );
}

export function TestimonialsSectionForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const { d, patch } = useDraft(value, onChange);

  return (
    <Shell footer="Quotes come from published Corporate testimonials — same source as the Customers page.">
      <div className="grid gap-2.5 p-3 sm:grid-cols-2">
        <Field label="Eyebrow">
          <input
            className={inputClass}
            value={str(d.eyebrow)}
            onChange={(e) => patch({ eyebrow: e.target.value })}
          />
        </Field>
        <Field label="Headline">
          <input
            className={inputClass}
            value={str(d.title)}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </Field>
      </div>
      <div className="border-t border-[#e8e8ed] bg-[#fafafa] px-3 py-2.5">
        <p className="text-[12px] leading-snug text-[#1d1d1f]">
          Do not maintain a separate quote list here. Edit the shared
          testimonial records once — Home and Customers both use them.
        </p>
        <Link
          href="/admin/corporate/testimonials"
          className="mt-2 inline-block text-[12px] font-semibold text-[#0071e3] hover:underline"
        >
          Edit testimonials →
        </Link>
      </div>
    </Shell>
  );
}

export function CustomersSectionForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const { d, patch } = useDraft(value, onChange);

  return (
    <Shell footer="Logos come from published Corporate customer logos — same source as the Customers page.">
      <div className="grid gap-2.5 p-3 sm:grid-cols-2">
        <Field label="Eyebrow">
          <input
            className={inputClass}
            value={str(d.eyebrow)}
            onChange={(e) => patch({ eyebrow: e.target.value })}
          />
        </Field>
        <Field label="Headline">
          <input
            className={inputClass}
            value={str(d.title)}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <textarea
            className={cn(inputClass, "h-auto min-h-[56px] resize-y py-2")}
            value={str(d.description)}
            onChange={(e) => patch({ description: e.target.value })}
            rows={2}
          />
        </Field>
      </div>
      <div className="border-t border-[#e8e8ed] bg-[#fafafa] px-3 py-2.5">
        <p className="text-[12px] leading-snug text-[#1d1d1f]">
          Logo assets are edited once in Corporate. This section only controls
          the Home band headlines — nothing is stripped or overridden.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link
            href="/admin/corporate/logos"
            className="text-[12px] font-semibold text-[#0071e3] hover:underline"
          >
            Edit logos →
          </Link>
          <Link
            href="/admin/pages/customers/sources"
            className="text-[12px] font-semibold text-[#0071e3] hover:underline"
          >
            Customers sources →
          </Link>
        </div>
      </div>
    </Shell>
  );
}

export function JointVenturesSectionForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const { d, patch } = useDraft(value, onChange);
  const items = asArray(d.items).map((s) => asRecord(s));

  function setItems(next: Record<string, unknown>[]) {
    patch({ items: next });
  }

  return (
    <Shell footer="Full-bleed plant photo with three capability highlights.">
      <div className="grid gap-2.5 p-3 sm:grid-cols-2">
        <Field label="Eyebrow">
          <input
            className={inputClass}
            value={str(d.eyebrow)}
            onChange={(e) => patch({ eyebrow: e.target.value })}
          />
        </Field>
        <Field label="Headline">
          <input
            className={inputClass}
            value={str(d.title)}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </Field>
        <div className="sm:col-span-2">
          <CloudinaryPicker
            kind="image"
            label="Background photo"
            valueUrl={str(d.imageSrc)}
            onChange={({ url }) => patch({ imageSrc: url })}
          />
        </div>
        <Field label="Photo description" className="sm:col-span-2">
          <input
            className={inputClass}
            value={str(d.imageAlt)}
            onChange={(e) => patch({ imageAlt: e.target.value })}
          />
        </Field>
      </div>
      <div className="border-t border-[#e8e8ed] px-3 py-2.5">
        <p className="mb-2 text-[11px] font-medium text-[#86868b]">Highlights</p>
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="grid gap-2 rounded-[8px] border border-[#e8e8ed] bg-[#fafafa] p-2.5 sm:grid-cols-[1fr_1fr_7rem_auto]"
            >
              <Field label="Title">
                <input
                  className={inputClass}
                  value={str(item.title)}
                  onChange={(e) =>
                    setItems(
                      items.map((row, idx) =>
                        idx === i ? { ...row, title: e.target.value } : row,
                      ),
                    )
                  }
                />
              </Field>
              <Field label="Subtitle">
                <input
                  className={inputClass}
                  value={str(item.subtitle)}
                  onChange={(e) =>
                    setItems(
                      items.map((row, idx) =>
                        idx === i ? { ...row, subtitle: e.target.value } : row,
                      ),
                    )
                  }
                />
              </Field>
              <Field label="Icon">
                <select
                  className={inputClass}
                  value={str(item.icon, "handshake")}
                  onChange={(e) =>
                    setItems(
                      items.map((row, idx) =>
                        idx === i ? { ...row, icon: e.target.value } : row,
                      ),
                    )
                  }
                >
                  <option value="handshake">Handshake</option>
                  <option value="factory">Factory</option>
                  <option value="leaf">Leaf</option>
                </select>
              </Field>
              <div className="flex items-end justify-end pb-0.5">
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-[6px] text-[#ff3b30] hover:bg-[#ff3b30]/10"
                  aria-label="Remove"
                  onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            className="h-8 justify-start px-2 text-[12px] font-medium text-[#0071e3] hover:bg-[#0071e3]/08 hover:text-[#0071e3]"
            onClick={() =>
              setItems([
                ...items,
                { title: "", subtitle: "", icon: "handshake" },
              ])
            }
          >
            <Plus className="size-3.5" />
            Add highlight
          </Button>
        </div>
      </div>
    </Shell>
  );
}

export function CareersTeaserSectionForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const { d, patch } = useDraft(value, onChange);
  const images = asArray(d.images).map((s) => asRecord(s));

  function setImages(next: Record<string, unknown>[]) {
    patch({ images: next });
  }

  return (
    <Shell footer="Employer-brand copy with a photo mosaic. Prefer 2–3 photos.">
      <div className="grid gap-2.5 p-3 sm:grid-cols-2">
        <Field label="Eyebrow">
          <input
            className={inputClass}
            value={str(d.eyebrow)}
            onChange={(e) => patch({ eyebrow: e.target.value })}
          />
        </Field>
        <Field label="Headline">
          <input
            className={inputClass}
            value={str(d.title)}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </Field>
        <Field label="Body" className="sm:col-span-2">
          <textarea
            className={cn(inputClass, "h-auto min-h-[64px] resize-y py-2")}
            value={str(d.body)}
            onChange={(e) => patch({ body: e.target.value })}
            rows={2}
          />
        </Field>
        <Field label="Button label">
          <input
            className={inputClass}
            value={str(d.ctaLabel)}
            onChange={(e) => patch({ ctaLabel: e.target.value })}
          />
        </Field>
        <Field label="Button link">
          <input
            className={inputClass}
            value={str(d.ctaHref)}
            onChange={(e) => patch({ ctaHref: e.target.value })}
            placeholder="careers"
          />
        </Field>
      </div>
      <div className="border-t border-[#e8e8ed] px-3 py-2.5">
        <p className="mb-2 text-[11px] font-medium text-[#86868b]">Photos</p>
        <div className="flex flex-col gap-2">
          {images.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-[8px] border border-[#e8e8ed] bg-[#fafafa] p-2.5 sm:flex-row sm:items-end"
            >
              <div className="min-w-0 flex-1">
                <CloudinaryPicker
                  kind="image"
                  label={`Photo ${i + 1}`}
                  valueUrl={str(item.src)}
                  onChange={({ url }) =>
                    setImages(
                      images.map((row, idx) =>
                        idx === i ? { ...row, src: url } : row,
                      ),
                    )
                  }
                />
              </div>
              <Field label="Alt text" className="sm:w-48">
                <input
                  className={inputClass}
                  value={str(item.alt)}
                  onChange={(e) =>
                    setImages(
                      images.map((row, idx) =>
                        idx === i ? { ...row, alt: e.target.value } : row,
                      ),
                    )
                  }
                />
              </Field>
              <button
                type="button"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-[6px] text-[#ff3b30] hover:bg-[#ff3b30]/10"
                aria-label="Remove photo"
                onClick={() => setImages(images.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            className="h-8 justify-start px-2 text-[12px] font-medium text-[#0071e3] hover:bg-[#0071e3]/08 hover:text-[#0071e3]"
            onClick={() => setImages([...images, { src: "", alt: "" }])}
          >
            <Plus className="size-3.5" />
            Add photo
          </Button>
        </div>
      </div>
    </Shell>
  );
}

export function FaqSectionForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const { d, patch } = useDraft(value, onChange);
  const items = asArray(d.items).map((s) => asRecord(s));

  function setItems(next: Record<string, unknown>[]) {
    patch({ items: next });
  }

  return (
    <Shell>
      <div className="grid gap-2.5 p-3 sm:grid-cols-2">
        <Field label="Eyebrow">
          <input
            className={inputClass}
            value={str(d.eyebrow)}
            onChange={(e) => patch({ eyebrow: e.target.value })}
          />
        </Field>
        <Field label="Headline">
          <input
            className={inputClass}
            value={str(d.title)}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </Field>
      </div>
      <div className="border-t border-[#e8e8ed] px-3 py-2.5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#86868b]">Questions</p>
          <span className="rounded-full bg-[#f5f5f7] px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[#86868b]">
            {items.length}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-[8px] border border-[#e8e8ed] bg-[#fafafa] p-2.5"
            >
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  className="inline-flex size-6 items-center justify-center rounded text-[#ff3b30] hover:bg-[#ff3b30]/10"
                  aria-label="Remove"
                  onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                >
                  <X className="size-3.5 stroke-[2.5]" />
                </button>
              </div>
              <div className="grid gap-2">
                <Field label="Question">
                  <input
                    className={inputClass}
                    value={str(item.question)}
                    onChange={(e) =>
                      setItems(
                        items.map((row, idx) =>
                          idx === i
                            ? { ...row, question: e.target.value }
                            : row,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Answer">
                  <textarea
                    className={cn(inputClass, "h-auto min-h-[56px] resize-y py-2")}
                    value={str(item.answer)}
                    onChange={(e) =>
                      setItems(
                        items.map((row, idx) =>
                          idx === i ? { ...row, answer: e.target.value } : row,
                        ),
                      )
                    }
                    rows={2}
                  />
                </Field>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            className="h-8 justify-start px-2 text-[12px] font-medium text-[#0071e3] hover:bg-[#0071e3]/08 hover:text-[#0071e3]"
            onClick={() =>
              setItems([...items, { question: "", answer: "" }])
            }
          >
            <Plus className="size-3.5" />
            Add question
          </Button>
        </div>
      </div>
    </Shell>
  );
}
