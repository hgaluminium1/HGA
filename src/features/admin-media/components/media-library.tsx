"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { MEDIA_TAGS } from "@/config/media-tags.config";
import {
  deleteMediaApi,
  fetchMedia,
  updateMediaApi,
  uploadMediaApi,
} from "@/features/admin-media/lib/api";
import type { MediaDTO } from "@/modules/media";

export function MediaLibrary() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<MediaDTO | null>(null);
  const [alt, setAlt] = useState("");
  const [tags, setTags] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["media", q],
    queryFn: () => fetchMedia({ q: q || undefined }),
  });

  const uploadMut = useMutation({
    mutationFn: (file: File) => uploadMediaApi(file, { alt, tags }),
    onSuccess: (result) => {
      void qc.invalidateQueries({ queryKey: ["media"] });
      setMsg(
        result.reused
          ? "Duplicate content — reused existing media."
          : "Uploaded.",
      );
      setSelected(result.media);
    },
    onError: (err: Error) => setMsg(err.message),
  });

  const saveMut = useMutation({
    mutationFn: () => {
      if (!selected) throw new Error("Nothing selected");
      return updateMediaApi(selected.id, {
        alt: { en: alt },
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        version: selected.version,
      });
    },
    onSuccess: (media) => {
      void qc.invalidateQueries({ queryKey: ["media"] });
      setSelected(media);
      setMsg("Saved.");
    },
    onError: (err: Error) => setMsg(err.message),
  });

  const deleteMut = useMutation({
    mutationFn: deleteMediaApi,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["media"] });
      setSelected(null);
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Media</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="border-line bg-surface ml-auto min-h-11 min-w-[200px] rounded-[var(--radius-md)] border px-3 text-sm"
        />
        <label className="border-line bg-brand text-brand-foreground inline-flex min-h-11 cursor-pointer items-center rounded-[var(--radius-md)] px-4 text-sm font-medium">
          Upload
          <input
            type="file"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadMut.mutate(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {msg ? (
        <p className="text-muted-foreground mt-3 text-sm" role="status">
          {msg}
        </p>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {query.data?.items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setSelected(item);
                  setAlt(item.alt.en);
                  setTags(item.tags.join(", "));
                }}
                className="border-line bg-surface hover:border-brand w-full overflow-hidden rounded-[var(--radius-md)] border text-left"
              >
                {item.mime.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.alt.en || item.key}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="bg-surface-muted text-muted-foreground flex aspect-square items-center justify-center p-2 text-center text-xs">
                    {item.kind}
                  </div>
                )}
                <p className="truncate px-2 py-1 text-xs">{item.key}</p>
              </button>
            </li>
          ))}
        </ul>

        <aside className="border-line bg-surface h-fit space-y-3 rounded-[var(--radius-lg)] border p-4">
          <h2 className="font-semibold">Details</h2>
          {selected ? (
            <>
              <p className="text-muted-foreground break-all text-xs">
                {selected.url}
              </p>
              <label className="block text-sm font-medium">
                Alt text
                <input
                  className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Tags (comma-separated)
                <input
                  className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  list="media-tags"
                />
                <datalist id="media-tags">
                  {MEDIA_TAGS.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="min-h-11"
                  disabled={saveMut.isPending}
                  onClick={() => saveMut.mutate()}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  onClick={() => {
                    if (confirm("Move to trash?")) {
                      deleteMut.mutate(selected.id);
                    }
                  }}
                >
                  Trash
                </Button>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              Select an asset or upload a file.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
