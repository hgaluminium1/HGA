"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { MediaPicker } from "@/features/admin-media/components/media-picker";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [role, setRole] = useState<PersonDTO["role"]>("chairman");
  const [designation, setDesignation] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoId, setPhotoId] = useState<string | null>(null);
  const [showOnChairmansPage, setShowOnChairmansPage] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [slugTouched, setSlugTouched] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const query = useQuery({
    queryKey: ["corporate-people"],
    queryFn: () => fetchPeople(),
  });

  function resetForm() {
    setCreating(false);
    setEditingId(null);
    setName("");
    setSlug("");
    setRole("chairman");
    setDesignation("");
    setBio("");
    setPhotoUrl("");
    setPhotoId(null);
    setShowOnChairmansPage(true);
    setSortOrder(0);
    setSlugTouched(false);
    setPickerOpen(false);
  }

  function startEdit(person: PersonDTO) {
    setEditingId(person.id);
    setCreating(false);
    setName(person.name.en);
    setSlug(person.slug);
    setRole(person.role);
    setDesignation(person.boardDesignation);
    setBio(person.bio?.en ?? "");
    setPhotoUrl(person.photoUrl ?? "");
    setPhotoId(person.photoId);
    setShowOnChairmansPage(person.showOnChairmansPage || person.role === "chairman");
    setSortOrder(person.sortOrder);
    setSlugTouched(true);
    setPickerOpen(false);
  }

  const createMut = useMutation({
    mutationFn: () =>
      createPersonApi({
        name: { en: name.trim() },
        slug: slug.trim() || slugify(name),
        role,
        boardDesignation: designation.trim(),
        bio: { en: bio },
        photoUrl: photoUrl || null,
        photoId,
        showOnChairmansPage,
        sortOrder,
        status: "draft",
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["corporate-people"] });
      resetForm();
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
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["corporate-people"] });
      if (editingId) resetForm();
    },
  });

  const deleteMut = useMutation({
    mutationFn: deletePersonApi,
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-people"] }),
  });

  const editing = editingId
    ? query.data?.items.find((p) => p.id === editingId)
    : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-semibold text-ink">
            People / Chairmen
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Add N chairmen with photo and message for the Chairman’s Message
            page. Leadership grid uses all published people.
          </p>
        </div>
        <Button
          type="button"
          className="min-h-11"
          onClick={() => {
            resetForm();
            setCreating(true);
          }}
        >
          Add person
        </Button>
      </div>

      {creating || editing ? (
        <div className="border-line bg-surface mt-6 max-w-xl space-y-3 rounded-[var(--radius-lg)] border p-4">
          <p className="text-sm font-semibold">
            {editing ? `Edit ${editing.name.en}` : "New person"}
          </p>
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
              onChange={(e) => {
                const next = e.target.value as PersonDTO["role"];
                setRole(next);
                if (next === "chairman") setShowOnChairmansPage(true);
              }}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Designation (e.g. Chairman Emeritus)
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Message / bio
            <textarea
              className="border-line mt-1 min-h-32 w-full rounded-[var(--radius-md)] border px-3 py-2"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Chairman’s message body…"
            />
          </label>
          <label className="block text-sm">
            Sort order
            <input
              type="number"
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
            />
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showOnChairmansPage}
              onChange={(e) => setShowOnChairmansPage(e.target.checked)}
            />
            Show on Chairman’s Message page
          </label>
          <div>
            <p className="mb-2 text-sm font-medium">Photo</p>
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt=""
                className="mb-2 h-32 w-24 rounded-[var(--radius-md)] object-cover"
              />
            ) : (
              <p className="text-muted-foreground mb-2 text-xs">
                No photo — upload via Media library.
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={() => setPickerOpen((v) => !v)}
            >
              {pickerOpen ? "Close picker" : "Choose photo"}
            </Button>
            {pickerOpen ? (
              <MediaPicker
                open={pickerOpen}
                onOpenChange={setPickerOpen}
                onSelect={(media) => {
                  setPhotoUrl(media.url);
                  setPhotoId(media.id);
                  setPickerOpen(false);
                }}
              />
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {editing ? (
              <Button
                type="button"
                className="min-h-11"
                disabled={!name.trim() || updateMut.isPending}
                onClick={() =>
                  updateMut.mutate({
                    id: editing.id,
                    body: {
                      name: { en: name.trim() },
                      slug: slug.trim() || slugify(name),
                      role,
                      boardDesignation: designation.trim(),
                      bio: { en: bio },
                      photoUrl: photoUrl || null,
                      photoId,
                      showOnChairmansPage,
                      sortOrder,
                      version: editing.version,
                    },
                  })
                }
              >
                Save
              </Button>
            ) : (
              <Button
                type="button"
                className="min-h-11"
                disabled={!name.trim() || createMut.isPending}
                onClick={() => createMut.mutate()}
              >
                Create
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={resetForm}
            >
              Cancel
            </Button>
          </div>
          {createMut.isError || updateMut.isError ? (
            <p className="text-sm text-destructive">
              {(
                (createMut.error || updateMut.error) as Error
              )?.message}
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
          <p className="text-muted-foreground mt-1 text-sm">
            Add a chairman with photo and message.
          </p>
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
            {person.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={person.photoUrl}
                alt=""
                className="size-12 rounded-full object-cover"
              />
            ) : (
              <div className="bg-muted size-12 rounded-full" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium">{person.name.en}</p>
              <p className="text-muted-foreground text-xs">
                {person.boardDesignation || person.role}
                {person.showOnChairmansPage || person.role === "chairman"
                  ? " · Chairman’s page"
                  : ""}
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
              variant="outline"
              className="min-h-11"
              onClick={() => startEdit(person)}
            >
              Edit
            </Button>
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
