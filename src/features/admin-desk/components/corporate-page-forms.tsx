"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClass =
  "h-8 w-full rounded-[6px] border border-[#d2d2d7] bg-white px-2.5 text-[13px] text-[#1d1d1f] outline-none transition placeholder:text-[#86868b] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20";

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function str(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
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

function Shell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#d2d2d7] bg-white">
      {children}
      {footer ? (
        <div className="border-t border-[#e8e8ed] bg-[#fafafa] px-3 py-2.5 text-[11px] leading-snug text-[#86868b]">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

function useDraft(value: unknown, onChange: (next: unknown) => void) {
  const d = asRecord(value);
  function patch(partial: Record<string, unknown>) {
    onChange({ ...d, ...partial });
  }
  return { d, patch };
}

function IntroFields({
  d,
  patch,
  withCta,
}: {
  d: Record<string, unknown>;
  patch: (partial: Record<string, unknown>) => void;
  withCta?: boolean;
}) {
  return (
    <div className="grid gap-2.5 p-3 sm:grid-cols-2">
      <Field label="Eyebrow">
        <input
          className={inputClass}
          value={str(d.eyebrow)}
          onChange={(e) => patch({ eyebrow: e.target.value })}
        />
      </Field>
      <Field label="Headline">
        <input
          className={inputClass}
          value={str(d.title)}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </Field>
      <Field label="Body" className="sm:col-span-2">
        <textarea
          className={cn(inputClass, "h-auto min-h-[72px] resize-y py-2")}
          value={str(d.body)}
          onChange={(e) => patch({ body: e.target.value })}
          rows={3}
        />
      </Field>
      {withCta ? (
        <>
          <Field label="CTA label (optional)">
            <input
              className={inputClass}
              value={str(d.ctaLabel)}
              onChange={(e) => patch({ ctaLabel: e.target.value })}
              placeholder="View products"
            />
          </Field>
          <Field label="CTA link (optional)">
            <input
              className={inputClass}
              value={str(d.ctaHref)}
              onChange={(e) => patch({ ctaHref: e.target.value })}
              placeholder="products"
            />
          </Field>
        </>
      ) : null}
    </div>
  );
}

function ItemListHeader({
  label,
  count,
}: {
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <p className="text-[11px] font-medium text-[#86868b]">{label}</p>
      <span className="rounded-full bg-[#f5f5f7] px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[#86868b]">
        {count}
      </span>
    </div>
  );
}

export function PageIntroForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const { d, patch } = useDraft(value, onChange);
  return (
    <Shell footer="Typography intro for corporate pages — optional CTA link.">
      <IntroFields d={d} patch={patch} withCta />
    </Shell>
  );
}

export function PillarListForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const { d, patch } = useDraft(value, onChange);
  const items = asArray(d.items).map((s) => asRecord(s));

  function setItems(next: Record<string, unknown>[]) {
    patch({ items: next });
  }

  return (
    <Shell>
      <IntroFields d={d} patch={patch} />
      <div className="border-t border-[#e8e8ed]">
        <ItemListHeader label="Pillars" count={items.length} />
        <div className="flex flex-col gap-2 px-3 pb-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-[8px] border border-[#e8e8ed] bg-[#fafafa] p-2.5"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wide text-[#aeaeb2] uppercase">
                  Pillar {i + 1}
                </span>
                <button
                  type="button"
                  className="inline-flex size-6 items-center justify-center rounded text-[#ff3b30] hover:bg-[#ff3b30]/10"
                  aria-label="Remove pillar"
                  onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                >
                  <X className="size-3.5 stroke-[2.5]" />
                </button>
              </div>
              <div className="grid gap-2">
                <Field label="Title">
                  <input
                    className={inputClass}
                    value={str(item.title)}
                    onChange={(e) =>
                      setItems(
                        items.map((row, idx) =>
                          idx === i ? { ...row, title: e.target.value } : row,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Body">
                  <textarea
                    className={cn(inputClass, "h-auto min-h-[56px] resize-y py-2")}
                    value={str(item.body)}
                    onChange={(e) =>
                      setItems(
                        items.map((row, idx) =>
                          idx === i ? { ...row, body: e.target.value } : row,
                        ),
                      )
                    }
                    rows={2}
                  />
                </Field>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            className="h-8 justify-start px-2 text-[12px] font-medium text-[#0071e3] hover:bg-[#0071e3]/08 hover:text-[#0071e3]"
            onClick={() => setItems([...items, { title: "", body: "" }])}
          >
            <Plus className="size-3.5" />
            Add pillar
          </Button>
        </div>
      </div>
    </Shell>
  );
}

export function TimelineForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const { d, patch } = useDraft(value, onChange);
  const items = asArray(d.items).map((s) => asRecord(s));

  function setItems(next: Record<string, unknown>[]) {
    patch({ items: next });
  }

  return (
    <Shell>
      <IntroFields d={d} patch={patch} />
      <div className="border-t border-[#e8e8ed]">
        <ItemListHeader label="Milestones" count={items.length} />
        <div className="flex flex-col gap-2 px-3 pb-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-[8px] border border-[#e8e8ed] bg-[#fafafa] p-2.5"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wide text-[#aeaeb2] uppercase">
                  Milestone {i + 1}
                </span>
                <button
                  type="button"
                  className="inline-flex size-6 items-center justify-center rounded text-[#ff3b30] hover:bg-[#ff3b30]/10"
                  aria-label="Remove milestone"
                  onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                >
                  <X className="size-3.5 stroke-[2.5]" />
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-[6rem_1fr]">
                <Field label="Year / label">
                  <input
                    className={inputClass}
                    value={str(item.year)}
                    onChange={(e) =>
                      setItems(
                        items.map((row, idx) =>
                          idx === i ? { ...row, year: e.target.value } : row,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Title">
                  <input
                    className={inputClass}
                    value={str(item.title)}
                    onChange={(e) =>
                      setItems(
                        items.map((row, idx) =>
                          idx === i ? { ...row, title: e.target.value } : row,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Body" className="sm:col-span-2">
                  <textarea
                    className={cn(inputClass, "h-auto min-h-[56px] resize-y py-2")}
                    value={str(item.body)}
                    onChange={(e) =>
                      setItems(
                        items.map((row, idx) =>
                          idx === i ? { ...row, body: e.target.value } : row,
                        ),
                      )
                    }
                    rows={2}
                  />
                </Field>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            className="h-8 justify-start px-2 text-[12px] font-medium text-[#0071e3] hover:bg-[#0071e3]/08 hover:text-[#0071e3]"
            onClick={() =>
              setItems([...items, { year: "", title: "", body: "" }])
            }
          >
            <Plus className="size-3.5" />
            Add milestone
          </Button>
        </div>
      </div>
    </Shell>
  );
}

export function NumberedStepsForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const { d, patch } = useDraft(value, onChange);
  const items = asArray(d.items).map((s) => asRecord(s));

  function setItems(next: Record<string, unknown>[]) {
    patch({ items: next });
  }

  return (
    <Shell>
      <IntroFields d={d} patch={patch} />
      <div className="border-t border-[#e8e8ed]">
        <ItemListHeader label="Steps" count={items.length} />
        <div className="flex flex-col gap-2 px-3 pb-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-[8px] border border-[#e8e8ed] bg-[#fafafa] p-2.5"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wide text-[#aeaeb2] uppercase">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  className="inline-flex size-6 items-center justify-center rounded text-[#ff3b30] hover:bg-[#ff3b30]/10"
                  aria-label="Remove step"
                  onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                >
                  <X className="size-3.5 stroke-[2.5]" />
                </button>
              </div>
              <div className="grid gap-2">
                <Field label="Title">
                  <input
                    className={inputClass}
                    value={str(item.title)}
                    onChange={(e) =>
                      setItems(
                        items.map((row, idx) =>
                          idx === i ? { ...row, title: e.target.value } : row,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Body">
                  <textarea
                    className={cn(inputClass, "h-auto min-h-[56px] resize-y py-2")}
                    value={str(item.body)}
                    onChange={(e) =>
                      setItems(
                        items.map((row, idx) =>
                          idx === i ? { ...row, body: e.target.value } : row,
                        ),
                      )
                    }
                    rows={2}
                  />
                </Field>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            className="h-8 justify-start px-2 text-[12px] font-medium text-[#0071e3] hover:bg-[#0071e3]/08 hover:text-[#0071e3]"
            onClick={() => setItems([...items, { title: "", body: "" }])}
          >
            <Plus className="size-3.5" />
            Add step
          </Button>
        </div>
      </div>
    </Shell>
  );
}

export function ResourceListForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const { d, patch } = useDraft(value, onChange);
  const items = asArray(d.items).map((s) => asRecord(s));

  function setItems(next: Record<string, unknown>[]) {
    patch({ items: next });
  }

  return (
    <Shell>
      <IntroFields d={d} patch={patch} />
      <div className="border-t border-[#e8e8ed]">
        <ItemListHeader label="Packs" count={items.length} />
        <div className="flex flex-col gap-2 px-3 pb-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-[8px] border border-[#e8e8ed] bg-[#fafafa] p-2.5"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wide text-[#aeaeb2] uppercase">
                  Pack {i + 1}
                </span>
                <button
                  type="button"
                  className="inline-flex size-6 items-center justify-center rounded text-[#ff3b30] hover:bg-[#ff3b30]/10"
                  aria-label="Remove pack"
                  onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                >
                  <X className="size-3.5 stroke-[2.5]" />
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Tag">
                  <input
                    className={inputClass}
                    value={str(item.tag)}
                    onChange={(e) =>
                      setItems(
                        items.map((row, idx) =>
                          idx === i ? { ...row, tag: e.target.value } : row,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Request link">
                  <input
                    className={inputClass}
                    value={str(item.requestHref, "contact")}
                    onChange={(e) =>
                      setItems(
                        items.map((row, idx) =>
                          idx === i
                            ? { ...row, requestHref: e.target.value }
                            : row,
                        ),
                      )
                    }
                    placeholder="contact"
                  />
                </Field>
                <Field label="Title" className="sm:col-span-2">
                  <input
                    className={inputClass}
                    value={str(item.title)}
                    onChange={(e) =>
                      setItems(
                        items.map((row, idx) =>
                          idx === i ? { ...row, title: e.target.value } : row,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Body" className="sm:col-span-2">
                  <textarea
                    className={cn(inputClass, "h-auto min-h-[56px] resize-y py-2")}
                    value={str(item.body)}
                    onChange={(e) =>
                      setItems(
                        items.map((row, idx) =>
                          idx === i ? { ...row, body: e.target.value } : row,
                        ),
                      )
                    }
                    rows={2}
                  />
                </Field>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            className="h-8 justify-start px-2 text-[12px] font-medium text-[#0071e3] hover:bg-[#0071e3]/08 hover:text-[#0071e3]"
            onClick={() =>
              setItems([
                ...items,
                {
                  title: "",
                  body: "",
                  tag: "",
                  requestHref: "contact",
                },
              ])
            }
          >
            <Plus className="size-3.5" />
            Add pack
          </Button>
        </div>
      </div>
    </Shell>
  );
}

export function IndustryListForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const { d, patch } = useDraft(value, onChange);
  const items = asArray(d.items).map((s) => asRecord(s));

  function setItems(next: Record<string, unknown>[]) {
    patch({ items: next });
  }

  return (
    <Shell>
      <IntroFields d={d} patch={patch} />
      <div className="border-t border-[#e8e8ed]">
        <ItemListHeader label="Industries" count={items.length} />
        <div className="flex flex-col gap-2 px-3 pb-3">
          {items.map((item, i) => {
            const apps = asArray(item.applications)
              .map(String)
              .filter(Boolean)
              .join("\n");
            return (
              <div
                key={i}
                className="rounded-[8px] border border-[#e8e8ed] bg-[#fafafa] p-2.5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-wide text-[#aeaeb2] uppercase">
                    Industry {i + 1}
                  </span>
                  <button
                    type="button"
                    className="inline-flex size-6 items-center justify-center rounded text-[#ff3b30] hover:bg-[#ff3b30]/10"
                    aria-label="Remove industry"
                    onClick={() =>
                      setItems(items.filter((_, idx) => idx !== i))
                    }
                  >
                    <X className="size-3.5 stroke-[2.5]" />
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="Label">
                    <input
                      className={inputClass}
                      value={str(item.label)}
                      onChange={(e) =>
                        setItems(
                          items.map((row, idx) =>
                            idx === i
                              ? { ...row, label: e.target.value }
                              : row,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field label="Product link">
                    <input
                      className={inputClass}
                      value={str(item.productHref, "products")}
                      onChange={(e) =>
                        setItems(
                          items.map((row, idx) =>
                            idx === i
                              ? { ...row, productHref: e.target.value }
                              : row,
                          ),
                        )
                      }
                      placeholder="products/category/…"
                    />
                  </Field>
                  <Field label="Description" className="sm:col-span-2">
                    <textarea
                      className={cn(
                        inputClass,
                        "h-auto min-h-[56px] resize-y py-2",
                      )}
                      value={str(item.description)}
                      onChange={(e) =>
                        setItems(
                          items.map((row, idx) =>
                            idx === i
                              ? { ...row, description: e.target.value }
                              : row,
                          ),
                        )
                      }
                      rows={2}
                    />
                  </Field>
                  <Field
                    label="Applications (one per line)"
                    className="sm:col-span-2"
                  >
                    <textarea
                      className={cn(
                        inputClass,
                        "h-auto min-h-[56px] resize-y py-2",
                      )}
                      value={apps}
                      onChange={(e) =>
                        setItems(
                          items.map((row, idx) =>
                            idx === i
                              ? {
                                  ...row,
                                  applications: e.target.value
                                    .split("\n")
                                    .map((a) => a.trim())
                                    .filter(Boolean),
                                }
                              : row,
                          ),
                        )
                      }
                      rows={3}
                    />
                  </Field>
                </div>
              </div>
            );
          })}
          <Button
            type="button"
            variant="ghost"
            className="h-8 justify-start px-2 text-[12px] font-medium text-[#0071e3] hover:bg-[#0071e3]/08 hover:text-[#0071e3]"
            onClick={() =>
              setItems([
                ...items,
                {
                  label: "",
                  description: "",
                  applications: [],
                  productHref: "products",
                },
              ])
            }
          >
            <Plus className="size-3.5" />
            Add industry
          </Button>
        </div>
      </div>
    </Shell>
  );
}
