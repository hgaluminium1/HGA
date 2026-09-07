"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SaveBarProps = {
  dirty: boolean;
  saving?: boolean;
  onSave: () => void;
  onDiscard: () => void;
  extra?: React.ReactNode;
};

export function SaveBar({
  dirty,
  saving,
  onSave,
  onDiscard,
  extra,
}: SaveBarProps) {
  return (
    <div
      className={cn(
        "border-line bg-surface sticky bottom-0 z-30 -mx-4 mt-8 flex flex-wrap items-center gap-3 border-t px-4 py-3 md:-mx-6 md:px-6",
        dirty ? "shadow-[0_-4px_16px_rgba(0,0,0,0.06)]" : "opacity-90",
      )}
    >
      <p className="text-muted-foreground mr-auto text-sm">
        {dirty ? "Unsaved changes" : "All changes saved"}
      </p>
      {extra}
      <Button
        type="button"
        variant="outline"
        className="min-h-11"
        disabled={!dirty || saving}
        onClick={onDiscard}
      >
        Discard
      </Button>
      <Button
        type="button"
        className="min-h-11"
        disabled={!dirty || saving}
        onClick={onSave}
      >
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}

export function StatusBadge({
  status,
}: {
  status: "draft" | "scheduled" | "published";
}) {
  const styles =
    status === "published"
      ? "bg-emerald-100 text-emerald-800"
      : status === "scheduled"
        ? "bg-sky-100 text-sky-800"
        : "bg-amber-100 text-amber-900";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        styles,
      )}
    >
      {status}
    </span>
  );
}
