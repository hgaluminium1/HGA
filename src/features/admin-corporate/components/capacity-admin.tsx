"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  createCapacityMetricApi,
  deleteCapacityMetricApi,
  fetchCapacityMetrics,
  updateCapacityMetricApi,
} from "@/features/admin-corporate/lib/api";
import type { CapacityMetricDTO } from "@/modules/corporate";

const CATEGORIES: CapacityMetricDTO["category"][] = [
  "extrusion",
  "billet",
  "ingot",
  "melting",
  "press",
  "dimension",
  "commercial",
];

const VERIFICATION: CapacityMetricDTO["verificationStatus"][] = [
  "draft",
  "needs_verification",
  "verified",
];

const PUBLISH: CapacityMetricDTO["publishStatus"][] = ["hidden", "published"];

export function CapacityAdmin() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] =
    useState<CapacityMetricDTO["category"]>("extrusion");
  const [verificationStatus, setVerificationStatus] =
    useState<CapacityMetricDTO["verificationStatus"]>("draft");
  const [publishStatus, setPublishStatus] =
    useState<CapacityMetricDTO["publishStatus"]>("hidden");

  const query = useQuery({
    queryKey: ["corporate-capacity"],
    queryFn: () => fetchCapacityMetrics(),
  });

  const createMut = useMutation({
    mutationFn: () =>
      createCapacityMetricApi({
        key: key.trim(),
        label: { en: label.trim() || key.trim() },
        value: value.trim(),
        unit: unit.trim(),
        category,
        verificationStatus,
        publishStatus,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["corporate-capacity"] });
      setCreating(false);
      setKey("");
      setLabel("");
      setValue("");
      setUnit("");
      setCategory("extrusion");
      setVerificationStatus("draft");
      setPublishStatus("hidden");
    },
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Record<string, unknown>;
    }) => updateCapacityMetricApi(id, body),
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-capacity"] }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteCapacityMetricApi,
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["corporate-capacity"] }),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Capacity metrics
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
        Plant capacity figures with verification and publish controls.
      </p>

      {creating ? (
        <div className="border-line bg-surface mt-6 max-w-lg space-y-3 rounded-[var(--radius-lg)] border p-4">
          <p className="text-sm font-semibold">New capacity metric</p>
          <label className="block text-sm">
            Key
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. extrusion_tpa"
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
                placeholder="TPA"
              />
            </label>
          </div>
          <label className="block text-sm">
            Category
            <select
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as CapacityMetricDTO["category"])
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              Verification
              <select
                className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
                value={verificationStatus}
                onChange={(e) =>
                  setVerificationStatus(
                    e.target.value as CapacityMetricDTO["verificationStatus"],
                  )
                }
              >
                {VERIFICATION.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Publish
              <select
                className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
                value={publishStatus}
                onChange={(e) =>
                  setPublishStatus(
                    e.target.value as CapacityMetricDTO["publishStatus"],
                  )
                }
              >
                {PUBLISH.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              className="min-h-11"
              disabled={!key.trim() || !value.trim() || createMut.isPending}
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
          <p className="font-medium">No capacity metrics yet</p>
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
                {item.key} · {item.value}
                {item.unit ? ` ${item.unit}` : ""} · {item.category}
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
              {VERIFICATION.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
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
              {PUBLISH.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
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
