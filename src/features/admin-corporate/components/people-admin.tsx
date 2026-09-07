"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  createPersonApi,
  deletePersonApi,
  fetchPeople,
  updatePersonApi,
} from "@/features/admin-corporate/lib/api";
import { slugify } from "@/features/admin-corporate/lib/slugify";
import type { PersonDTO } from "@/modules/corporate";

const ROLES: PersonDTO["role"][] = [
  "director",
  "chairman",
  "md",
  "company_secretary",
  "executive",
];

export function PeopleAdmin() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [role, setRole] = useState<PersonDTO["role"]>("director");
  const [slugTouched, setSlugTouched] = useState(false);

  const query = useQuery({
    queryKey: ["corporate-people"],
    queryFn: () => fetchPeople(),
  });

  const createMut = useMutation({
    mutationFn: () =>
      createPersonApi({
        name: { en: name.trim() },
        slug: slug.trim() || slugify(name),
        role,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["corporate-people"] });
      setCreating(false);
      setName("");
      setSlug("");
      setSlugTouched(false);
      setRole("director");
    },
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Record<string, unknown>;
    }) => updatePersonApi(id, body),
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-people"] }),
  });

  const deleteMut = useMutation({
    mutationFn: deletePersonApi,
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-people"] }),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">People</h1>
        <Button
          type="button"
          className="ml-auto min-h-11"
          onClick={() => setCreating(true)}
        >
          Add person
        </Button>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Leadership and board profiles for corporate pages.
      </p>

      {creating ? (
        <div className="border-line bg-surface mt-6 max-w-lg space-y-3 rounded-[var(--radius-lg)] border p-4">
          <p className="text-sm font-semibold">New person</p>
          <label className="block text-sm">
            Name
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
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
            Role
            <select
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={role}
              onChange={(e) => setRole(e.target.value as PersonDTO["role"])}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              className="min-h-11"
              disabled={!name.trim() || createMut.isPending}
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
          <p className="font-medium">No people yet</p>
          <Button
            type="button"
            className="mt-4 min-h-11"
            onClick={() => setCreating(true)}
          >
            Add person
          </Button>
        </div>
      ) : null}

      <ul className="mt-6 space-y-3">
        {query.data?.items.map((person) => (
          <li
            key={person.id}
            className="border-line bg-surface flex flex-wrap items-center gap-3 rounded-[var(--radius-lg)] border p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium">{person.name.en}</p>
              <p className="text-muted-foreground text-xs">
                {person.slug} · {person.role}
              </p>
            </div>
            <select
              className="border-line min-h-11 rounded-[var(--radius-md)] border px-3 text-sm"
              value={person.status}
              disabled={updateMut.isPending}
              onChange={(e) =>
                updateMut.mutate({
                  id: person.id,
                  body: {
                    status: e.target.value,
                    version: person.version,
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
                if (confirm(`Delete “${person.name.en}”?`)) {
                  deleteMut.mutate(person.id);
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
