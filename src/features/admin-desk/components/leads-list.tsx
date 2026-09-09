"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";

import { DeskBackLink } from "@/features/admin-desk/components/desk-back-link";
import { ApiClientError } from "@/features/admin-desk/lib/api";
import { fetchLeadsApi } from "@/features/admin-desk/lib/leads-api";
import type { EnquiryDTO, EnquiryStatus } from "@/modules/enquiries/browser";
import { cn } from "@/lib/utils";

function statusTone(status: EnquiryStatus) {
  if (status === "new") return "bg-brand-red/10 text-brand-red";
  if (status === "read") return "bg-brand-blue-light text-brand-blue";
  return "bg-[#f5f5f7] text-[#86868b]";
}

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function LeadsList() {
  const [items, setItems] = useState<EnquiryDTO[]>([]);
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<EnquiryStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeadsApi({
        q: query || undefined,
        status,
      });
      setItems(data.items);
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "Failed to load leads",
      );
    } finally {
      setLoading(false);
    }
  }, [query, status]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto flex w-full max-w-[56rem] flex-col gap-4 pb-4">
      <header className="flex flex-col gap-2">
        <DeskBackLink href="/admin/pages" label="Back to pages" />
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight">
            Leads
          </h1>
          <p className="text-muted-foreground mt-1 text-[0.8125rem]">
            Contact / RFQ submissions. Sales is emailed on submit; this inbox is
            the source of truth.
          </p>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["all", "new", "read", "archived"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={cn(
              "h-8 rounded-full px-3 text-[0.75rem] font-semibold capitalize transition-colors",
              status === s
                ? "bg-ink text-white"
                : "bg-[#f5f5f7] text-[#424245] hover:bg-[#e8e8ed]",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(q.trim());
        }}
      >
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-[#aeaeb2]" />
          <input
            className="border-line h-9 w-full rounded-md border bg-white pr-3 pl-8 text-[0.8125rem] outline-none focus:border-[#0071e3]"
            placeholder="Search name, email, company…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="border-line h-9 rounded-md border bg-white px-3 text-[0.8125rem] font-medium hover:bg-[#f5f5f7]"
        >
          Search
        </button>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading leads…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed border-line px-4 py-8 text-center text-sm">
          No leads yet. Submissions from the public contact / RFQ form appear
          here.
        </p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
          {items.map((lead) => (
            <li key={lead.id}>
              <Link
                href={`/admin/leads/${lead.id}`}
                className="hover:bg-bg-alt flex flex-col gap-1 px-4 py-3 transition-colors min-[640px]:flex-row min-[640px]:items-center min-[640px]:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-[0.875rem] font-semibold text-ink">
                    {lead.name}
                    {lead.company ? (
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        · {lead.company}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-muted-foreground truncate text-[0.75rem]">
                    {lead.email}
                    {lead.productInterest
                      ? ` · ${lead.productInterest}`
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.65rem] font-bold tracking-wide uppercase",
                      statusTone(lead.status),
                    )}
                  >
                    {lead.status}
                  </span>
                  <span className="text-muted-foreground text-[0.7rem]">
                    {formatWhen(lead.createdAt)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
