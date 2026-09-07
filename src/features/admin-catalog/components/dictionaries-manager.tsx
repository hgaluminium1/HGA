"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DICTIONARY_KEYS } from "@/modules/catalog/browser";
import {
  ApiClientError,
  addDictionaryItemApi,
  deactivateDictionaryItemApi,
  fetchDictionaries,
} from "@/features/admin-catalog/lib/api";

const LABELS: Record<(typeof DICTIONARY_KEYS)[number], string> = {
  alloy_grade: "Alloy grades",
  temper: "Tempers",
  surface_finish: "Surface finishes",
  anodizing_color: "Anodizing colors",
  ral_color: "RAL colors",
  tolerance_standard: "Tolerance standards",
  packaging: "Packaging",
};

export function DictionariesManager() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["dictionaries"],
    queryFn: fetchDictionaries,
  });
  const [key, setKey] =
    useState<(typeof DICTIONARY_KEYS)[number]>("alloy_grade");
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");

  const active = query.data?.items.find((d) => d.key === key);

  const addMut = useMutation({
    mutationFn: () =>
      addDictionaryItemApi({
        key,
        version: active?.version ?? 0,
        item: {
          value: value.trim(),
          label: { en: label.trim() || value.trim() },
          sortOrder: active?.items.length ?? 0,
          active: true,
        },
      }),
    onSuccess: () => {
      setValue("");
      setLabel("");
      void qc.invalidateQueries({ queryKey: ["dictionaries"] });
    },
    onError: (err) => {
      if (err instanceof ApiClientError && err.status === 409) {
        alert(err.message);
        void qc.invalidateQueries({ queryKey: ["dictionaries"] });
      }
    },
  });

  const deactivateMut = useMutation({
    mutationFn: (itemValue: string) =>
      deactivateDictionaryItemApi({
        key,
        value: itemValue,
        version: active?.version ?? 0,
      }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["dictionaries"] }),
    onError: (err) => {
      if (err instanceof ApiClientError && err.status === 409) {
        alert(err.message);
        void qc.invalidateQueries({ queryKey: ["dictionaries"] });
      }
    },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Dictionaries
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Spec options for product forms — add alloys and finishes without code.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {DICTIONARY_KEYS.map((k) => (
          <button
            key={k}
            type="button"
            className={`min-h-11 rounded-[var(--radius-md)] px-3 text-sm font-medium ${
              key === k ? "bg-brand/10 text-brand" : "border-line border"
            }`}
            onClick={() => setKey(k)}
          >
            {LABELS[k]}
          </button>
        ))}
      </div>

      <div className="border-line bg-surface mt-6 max-w-xl space-y-3 rounded-[var(--radius-lg)] border p-4">
        <p className="text-sm font-semibold">Add to {LABELS[key]}</p>
        <label className="block text-sm">
          Value (code)
          <input
            className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 6005A"
          />
        </label>
        <label className="block text-sm">
          Label
          <input
            className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Display label"
          />
        </label>
        <Button
          type="button"
          className="min-h-11"
          disabled={!value.trim() || addMut.isPending || !active}
          onClick={() => addMut.mutate()}
        >
          Add item
        </Button>
        {addMut.isError ? (
          <p className="text-sm text-destructive">
            {(addMut.error as Error).message}
          </p>
        ) : null}
      </div>

      {query.isLoading ? (
        <p className="text-muted-foreground mt-8 text-sm">Loading…</p>
      ) : null}

      {!active?.items.length ? (
        <div className="border-line mt-8 rounded-[var(--radius-lg)] border border-dashed p-8 text-center">
          <p className="font-medium">No items yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Add one above, or run npm run seed:dictionaries.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {active.items.map((item) => (
            <li
              key={item.value}
              className="border-line bg-surface flex flex-wrap items-center gap-3 rounded-[var(--radius-lg)] border p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.label.en}</p>
                <p className="text-muted-foreground text-xs">
                  {item.value}
                  {!item.active ? " · inactive" : ""}
                </p>
              </div>
              {item.active ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="min-h-11"
                  onClick={() => deactivateMut.mutate(item.value)}
                >
                  Deactivate
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
