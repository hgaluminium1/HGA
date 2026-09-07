"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchMedia, uploadMediaApi } from "@/features/admin-media/lib/api";
import type { MediaDTO } from "@/modules/media";

type MediaPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: MediaDTO) => void;
  kind?: string;
};

export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  kind,
}: MediaPickerProps) {
  const [q, setQ] = useState("");
  const query = useQuery({
    queryKey: ["media-picker", q, kind],
    queryFn: () => fetchMedia({ q: q || undefined, kind }),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose media</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="border-line min-h-11 flex-1 rounded-[var(--radius-md)] border px-3 text-sm"
          />
          <label className="border-line inline-flex min-h-11 cursor-pointer items-center rounded-[var(--radius-md)] border px-3 text-sm">
            Upload
            <input
              type="file"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const { media } = await uploadMediaApi(file);
                  onSelect(media);
                  onOpenChange(false);
                } catch (err) {
                  alert(err instanceof Error ? err.message : "Upload failed");
                }
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <ul className="mt-4 grid max-h-[50vh] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
          {query.data?.items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="border-line hover:border-brand w-full overflow-hidden rounded-[var(--radius-md)] border"
                onClick={() => {
                  onSelect(item);
                  onOpenChange(false);
                }}
              >
                {item.mime.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.alt.en || item.key}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="bg-surface-muted flex aspect-square items-center justify-center text-xs">
                    {item.kind}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
