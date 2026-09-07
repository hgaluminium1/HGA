"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  createSustainabilityApi,
  deleteSustainabilityApi,
  fetchSustainability,
  updateSustainabilityApi,
} from "@/features/admin-corporate/lib/api";
import type { SustainabilityMetricDTO } from "@/modules/corporate";

const TIERS: SustainabilityMetricDTO["disclosureTier"][] = [
  "verified_metric",
  "initiative",
  "commitment",
];

export function SustainabilityAdmin() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [disclosureTier, setDisclosureTier] =
    useState<SustainabilityMetricDTO["disclosureTier"]>("commitment");

  const query = useQuery({
    queryKey: ["corporate-sustainability"],
    queryFn: () => fetchSustainability(),
  });

  const createMut = useMutation({
    mutationFn: () =>
      createSustainabilityApi({
        key: key.trim(),
        label: { en: label.trim() || key.trim() },
        value: value.trim() || null,
        unit: unit.trim(),
        disclosureTier,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["corporate-sustainability"] });
      setCreating(false);
      setKey("");
      setLabel("");
      setValue("");
      setUnit("");
      setDisclosureTier("commitment");
    },
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Record<string, unknown>;
    }) => updateSustainabilityApi(id, body),
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-sustainability"] }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteSustainabilityApi,
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-sustainability"] }),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Sustainability
        </h1>
        <Button
          type="button"
          className="ml-auto min-h-11"
          onClick={() => setCreating(true)}
        >
          Add metric
        </Button>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        ESG metrics and commitments with disclosure tiering.
      </p>

      {creating ? (
        <div className="border-line bg-surface mt-6 max-w-lg space-y-3 rounded-[var(--radius-lg)] border p-4">
          <p className="text-sm font-semibold">New sustainability metric</p>
          <label className="block text-sm">
            Key
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Label
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              Value
              <input
                className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Unit
              <input
                className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </label>
          </div>
          <label className="block text-sm">
            Disclosure tier
            <select
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={disclosureTier}
              onChange={(e) =>
                setDisclosureTier(
                  e.target
                    .value as SustainabilityMetricDTO["disclosureTier"],
                )
              }
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              className="min-h-11"
              disabled={!key.trim() || createMut.isPending}
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
          <p className="font-medium">No sustainability metrics yet</p>
          <Button
            type="button"
            className="mt-4 min-h-11"
            onClick={() => setCreating(true)}
          >
            Add metric
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
              <p className="font-medium">{item.label.en}</p>
              <p className="text-muted-foreground text-xs">
                {item.key} · {item.disclosureTier}
                {item.value != null ? ` · ${item.value}` : ""}
                {item.unit ? ` ${item.unit}` : ""}
              </p>
            </div>
            <select
              className="border-line min-h-11 rounded-[var(--radius-md)] border px-3 text-sm"
              value={item.verificationStatus}
              disabled={updateMut.isPending}
              onChange={(e) =>
                updateMut.mutate({
                  id: item.id,
                  body: {
                    verificationStatus: e.target.value,
                    version: item.version,
                  },
                })
              }
            >
              <option value="draft">draft</option>
              <option value="verified">verified</option>
            </select>
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
              <option value="hidden">hidden</option>
              <option value="published">published</option>
            </select>
            <Button
              type="button"
              variant="ghost"
              className="min-h-11"
              onClick={() => {
                if (confirm(`Delete “${item.label.en}”?`)) {
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
