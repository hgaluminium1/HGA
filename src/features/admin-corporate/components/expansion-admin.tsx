"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  createExpansionApi,
  deleteExpansionApi,
  fetchExpansionProjects,
  updateExpansionApi,
} from "@/features/admin-corporate/lib/api";
import { slugify } from "@/features/admin-corporate/lib/slugify";
import type { ExpansionProjectDTO } from "@/modules/corporate";

const STATUSES: ExpansionProjectDTO["status"][] = [
  "planned",
  "proposed",
  "confirmed",
];

export function ExpansionAdmin() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] =
    useState<ExpansionProjectDTO["status"]>("planned");
  const [slugTouched, setSlugTouched] = useState(false);

  const query = useQuery({
    queryKey: ["corporate-expansion"],
    queryFn: () => fetchExpansionProjects(),
  });

  const createMut = useMutation({
    mutationFn: () =>
      createExpansionApi({
        title: { en: title.trim() },
        slug: slug.trim() || slugify(title),
        status,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["corporate-expansion"] });
      setCreating(false);
      setTitle("");
      setSlug("");
      setSlugTouched(false);
      setStatus("planned");
    },
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Record<string, unknown>;
    }) => updateExpansionApi(id, body),
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-expansion"] }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteExpansionApi,
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-expansion"] }),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Expansion
        </h1>
        <Button
          type="button"
          className="ml-auto min-h-11"
          onClick={() => setCreating(true)}
        >
          Create project
        </Button>
      </div>
      <p className="text-muted-foreground mt-2 text-sm">
        INR figures only appear publicly when disclosure is approved.
      </p>

      {creating ? (
        <div className="border-line bg-surface mt-6 max-w-lg space-y-3 rounded-[var(--radius-lg)] border p-4">
          <label className="block text-sm font-medium">
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
          <label className="block text-sm font-medium">
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
          <label className="block text-sm font-medium">
            Status
            <select
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as ExpansionProjectDTO["status"])
              }
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              className="min-h-11"
              disabled={!title || createMut.isPending}
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
        </div>
      ) : null}

      <ul className="mt-6 space-y-3">
        {query.data?.items.map((p) => (
          <li
            key={p.id}
            className="border-line bg-surface rounded-[var(--radius-lg)] border p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{p.title.en}</p>
                <p className="text-muted-foreground text-sm">
                  {p.slug} · {p.status} · {p.publishStatus}
                  {p.publicDisclosureApproved ? " · INR disclosed" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="min-h-11"
                  onClick={() =>
                    updateMut.mutate({
                      id: p.id,
                      body: {
                        publishStatus:
                          p.publishStatus === "published"
                            ? "draft"
                            : "published",
                        version: p.version,
                      },
                    })
                  }
                >
                  {p.publishStatus === "published" ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="min-h-11"
                  onClick={() =>
                    updateMut.mutate({
                      id: p.id,
                      body: {
                        publicDisclosureApproved: !p.publicDisclosureApproved,
                        version: p.version,
                      },
                    })
                  }
                >
                  {p.publicDisclosureApproved
                    ? "Revoke INR disclosure"
                    : "Approve INR disclosure"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-11"
                  onClick={() => {
                    if (confirm("Trash this project?"))
                      deleteMut.mutate(p.id);
                  }}
                >
                  Trash
                </Button>
              </div>
            </div>
            <label className="mt-3 block text-sm font-medium">
              Project cost (INR crore)
              <input
                type="number"
                className="border-line mt-1 min-h-11 w-full max-w-xs rounded-[var(--radius-md)] border px-3"
                defaultValue={p.projectCostInr ?? ""}
                onBlur={(e) => {
                  const v = e.target.value;
                  updateMut.mutate({
                    id: p.id,
                    body: {
                      projectCostInr: v === "" ? null : Number(v),
                      version: p.version,
                    },
                  });
                }}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
