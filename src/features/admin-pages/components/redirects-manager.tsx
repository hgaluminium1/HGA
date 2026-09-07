"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  createRedirectApi,
  deleteRedirectApi,
  fetchRedirects,
} from "@/features/admin-pages/lib/api";

export function RedirectsManager() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["redirects"],
    queryFn: fetchRedirects,
  });
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");
  const [statusCode, setStatusCode] = useState<301 | 302>(301);

  const createMut = useMutation({
    mutationFn: createRedirectApi,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["redirects"] });
      setFromPath("");
      setToPath("");
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteRedirectApi,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["redirects"] }),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Redirects</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Map old paths to new ones (301 permanent or 302 temporary).
      </p>

      <div className="border-line bg-surface mt-6 grid max-w-2xl gap-3 rounded-[var(--radius-lg)] border p-4">
        <label className="text-sm font-medium">
          From path
          <input
            className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
            placeholder="/en/old-slug"
            value={fromPath}
            onChange={(e) => setFromPath(e.target.value)}
          />
        </label>
        <label className="text-sm font-medium">
          To path
          <input
            className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
            placeholder="/en/new-slug"
            value={toPath}
            onChange={(e) => setToPath(e.target.value)}
          />
        </label>
        <label className="text-sm font-medium">
          Status code
          <select
            className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
            value={statusCode}
            onChange={(e) =>
              setStatusCode(Number(e.target.value) as 301 | 302)
            }
          >
            <option value={301}>301 Permanent</option>
            <option value={302}>302 Temporary</option>
          </select>
        </label>
        <Button
          type="button"
          className="min-h-11 w-fit"
          disabled={!fromPath || !toPath || createMut.isPending}
          onClick={() =>
            createMut.mutate({ fromPath, toPath, statusCode, active: true })
          }
        >
          Add redirect
        </Button>
        {createMut.isError ? (
          <p className="text-sm text-destructive">
            {(createMut.error as Error).message}
          </p>
        ) : null}
      </div>

      {query.isLoading ? (
        <p className="text-muted-foreground mt-8 text-sm">Loading…</p>
      ) : null}

      {query.data && query.data.items.length === 0 ? (
        <div className="border-line mt-8 rounded-[var(--radius-lg)] border border-dashed p-8 text-center">
          <p className="font-medium">No redirects yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Create one above, or change a page slug to auto-create a 301.
          </p>
        </div>
      ) : null}

      <ul className="mt-6 space-y-3">
        {query.data?.items.map((item) => (
          <li
            key={item.id}
            className="border-line bg-surface flex flex-wrap items-center gap-3 rounded-[var(--radius-lg)] border p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm">
                {item.fromPath} → {item.toPath}
              </p>
              <p className="text-muted-foreground text-xs">
                {item.statusCode} · {item.active ? "active" : "inactive"}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="min-h-11"
              onClick={() => {
                if (confirm("Delete this redirect?")) {
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
