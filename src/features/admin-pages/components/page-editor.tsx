"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { BlockDataForm } from "@/features/admin-pages/components/block-forms/block-data-form";
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
  getPageTemplate,
  syncBlocksToTemplate,
} from "@/modules/cms/browser";

type EditorBlock = {
  id: string;
  type: string;
  order: number;
  appearance: string;
  data: unknown;
};

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
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
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
    const synced = syncBlocksToTemplate(p.slug, p.blocks);
    setBlocks(synced);
    setOpenSectionId((prev) => prev ?? synced[0]?.id ?? null);
    setBaseline(
      JSON.stringify({
        title: p.title,
        slug: p.slug,
        seoTitle: p.seo?.title ?? "",
        seoDescription: p.seo?.description ?? "",
        blocks: synced,
      }),
    );
  }, [pageQuery.data]);

  const template = getPageTemplate(slug);

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
      const synced = syncBlocksToTemplate(page.slug, page.blocks);
      setBlocks(synced);
      setBaseline(
        JSON.stringify({
          title: page.title,
          slug: page.slug,
          seoTitle: page.seo?.title ?? "",
          seoDescription: page.seo?.description ?? "",
          blocks: synced,
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
  const isEntity = template?.mode === "entity";

  return (
    <div>
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display truncate text-2xl font-semibold text-ink">
              {template?.label ?? page.title}
            </h1>
            <StatusBadge status={page.status} />
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Fixed template · /{page.slug}
            {template?.description ? ` — ${template.description}` : null}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={previewMut.isPending || isEntity}
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
        <div className="mt-6 space-y-3">
          {isEntity ? (
            <div className="border-line bg-surface rounded-[var(--radius-lg)] border p-6">
              <p className="font-medium text-ink">
                This page uses a fixed layout
              </p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {slug === "chairmans-message" ? (
                  <>
                    Edit chairman photos and messages under{" "}
                    <Link
                      href="/admin/corporate/people"
                      className="text-brand font-medium underline"
                    >
                      Company → People
                    </Link>
                    . Use role “chairman” and enable “Show on Chairman’s
                    Message”. Title and SEO are on the Settings tab.
                  </>
                ) : slug === "contact" ? (
                  <>
                    Enquiry form is fixed. Update addresses, map links, and N
                    locations under{" "}
                    <Link
                      href="/admin/settings/company"
                      className="text-brand font-medium underline"
                    >
                      Company profile
                    </Link>
                    . Title and SEO are on the Settings tab.
                  </>
                ) : (
                  <>Content for this page is managed via Company / Catalogue.</>
                )}
              </p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-sm">
                Sections are locked to this template. Open a section to edit
                copy and images. Add/remove rows only inside lists (slides,
                FAQ, etc.).
              </p>
              {template?.sections.map((section) => {
                const block = blocks.find((b) => b.id === section.id);
                if (!block) return null;
                const open = openSectionId === section.id;
                return (
                  <div
                    key={section.id}
                    className="border-line bg-surface rounded-[var(--radius-lg)] border"
                  >
                    <button
                      type="button"
                      className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left"
                      onClick={() =>
                        setOpenSectionId(open ? null : section.id)
                      }
                      aria-expanded={open}
                    >
                      <span className="flex-1">
                        <span className="block font-semibold text-ink">
                          {section.title}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {section.help}
                        </span>
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {open ? "Hide" : "Edit"}
                      </span>
                    </button>
                    {open ? (
                      <div className="border-line border-t px-4 py-4">
                        <label className="text-muted-foreground mb-3 flex flex-wrap items-center gap-2 text-xs font-medium">
                          Appearance
                          <select
                            className="border-line min-h-11 rounded-[var(--radius-md)] border px-2 text-sm text-ink"
                            value={block.appearance}
                            onChange={(e) =>
                              setBlocks((prev) =>
                                prev.map((b) =>
                                  b.id === block.id
                                    ? { ...b, appearance: e.target.value }
                                    : b,
                                ),
                              )
                            }
                          >
                            <option value="default">Default</option>
                            <option value="inverted">Inverted</option>
                            <option value="tinted">Tinted</option>
                            <option value="compact">Compact</option>
                          </select>
                        </label>
                        <BlockDataForm
                          type={block.type}
                          data={block.data}
                          onChange={(data) =>
                            setBlocks((prev) =>
                              prev.map((b) =>
                                b.id === block.id ? { ...b, data } : b,
                              ),
                            )
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </>
          )}
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
              className="border-line bg-muted mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={slug}
              readOnly
              title="Slug is locked to the page template"
            />
            <span className="text-muted-foreground mt-1 block text-xs">
              Locked to template — ask a developer for a new page URL.
            </span>
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
