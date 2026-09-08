"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClass =
  "h-8 w-full rounded-[6px] border border-[#d2d2d7] bg-white px-2.5 text-[13px] text-[#1d1d1f] outline-none transition placeholder:text-[#86868b] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20";

type StatRow = {
  target: number;
  suffix: string;
  label: string;
};

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-1", className)}>
      <span className="text-[11px] font-medium tracking-tight text-[#86868b]">
        {label}
      </span>
      {children}
    </label>
  );
}

function parseStats(raw: unknown): StatRow[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s) => {
    const r = asRecord(s);
    return {
      target: typeof r.target === "number" ? r.target : Number(r.target) || 0,
      suffix: typeof r.suffix === "string" ? r.suffix : "",
      label: typeof r.label === "string" ? r.label : "",
    };
  });
}

function parseHighlights(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(String).filter(Boolean);
}

/**
 * Compact capability editor (Linear / Ads Manager density).
 * Stats are an ordered list — public site maps all of them into a responsive grid.
 */
export function CapabilitySectionForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const d = asRecord(value);
  const stats = parseStats(d.stats);
  const highlights = parseHighlights(d.highlightWords);
  const [chipDraft, setChipDraft] = useState("");

  function patch(partial: Record<string, unknown>) {
    onChange({ ...d, ...partial });
  }

  function setStats(next: StatRow[]) {
    patch({ stats: next });
  }

  function updateStat(i: number, next: StatRow) {
    setStats(stats.map((s, idx) => (idx === i ? next : s)));
  }

  function moveStat(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= stats.length) return;
    const next = [...stats];
    const tmp = next[i]!;
    next[i] = next[j]!;
    next[j] = tmp;
    setStats(next);
  }

  function addHighlight() {
    const w = chipDraft.trim();
    if (!w) return;
    if (highlights.some((h) => h.toLowerCase() === w.toLowerCase())) {
      setChipDraft("");
      return;
    }
    patch({ highlightWords: [...highlights, w] });
    setChipDraft("");
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#d2d2d7] bg-white">
      {/* Copy block */}
      <div className="grid gap-2.5 p-3 sm:grid-cols-2">
        <Field label="Eyebrow">
          <input
            className={inputClass}
            value={typeof d.eyebrow === "string" ? d.eyebrow : ""}
            onChange={(e) => patch({ eyebrow: e.target.value })}
          />
        </Field>
        <Field label="Headline">
          <input
            className={inputClass}
            value={typeof d.title === "string" ? d.title : ""}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </Field>
        <Field label="Body" className="sm:col-span-2">
          <textarea
            className={cn(inputClass, "h-auto min-h-[72px] resize-y py-2 leading-snug")}
            value={typeof d.body === "string" ? d.body : ""}
            onChange={(e) => patch({ body: e.target.value })}
            rows={3}
          />
        </Field>
      </div>

      {/* Highlight chips — words underlined in the public body */}
      <div className="border-t border-[#e8e8ed] px-3 py-2.5">
        <p className="text-[11px] font-medium tracking-tight text-[#86868b]">
          Highlight words
          <span className="ml-1.5 font-normal text-[#aeaeb2]">
            underlined in the body on the site
          </span>
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {highlights.map((word) => (
            <span
              key={word}
              className="inline-flex h-7 items-center gap-1 rounded-full bg-[#f5f5f7] py-0 pl-2.5 pr-1 text-[12px] font-medium text-[#1d1d1f]"
            >
              {word}
              <button
                type="button"
                className="flex size-5 items-center justify-center rounded-full text-[#86868b] transition hover:bg-black/5 hover:text-[#1d1d1f]"
                aria-label={`Remove ${word}`}
                onClick={() =>
                  patch({
                    highlightWords: highlights.filter((h) => h !== word),
                  })
                }
              >
                <X className="size-3 stroke-[2.5]" />
              </button>
            </span>
          ))}
          <input
            className="h-7 min-w-[7rem] flex-1 rounded-[6px] border border-transparent bg-transparent px-2 text-[12px] outline-none placeholder:text-[#aeaeb2] focus:border-[#d2d2d7] focus:bg-white"
            value={chipDraft}
            placeholder="Add word · Enter"
            onChange={(e) => setChipDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addHighlight();
              }
              if (e.key === "Backspace" && !chipDraft && highlights.length) {
                patch({ highlightWords: highlights.slice(0, -1) });
              }
            }}
            onBlur={addHighlight}
          />
        </div>
      </div>

      {/* Stats table — N rows → public 2-col (or auto-fit) grid */}
      <div className="border-t border-[#e8e8ed]">
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <div>
            <p className="text-[11px] font-medium tracking-tight text-[#86868b]">
              Stats
            </p>
            <p className="text-[10px] text-[#aeaeb2]">
              Shown as animated numbers on the right. Add as many as you need.
            </p>
          </div>
          <span className="rounded-full bg-[#f5f5f7] px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[#86868b]">
            {stats.length}
          </span>
        </div>

        {stats.length === 0 ? (
          <p className="px-3 pb-3 text-[12px] text-[#86868b]">
            No stats yet — add one to fill the metrics grid.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-left">
              <thead>
                <tr className="border-y border-[#e8e8ed] bg-[#fafafa] text-[10px] font-semibold tracking-wide text-[#86868b] uppercase">
                  <th className="px-2 py-1.5 font-semibold">Number</th>
                  <th className="w-[5.5rem] px-2 py-1.5 font-semibold">
                    Suffix
                  </th>
                  <th className="px-2 py-1.5 font-semibold">Label</th>
                  <th className="w-[5.5rem] px-1 py-1.5" />
                </tr>
              </thead>
              <tbody>
                {stats.map((stat, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#e8e8ed] last:border-b-0"
                  >
                    <td className="px-2 py-1.5">
                      <input
                        type="number"
                        className={cn(inputClass, "tabular-nums")}
                        value={stat.target}
                        onChange={(e) =>
                          updateStat(i, {
                            ...stat,
                            target: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        className={inputClass}
                        value={stat.suffix}
                        placeholder="+"
                        onChange={(e) =>
                          updateStat(i, { ...stat, suffix: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        className={inputClass}
                        value={stat.label}
                        placeholder="e.g. Years"
                        onChange={(e) =>
                          updateStat(i, { ...stat, label: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-1 py-1.5">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          className="inline-flex size-7 items-center justify-center rounded-[6px] text-[#86868b] transition hover:bg-black/5 hover:text-[#1d1d1f] disabled:opacity-30"
                          aria-label="Move up"
                          disabled={i === 0}
                          onClick={() => moveStat(i, -1)}
                        >
                          <ArrowUp className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex size-7 items-center justify-center rounded-[6px] text-[#86868b] transition hover:bg-black/5 hover:text-[#1d1d1f] disabled:opacity-30"
                          aria-label="Move down"
                          disabled={i === stats.length - 1}
                          onClick={() => moveStat(i, 1)}
                        >
                          <ArrowDown className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex size-7 items-center justify-center rounded-[6px] text-[#ff3b30] transition hover:bg-[#ff3b30]/10"
                          aria-label={`Remove stat ${i + 1}`}
                          onClick={() =>
                            setStats(stats.filter((_, idx) => idx !== i))
                          }
                        >
                          <X className="size-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-2 py-2">
          <Button
            type="button"
            variant="ghost"
            className="h-8 px-2 text-[12px] font-medium text-[#0071e3] hover:bg-[#0071e3]/08 hover:text-[#0071e3]"
            onClick={() =>
              setStats([...stats, { target: 0, suffix: "", label: "" }])
            }
          >
            <Plus className="size-3.5" />
            Add stat
          </Button>
        </div>
      </div>
    </div>
  );
}
