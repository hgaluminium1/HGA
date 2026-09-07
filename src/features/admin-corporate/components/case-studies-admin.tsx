"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  createCaseStudyApi,
  deleteCaseStudyApi,
  fetchCaseStudies,
  updateCaseStudyApi,
} from "@/features/admin-corporate/lib/api";
import { slugify } from "@/features/admin-corporate/lib/slugify";

export function CaseStudiesAdmin() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [industry, setIndustry] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const query = useQuery({
    queryKey: ["corporate-case-studies"],
    queryFn: () => fetchCaseStudies(),
  });

  const createMut = useMutation({
    mutationFn: () =>
      createCaseStudyApi({
        title: { en: title.trim() },
        slug: slug.trim() || slugify(title),
        industry: industry.trim(),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["corporate-case-studies"] });
      setCreating(false);
      setTitle("");
      setSlug("");
      setIndustry("");
      setSlugTouched(false);
    },
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Record<string, unknown>;
    }) => updateCaseStudyApi(id, body),
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-case-studies"] }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteCaseStudyApi,
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-case-studies"] }),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Case studies
        </h1>
        <Button
          type="button"
          className="ml-auto min-h-11"
          onClick={() => setCreating(true)}
        >
          Add case study
        </Button>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Project stories for industries and regions.
      </p>

      {creating ? (
        <div className="border-line bg-surface mt-6 max-w-lg space-y-3 rounded-[var(--radius-lg)] border p-4">
          <p className="text-sm font-semibold">New case study</p>
          <label className="block text-sm">
            Title
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </label>
          <label className="block text-sm">
            Slug
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
            />
          </label>
          <label className="block text-sm">
            Industry
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              className="min-h-11"
              disabled={!title.trim() || createMut.isPending}
              onClick={() => createMut.mutate()}
            >
              Create
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={() => setCreating(false)}
            >
              Cancel
            </Button>
          </div>
          {createMut.isError ? (
            <p className="text-sm text-destructive">
              {(createMut.error as Error).message}
            </p>
          ) : null}
        </div>
      ) : null}

      {query.isLoading ? (
        <p className="text-muted-foreground mt-8 text-sm">Loading…</p>
      ) : null}

      {query.data && query.data.items.length === 0 ? (
        <div className="border-line mt-8 rounded-[var(--radius-lg)] border border-dashed p-8 text-center">
          <p className="font-medium">No case studies yet</p>
          <Button
            type="button"
            className="mt-4 min-h-11"
            onClick={() => setCreating(true)}
          >
            Add case study
          </Button>
        </div>
      ) : null}

      <ul className="mt-6 space-y-3">
        {query.data?.items.map((item) => (
          <li
            key={item.id}
            className="border-line bg-surface flex flex-wrap items-center gap-3 rounded-[var(--radius-lg)] border p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.title.en}</p>
              <p className="text-muted-foreground text-xs">
                {item.slug}
                {item.industry ? ` · ${item.industry}` : ""}
              </p>
            </div>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4"
                checked={item.approvedForWebsite}
                disabled={updateMut.isPending}
                onChange={(e) =>
                  updateMut.mutate({
                    id: item.id,
                    body: {
                      approvedForWebsite: e.target.checked,
                      version: item.version,
                    },
                  })
                }
              />
              Approved
            </label>
            <select
              className="border-line min-h-11 rounded-[var(--radius-md)] border px-3 text-sm"
              value={item.publishStatus}
              disabled={updateMut.isPending}
              onChange={(e) =>
                updateMut.mutate({
                  id: item.id,
                  body: {
                    publishStatus: e.target.value,
                    version: item.version,
                  },
                })
              }
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
            <Button
              type="button"
              variant="ghost"
              className="min-h-11"
              onClick={() => {
                if (confirm(`Delete “${item.title.en}”?`)) {
                  deleteMut.mutate(item.id);
                }
              }}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
