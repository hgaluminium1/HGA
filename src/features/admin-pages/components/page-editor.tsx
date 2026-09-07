"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  SaveBar,
  StatusBadge,
} from "@/features/admin-pages/components/save-bar";
import {
  createPreviewApi,
  fetchPage,
  publishPageApi,
  updatePageApi,
} from "@/features/admin-pages/lib/api";
import {
  BLOCK_PICKER,
  defaultBlockData,
  type BlockType,
} from "@/modules/cms/browser";

type EditorBlock = {
  id: string;
  type: string;
  order: number;
  appearance: string;
  data: unknown;
};

function SortableBlock({
  block,
  onChange,
  onRemove,
}: {
  block: EditorBlock;
  onChange: (next: EditorBlock) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const label =
    BLOCK_PICKER.find((b) => b.type === block.type)?.label ?? block.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-line bg-surface rounded-[var(--radius-lg)] border p-4"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="text-muted-foreground min-h-11 min-w-11 cursor-grab"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="mx-auto size-4" />
        </button>
        <p className="flex-1 font-semibold text-ink">{label}</p>
        <select
          className="border-line min-h-11 rounded-[var(--radius-md)] border px-2 text-sm"
          value={block.appearance}
          onChange={(e) =>
            onChange({ ...block, appearance: e.target.value })
          }
        >
          <option value="default">Default</option>
          <option value="inverted">Inverted</option>
          <option value="tinted">Tinted</option>
          <option value="compact">Compact</option>
        </select>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="min-h-11 min-w-11"
          onClick={onRemove}
          aria-label="Remove block"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <label className="mt-3 block text-xs font-medium text-muted-foreground">
        Block data (JSON)
        <textarea
          className="border-line mt-1 min-h-40 w-full rounded-[var(--radius-md)] border p-3 font-mono text-xs"
          value={JSON.stringify(block.data, null, 2)}
          onChange={(e) => {
            try {
              const data = JSON.parse(e.target.value) as unknown;
              onChange({ ...block, data });
            } catch {
              // keep typing until valid JSON
            }
          }}
        />
      </label>
    </div>
  );
}

