"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  createTestimonialApi,
  deleteTestimonialApi,
  fetchTestimonials,
  updateTestimonialApi,
} from "@/features/admin-corporate/lib/api";

export function TestimonialsAdmin() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [quote, setQuote] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [company, setCompany] = useState("");

  const query = useQuery({
    queryKey: ["corporate-testimonials"],
    queryFn: () => fetchTestimonials(),
  });

  const createMut = useMutation({
    mutationFn: () =>
      createTestimonialApi({
        quote: { en: quote.trim() },
        authorName: authorName.trim(),
        authorTitle: authorTitle.trim(),
        company: company.trim(),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["corporate-testimonials"] });
      setCreating(false);
      setQuote("");
      setAuthorName("");
      setAuthorTitle("");
      setCompany("");
    },
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Record<string, unknown>;
    }) => updateTestimonialApi(id, body),
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-testimonials"] }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteTestimonialApi,
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-testimonials"] }),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Testimonials
        </h1>
        <Button
          type="button"
          className="ml-auto min-h-11"
          onClick={() => setCreating(true)}
        >
          Add testimonial
        </Button>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Customer quotes with approval and publish controls.
      </p>

      {creating ? (
        <div className="border-line bg-surface mt-6 max-w-lg space-y-3 rounded-[var(--radius-lg)] border p-4">
          <p className="text-sm font-semibold">New testimonial</p>
          <label className="block text-sm">
            Quote
            <textarea
              className="border-line mt-1 min-h-24 w-full rounded-[var(--radius-md)] border px-3 py-2"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Author name
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Author title
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={authorTitle}
              onChange={(e) => setAuthorTitle(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Company
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              className="min-h-11"
              disabled={
                !quote.trim() || !authorName.trim() || createMut.isPending
              }
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
          <p className="font-medium">No testimonials yet</p>
          <Button
            type="button"
            className="mt-4 min-h-11"
            onClick={() => setCreating(true)}
          >
            Add testimonial
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
              <p className="font-medium line-clamp-2">{item.quote.en}</p>
              <p className="text-muted-foreground text-xs">
                {item.authorName}
                {item.authorTitle ? ` · ${item.authorTitle}` : ""}
                {item.company ? ` · ${item.company}` : ""}
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
                if (confirm(`Delete testimonial by “${item.authorName}”?`)) {
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
