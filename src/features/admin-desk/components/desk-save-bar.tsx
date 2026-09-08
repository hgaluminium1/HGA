"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DeskFooterPortal } from "@/features/admin-desk/components/desk-footer-portal";
import { cn } from "@/lib/utils";

export type DeskSaveBarProps = {
  saving?: boolean;
  dirty?: boolean;
  canPublish?: boolean;
  publishBlockedReason?: string;
  statusLabel?: string;
  previewHref?: string;
  onSave: () => void;
  onPublish: () => void;
  message?: string | null;
  error?: string | null;
  className?: string;
};

/**
 * Portals into the main-column footer — full width of content column only,
 * aligned with sidebar Sign out (never covers the sidebar).
 */
export function DeskSaveBar({
  saving,
  dirty = true,
  canPublish = true,
  publishBlockedReason,
  statusLabel,
  previewHref,
  onSave,
  onPublish,
  message,
  error,
  className,
}: DeskSaveBarProps) {
  return (
    <DeskFooterPortal>
      <div
        className={cn(
          "flex w-full flex-col gap-1.5 px-3 py-2.5 min-[640px]:px-5",
          className,
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            className="h-9 min-w-[6.5rem] text-[0.8125rem]"
            disabled={saving || !dirty}
            onClick={onSave}
          >
            {saving ? "Saving…" : "Save draft"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 text-[0.8125rem]"
            disabled={saving || !canPublish}
            title={publishBlockedReason}
            onClick={onPublish}
          >
            Publish
          </Button>
          {previewHref ? (
            <Link
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 px-2 text-[0.8125rem] font-semibold underline-offset-4 hover:underline"
            >
              <ExternalLink className="size-3.5" />
              Preview
            </Link>
          ) : null}
          {statusLabel ? (
            <p className="text-muted-foreground ml-auto text-[0.6875rem]">
              Status:{" "}
              <span className="font-semibold text-ink">{statusLabel}</span>
            </p>
          ) : null}
        </div>
        {publishBlockedReason && !canPublish ? (
          <p className="text-muted-foreground text-[0.6875rem]">
            {publishBlockedReason}
          </p>
        ) : null}
        {error ? (
          <p className="text-[0.8125rem] text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="text-[0.8125rem] text-brand-blue" role="status">
            {message}
          </p>
        ) : null}
      </div>
    </DeskFooterPortal>
  );
}
