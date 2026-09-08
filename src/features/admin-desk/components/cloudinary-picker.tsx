"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Play, Plus, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadMediaApi } from "@/features/admin-desk/lib/api";
import { cn } from "@/lib/utils";

type CloudinaryPickerProps = {
  kind: "image" | "video";
  label?: string;
  help?: string;
  valueUrl: string;
  valuePublicId?: string;
  onChange: (next: {
    url: string;
    publicId: string;
    mediaId?: string;
  }) => void;
  className?: string;
  size?: number;
};

/**
 * Apple / Linear media tile — photo only.
 * Empty: dashed square. Filled: thumb + ×. Click → cinematic preview.
 */
export function CloudinaryPicker({
  kind,
  label,
  help,
  valueUrl,
  onChange,
  className,
  size = 56,
}: CloudinaryPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setPending(true);
    setError(null);
    try {
      const result = await uploadMediaApi(file);
      onChange({
        url: result.media.url,
        publicId: result.media.key,
        mediaId: result.media.id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const accept =
    kind === "video" ? "video/mp4,video/webm,video/quicktime" : "image/*";

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      {(label || help) && (
        <div className="flex items-baseline gap-1.5">
          {label ? (
            <span className="text-[11px] font-medium text-ink/55">{label}</span>
          ) : null}
          {help ? (
            <span className="text-[10px] text-ink/35">{help}</span>
          ) : null}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />

      {valueUrl ? (
        <div
          className="group relative shrink-0 overflow-hidden rounded-[8px] bg-[#f5f5f7]"
          style={{ width: size, height: size }}
        >
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]/40"
            aria-label={`Preview ${label || kind}`}
          >
            {kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={valueUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center bg-[#1d1d1f] text-white">
                <Play className="size-4 fill-current" />
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange({ url: "", publicId: "" });
            }}
            className="absolute top-0.5 right-0.5 z-10 flex size-[18px] items-center justify-center rounded-full bg-[#1d1d1f]/72 text-white shadow-sm backdrop-blur-[2px] transition hover:bg-[#1d1d1f] focus-visible:outline-none"
            aria-label={`Remove ${label || kind}`}
          >
            <X className="size-2.5 stroke-[3]" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          style={{ width: size, height: size }}
          className="flex shrink-0 items-center justify-center rounded-[8px] border border-dashed border-[#d2d2d7] bg-transparent text-[#86868b] transition hover:border-[#86868b] hover:bg-[#f5f5f7]/80 disabled:opacity-50"
          aria-label={kind === "image" ? "Add photo" : "Add video"}
        >
          {pending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : kind === "image" ? (
            <ImagePlus className="size-3.5" />
          ) : (
            <Plus className="size-3.5" />
          )}
        </button>
      )}

      {error ? (
        <p className="max-w-[10rem] text-[10px] leading-tight text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          showCloseButton={false}
          className={cn(
            "max-h-[min(90svh,900px)] w-[min(920px,calc(100vw-2rem))] gap-0 overflow-hidden rounded-2xl border-0 bg-[#1d1d1f] p-0 text-white shadow-[0_24px_80px_rgb(0_0_0_/0.45)] ring-0 sm:max-w-[920px]",
          )}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{label || kind} preview</DialogTitle>
          </DialogHeader>

          <div className="relative">
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="absolute top-3 right-3 z-20 flex size-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
              aria-label="Close preview"
            >
              <X className="size-4" />
            </button>

            {kind === "image" && valueUrl ? (
              <div className="flex max-h-[min(85svh,860px)] items-center justify-center bg-black p-3 sm:p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={valueUrl}
                  alt=""
                  className="max-h-[min(80svh,800px)] w-auto max-w-full rounded-lg object-contain"
                />
              </div>
            ) : null}

            {kind === "video" && valueUrl ? (
              <div className="aspect-video w-full bg-black">
                <video
                  className="size-full"
                  controls
                  playsInline
                  autoPlay
                  src={valueUrl}
                />
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
