"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  createCertificationApi,
  deleteCertificationApi,
  fetchCertifications,
  updateCertificationApi,
} from "@/features/admin-corporate/lib/api";
import type { CertificationDTO } from "@/modules/corporate";

const TYPES: CertificationDTO["type"][] = [
  "iso",
  "quality_policy",
  "test_certificate_template",
  "other",
];

export function CertificationsAdmin() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<CertificationDTO["type"]>("iso");
  const [issuer, setIssuer] = useState("");

  const query = useQuery({
    queryKey: ["corporate-certifications"],
    queryFn: () => fetchCertifications(),
  });

  const createMut = useMutation({
    mutationFn: () =>
      createCertificationApi({
        name: name.trim(),
        type,
        issuer: issuer.trim(),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["corporate-certifications"] });
      setCreating(false);
      setName("");
      setType("iso");
      setIssuer("");
    },
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Record<string, unknown>;
    }) => updateCertificationApi(id, body),
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-certifications"] }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteCertificationApi,
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-certifications"] }),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Certifications
        </h1>
        <Button
          type="button"
          className="ml-auto min-h-11"
          onClick={() => setCreating(true)}
        >
          Add certification
        </Button>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        ISO and quality documents shown on corporate pages.
      </p>

      {creating ? (
        <div className="border-line bg-surface mt-6 max-w-lg space-y-3 rounded-[var(--radius-lg)] border p-4">
          <p className="text-sm font-semibold">New certification</p>
          <label className="block text-sm">
            Name
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ISO 9001:2015"
            />
          </label>
          <label className="block text-sm">
            Type
            <select
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={type}
              onChange={(e) =>
                setType(e.target.value as CertificationDTO["type"])
              }
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Issuer
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
            />
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
          <p className="font-medium">No certifications yet</p>
          <Button
            type="button"
            className="mt-4 min-h-11"
            onClick={() => setCreating(true)}
          >
            Add certification
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
              <p className="font-medium">{item.name}</p>
              <p className="text-muted-foreground text-xs">
                {item.type}
                {item.issuer ? ` · ${item.issuer}` : ""}
              </p>
            </div>
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
                if (confirm(`Delete “${item.name}”?`)) {
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
