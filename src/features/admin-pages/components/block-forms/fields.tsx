"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { MediaPicker } from "@/features/admin-media/components/media-picker";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block text-sm font-medium text-ink", className)}>
      {label}
      {hint ? (
        <span className="text-muted-foreground mt-0.5 block text-xs font-normal">
          {hint}
        </span>
      ) : null}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const inputClass =
  "border-line min-h-11 w-full rounded-[var(--radius-md)] border bg-surface px-3 text-sm outline-none focus:border-brand-blue";

export const textareaClass =
  "border-line min-h-24 w-full rounded-[var(--radius-md)] border bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue";

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return <textarea {...props} className={cn(textareaClass, props.className)} />;
}

export function MediaUrlField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Field label={label} hint={hint ?? "Pick from Media library (R2)."}>
      <div className="flex flex-wrap gap-2">
        <TextInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or leave blank and pick media"
          className="min-w-0 flex-1"
        />
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          Choose media
        </Button>
      </div>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="border-line mt-2 h-24 w-auto rounded-[var(--radius-md)] border object-cover"
        />
      ) : null}
      <MediaPicker
        open={open}
        onOpenChange={setOpen}
        kind="image"
        onSelect={(m) => onChange(m.url)}
      />
    </Field>
  );
}

export function CorporateHydratedNotice({ label }: { label: string }) {
  return (
    <p className="text-muted-foreground rounded-[var(--radius-md)] border border-dashed border-line bg-bg-alt px-3 py-3 text-sm leading-relaxed">
      <strong className="text-ink">{label}</strong> pulls live data from Company /
      Corporate admin (capacity, leadership, logos, etc.). No JSON to edit here —
      update those records under Company in the sidebar.
    </p>
  );
}