export function PageEditor({ pageId }: { pageId: string }) {
  const qc = useQueryClient();
  const pageQuery = useQuery({
    queryKey: ["page", pageId],
    queryFn: () => fetchPage(pageId),
  });

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const [tab, setTab] = useState<"content" | "settings" | "publishing">(
    "content",
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [baseline, setBaseline] = useState("");
  const [version, setVersion] = useState(1);

  useEffect(() => {
    if (!pageQuery.data) return;
    const p = pageQuery.data;
    setTitle(p.title);
    setSlug(p.slug);
    setSeoTitle(p.seo?.title ?? "");
    setSeoDescription(p.seo?.description ?? "");
    setVersion(p.version);
    const b = [...p.blocks].sort((a, c) => a.order - c.order);
    setBlocks(b);
    setBaseline(
      JSON.stringify({
        title: p.title,
        slug: p.slug,
        seoTitle: p.seo?.title ?? "",
        seoDescription: p.seo?.description ?? "",
        blocks: b,
      }),
    );
  }, [pageQuery.data]);

  const current = useMemo(
    () =>
      JSON.stringify({
        title,
        slug,
        seoTitle,
        seoDescription,
        blocks,
      }),
    [title, slug, seoTitle, seoDescription, blocks],
  );
  const dirty = Boolean(baseline) && current !== baseline;

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const saveMut = useMutation({
    mutationFn: () =>
      updatePageApi(pageId, {
        title,
        slug,
        seo: { title: seoTitle, description: seoDescription },
        blocks: blocks.map((b, i) => ({ ...b, order: i })),
        createRedirectOnSlugChange: true,
        version,
      }),
    onSuccess: (page) => {
      setVersion(page.version);
      void qc.invalidateQueries({ queryKey: ["page", pageId] });
      void qc.invalidateQueries({ queryKey: ["pages"] });
      const b = [...page.blocks].sort((a, c) => a.order - c.order);
      setBlocks(b);
      setBaseline(
        JSON.stringify({
          title: page.title,
          slug: page.slug,
          seoTitle: page.seo?.title ?? "",
          seoDescription: page.seo?.description ?? "",
          blocks: b,
        }),
      );
    },
    onError: (err) => {
      if (err instanceof Error && err.message.includes("Updated elsewhere")) {
        alert(err.message);
        void pageQuery.refetch();
      }
    },
  });

  const publishMut = useMutation({
    mutationFn: (action: "publish" | "unpublish") =>
      publishPageApi(pageId, action, version),
    onSuccess: (page) => {
      setVersion(page.version);
      void qc.invalidateQueries({ queryKey: ["page", pageId] });
      void qc.invalidateQueries({ queryKey: ["pages"] });
    },
    onError: (err) => {
      if (err instanceof Error && err.message.includes("Updated elsewhere")) {
        alert(err.message);
        void pageQuery.refetch();
      }
    },
  });

  const [scheduleAt, setScheduleAt] = useState("");
  const scheduleMut = useMutation({
    mutationFn: () =>
      updatePageApi(pageId, {
        status: "scheduled",
        scheduledPublishAt: new Date(scheduleAt).toISOString(),
        version,
      }),
    onSuccess: (page) => {
      setVersion(page.version);
      void qc.invalidateQueries({ queryKey: ["page", pageId] });
      void qc.invalidateQueries({ queryKey: ["pages"] });
    },
    onError: (err) => {
      if (err instanceof Error && err.message.includes("Updated elsewhere")) {
        alert(err.message);
        void pageQuery.refetch();
      }
    },
  });

  const previewMut = useMutation({
    mutationFn: () => createPreviewApi(pageId),
    onSuccess: (data) => {
      window.open(data.url, "_blank", "noopener,noreferrer");
    },
  });

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setBlocks((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex).map((b, order) => ({
        ...b,
        order,
      }));
    });
  }

  function addBlock(type: BlockType) {
    const id = `${type}-${crypto.randomUUID().slice(0, 8)}`;
    setBlocks((prev) => [
      ...prev,
      {
        id,
        type,
        order: prev.length,
        appearance: "default",
        data: defaultBlockData(type),
      },
    ]);
    setPickerOpen(false);
  }

  if (pageQuery.isLoading) {
    return <p className="text-muted-foreground text-sm">Loading editor…</p>;
  }
  if (pageQuery.isError || !pageQuery.data) {
    return (
      <p className="text-sm text-destructive">
        {(pageQuery.error as Error)?.message ?? "Page not found"}
      </p>
    );
  }

  const page = pageQuery.data;

  return (
    <div>
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display truncate text-2xl font-semibold text-ink">
              {page.title}
            </h1>
            <StatusBadge status={page.status} />
          </div>
          <p className="text-muted-foreground mt-1 text-sm">/{page.slug}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={previewMut.isPending}
          onClick={() => previewMut.mutate()}
        >
          Preview draft
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-[var(--color-line)] pb-2">
        {(
          [
            ["content", "Content"],
            ["settings", "Settings"],
            ["publishing", "Publishing"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`min-h-11 rounded-[var(--radius-md)] px-3 text-sm font-medium ${
              tab === id ? "bg-brand/10 text-brand" : "text-ink"
            }`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "content" ? (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="min-h-11 gap-2"
              onClick={() => setPickerOpen((v) => !v)}
            >
              <Plus className="size-4" />
              Add section
            </Button>
          </div>
          {pickerOpen ? (
            <div className="border-line grid gap-2 rounded-[var(--radius-lg)] border p-3 sm:grid-cols-2">
              {BLOCK_PICKER.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  className="hover:bg-surface-muted min-h-11 rounded-[var(--radius-md)] px-3 py-2 text-left"
                  onClick={() => addBlock(item.type)}
                >
                  <span className="block font-semibold text-ink">
                    {item.label}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {item.description}
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {blocks.length === 0 ? (
            <div className="border-line rounded-[var(--radius-lg)] border border-dashed p-8 text-center">
              <p className="font-medium">No sections yet</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Add a Hero or other section to build this page.
              </p>
            </div>
          ) : null}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    onChange={(next) =>
                      setBlocks((prev) =>
                        prev.map((b) => (b.id === next.id ? next : b)),
                      )
                    }
                    onRemove={() =>
                      setBlocks((prev) =>
                        prev.filter((b) => b.id !== block.id),
                      )
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ) : null}

      {tab === "settings" ? (
        <div className="mt-6 grid max-w-xl gap-4">
          <label className="text-sm font-medium">
            Title
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="text-sm font-medium">
            Slug
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </label>
          <label className="text-sm font-medium">
            SEO title
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />
          </label>
          <label className="text-sm font-medium">
            SEO description
            <textarea
              className="border-line mt-1 min-h-24 w-full rounded-[var(--radius-md)] border px-3 py-2"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />
          </label>
        </div>
      ) : null}

      {tab === "publishing" ? (
        <div className="mt-6 max-w-xl space-y-4">
          <p className="text-sm">
            Current status: <StatusBadge status={page.status} />
            {page.scheduledPublishAt ? (
              <span className="text-muted-foreground ml-2 text-xs">
                due {new Date(page.scheduledPublishAt).toLocaleString()}
              </span>
            ) : null}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="min-h-11"
              disabled={publishMut.isPending || page.status === "published"}
              onClick={() => {
                if (confirm("Publish this page?")) {
                  publishMut.mutate("publish");
                }
              }}
            >
              Publish
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              disabled={publishMut.isPending || page.status === "draft"}
              onClick={() => {
                if (confirm("Unpublish and set to draft?")) {
                  publishMut.mutate("unpublish");
                }
              }}
            >
              Unpublish
            </Button>
          </div>
          <label className="block text-sm font-medium">
            Schedule publish at
            <input
              type="datetime-local"
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={scheduleAt}
              onChange={(e) => setScheduleAt(e.target.value)}
            />
          </label>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            disabled={!scheduleAt || scheduleMut.isPending}
            onClick={() => scheduleMut.mutate()}
          >
            Schedule
          </Button>
        </div>
      ) : null}

      <SaveBar
        dirty={dirty}
        saving={saveMut.isPending}
        onSave={() => saveMut.mutate()}
        onDiscard={() => {
          if (!dirty || confirm("Discard unsaved changes?")) {
            void pageQuery.refetch();
          }
        }}
        extra={
          saveMut.isError ? (
            <span className="text-sm text-destructive">
              {(saveMut.error as Error).message}
            </span>
          ) : null
        }
      />
    </div>
  );
}
