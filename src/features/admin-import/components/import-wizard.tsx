"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type Preview = {
  mode: string;
  entity: string;
  validCount: number;
  errorCount: number;
  results: { row: number; ok: boolean; errors?: string[] }[];
  committed?: number;
  failed?: { row: number; errors?: string[] }[];
};

const ENTITIES = [
  { value: "products", label: "Products" },
  { value: "categories", label: "Categories (flat)" },
  { value: "capacity_metrics", label: "Capacity metrics" },
  { value: "dictionary_items", label: "Dictionary items" },
] as const;

export function ImportWizard() {
  const [entity, setEntity] = useState<string>("capacity_metrics");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(mode: "dry-run" | "commit") {
    if (!file) {
      setMsg("Choose a CSV file first.");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const form = new FormData();
      form.append("entity", entity);
      form.append("mode", mode);
      form.append("file", file);
      const res = await fetch("/api/v1/import", { method: "POST", body: form });
      const json = (await res.json()) as {
        data?: Preview;
        error?: { message?: string };
      };
      if (!res.ok) throw new Error(json.error?.message ?? res.statusText);
      setPreview(json.data ?? null);
      setMsg(
        mode === "dry-run"
          ? `Dry-run: ${json.data?.validCount ?? 0} valid, ${json.data?.errorCount ?? 0} errors`
          : `Committed ${json.data?.committed ?? 0} rows`,
      );
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        CSV import
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
        Upload → preview with Zod validation → dry-run or commit (max 500
        rows).
      </p>

      <div className="border-line bg-surface mt-6 max-w-xl space-y-4 rounded-[var(--radius-lg)] border p-4">
        <label className="block text-sm font-medium">
          Entity
          <select
            className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
          >
            {ENTITIES.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          CSV file
          <input
            type="file"
            accept=".csv,text/csv"
            className="border-line mt-1 block w-full text-sm"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="min-h-11"
            disabled={busy}
            onClick={() => void run("dry-run")}
          >
            Dry-run
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            disabled={busy || (preview?.errorCount ?? 1) > 0}
            onClick={() => void run("commit")}
          >
            Commit import
          </Button>
          <a
            href={`/api/v1/export?entity=${entity}`}
            className="border-line inline-flex min-h-11 items-center rounded-[var(--radius-md)] border px-4 text-sm"
          >
            Export template sample
          </a>
        </div>
        {msg ? (
          <p className="text-sm" role="status">
            {msg}
          </p>
        ) : null}
      </div>

      {preview ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-line border-b">
                <th className="py-2 pr-4">Row</th>
                <th className="py-2 pr-4">OK</th>
                <th className="py-2">Errors</th>
              </tr>
            </thead>
            <tbody>
              {preview.results.map((r) => (
                <tr key={r.row} className="border-line border-b">
                  <td className="py-2 pr-4">{r.row}</td>
                  <td className="py-2 pr-4">{r.ok ? "yes" : "no"}</td>
                  <td className="py-2 text-red-700">
                    {r.errors?.join("; ") ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
