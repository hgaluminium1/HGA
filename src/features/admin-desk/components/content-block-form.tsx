"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CloudinaryPicker } from "@/features/admin-desk/components/cloudinary-picker";
import type { BlockType } from "@/modules/cms/browser";
import { cn } from "@/lib/utils";

const inputClass =
  "border-line bg-surface h-9 w-full rounded-md border px-2.5 text-[0.8125rem]";

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.75rem] font-semibold">{label}</span>
      {help ? (
        <span className="text-muted-foreground text-[0.6875rem]">{help}</span>
      ) : null}
      {children}
    </label>
  );
}

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

function num(v: unknown, fallback = 0) {
  return typeof v === "number" && !Number.isNaN(v) ? v : fallback;
}

type Props = {
  type: BlockType;
  value: unknown;
  onChange: (next: unknown) => void;
};

export function ContentBlockForm({ type, value, onChange }: Props) {
  const d = asRecord(value);

  function patch(partial: Record<string, unknown>) {
    onChange({ ...d, ...partial });
  }

  if (type === "capability") {
    // Dedicated FAANG editor — see CapabilitySectionForm
    return null;
  }

  if (type === "products") {
    // Dedicated editor — see ProductsSectionForm
    return null;
  }

  if (type === "mission") {
    return (
      <div className="flex flex-col gap-4">
        <CloudinaryPicker
          kind="image"
          label="Background photo"
          valueUrl={str(d.imageSrc)}
          onChange={({ url }) => patch({ imageSrc: url })}
        />
        <Field label="Photo description">
          <input
            className={inputClass}
            value={str(d.imageAlt)}
            onChange={(e) => patch({ imageAlt: e.target.value })}
          />
        </Field>
        <Field label="Mission statement">
          <textarea
            className={cn(inputClass, "min-h-28 py-3")}
            value={str(d.statement)}
            onChange={(e) => patch({ statement: e.target.value })}
            rows={4}
          />
        </Field>
        <CloudinaryPicker
          kind="video"
          label="Optional video"
          valueUrl={str(d.videoSrc)}
          onChange={({ url }) => patch({ videoSrc: url })}
        />
        <CloudinaryPicker
          kind="image"
          label="Video poster"
          valueUrl={str(d.videoPoster)}
          onChange={({ url }) => patch({ videoPoster: url })}
        />
      </div>
    );
  }

  if (type === "cta-banner") {
    return (
      <div className="flex flex-col gap-4">
        <Field label="Banner title">
          <input
            className={inputClass}
            value={str(d.title)}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 min-[640px]:grid-cols-2">
          <Field label="Button label">
            <input
              className={inputClass}
              value={str(d.ctaLabel)}
              onChange={(e) => patch({ ctaLabel: e.target.value })}
            />
          </Field>
          <Field label="Button link">
            <input
              className={inputClass}
              value={str(d.ctaHref)}
              onChange={(e) => patch({ ctaHref: e.target.value })}
            />
          </Field>
        </div>
      </div>
    );
  }

  if (type === "testimonials") {
    const items = asArray(d.items).map((s) => asRecord(s));
    return (
      <div className="flex flex-col gap-4">
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
        <ArrayEditor
          label="Quotes"
          items={items}
          onChange={(next) => patch({ items: next })}
          emptyItem={() => ({
            initials: "",
            name: "",
            role: "",
            quote: "",
          })}
          renderItem={(item, i, update) => (
            <div className="flex flex-col gap-3">
              <div className="grid gap-3 min-[640px]:grid-cols-3">
                <Field label="Initials">
                  <input
                    className={inputClass}
                    value={str(item.initials)}
                    onChange={(e) =>
                      update(i, { ...item, initials: e.target.value })
                    }
                  />
                </Field>
                <Field label="Name">
                  <input
                    className={inputClass}
                    value={str(item.name)}
                    onChange={(e) =>
                      update(i, { ...item, name: e.target.value })
                    }
                  />
                </Field>
                <Field label="Role">
                  <input
                    className={inputClass}
                    value={str(item.role)}
                    onChange={(e) =>
                      update(i, { ...item, role: e.target.value })
                    }
                  />
                </Field>
              </div>
              <Field label="Quote">
                <textarea
                  className={cn(inputClass, "min-h-24 py-3")}
                  value={str(item.quote)}
                  onChange={(e) =>
                    update(i, { ...item, quote: e.target.value })
                  }
                  rows={3}
                />
              </Field>
            </div>
          )}
        />
      </div>
    );
  }

  if (type === "customers") {
    const logos = asArray(d.logos).map(String);
    return (
      <div className="flex flex-col gap-4">
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
        <Field label="Description">
          <textarea
            className={cn(inputClass, "min-h-24 py-3")}
            value={str(d.description)}
            onChange={(e) => patch({ description: e.target.value })}
            rows={3}
          />
        </Field>
        <ArrayEditor
          label="Fallback logo names"
          help="Used when published logo assets are empty"
          items={logos.map((name) => ({ name }))}
          onChange={(next) =>
            patch({ logos: next.map((n) => str(n.name)) })
          }
          emptyItem={() => ({ name: "" })}
          renderItem={(item, i, update) => (
            <Field label="Name">
              <input
                className={inputClass}
                value={str(item.name)}
                onChange={(e) => update(i, { name: e.target.value })}
              />
            </Field>
          )}
        />
      </div>
    );
  }

  if (type === "joint-ventures") {
    const items = asArray(d.items).map((s) => asRecord(s));
    return (
      <div className="flex flex-col gap-4">
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
        <CloudinaryPicker
          kind="image"
          label="Side photo"
          valueUrl={str(d.imageSrc)}
          onChange={({ url }) => patch({ imageSrc: url })}
        />
        <Field label="Photo description">
          <input
            className={inputClass}
            value={str(d.imageAlt)}
            onChange={(e) => patch({ imageAlt: e.target.value })}
          />
        </Field>
        <ArrayEditor
          label="Highlights"
          items={items}
          onChange={(next) => patch({ items: next })}
          emptyItem={() => ({
            title: "",
            subtitle: "",
            icon: "handshake",
          })}
          renderItem={(item, i, update) => (
            <div className="grid gap-3 min-[640px]:grid-cols-3">
              <Field label="Title">
                <input
                  className={inputClass}
                  value={str(item.title)}
                  onChange={(e) =>
                    update(i, { ...item, title: e.target.value })
                  }
                />
              </Field>
              <Field label="Subtitle">
                <input
                  className={inputClass}
                  value={str(item.subtitle)}
                  onChange={(e) =>
                    update(i, { ...item, subtitle: e.target.value })
                  }
                />
              </Field>
              <Field label="Icon">
                <select
                  className={inputClass}
                  value={str(item.icon, "handshake")}
                  onChange={(e) =>
                    update(i, { ...item, icon: e.target.value })
                  }
                >
                  <option value="handshake">Handshake</option>
                  <option value="factory">Factory</option>
                  <option value="leaf">Leaf</option>
                </select>
              </Field>
            </div>
          )}
        />
      </div>
    );
  }

  if (type === "careers-teaser") {
    const images = asArray(d.images).map((s) => asRecord(s));
    return (
      <div className="flex flex-col gap-4">
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
        <Field label="Body">
          <textarea
            className={cn(inputClass, "min-h-28 py-3")}
            value={str(d.body)}
            onChange={(e) => patch({ body: e.target.value })}
            rows={4}
          />
        </Field>
        <div className="grid gap-4 min-[640px]:grid-cols-2">
          <Field label="Button label">
            <input
              className={inputClass}
              value={str(d.ctaLabel)}
              onChange={(e) => patch({ ctaLabel: e.target.value })}
            />
          </Field>
          <Field label="Button link">
            <input
              className={inputClass}
              value={str(d.ctaHref)}
              onChange={(e) => patch({ ctaHref: e.target.value })}
            />
          </Field>
        </div>
        <ArrayEditor
          label="Photos"
          items={images}
          onChange={(next) => patch({ images: next })}
          emptyItem={() => ({ src: "", alt: "" })}
          renderItem={(item, i, update) => (
            <div className="flex flex-col gap-3">
              <CloudinaryPicker
                kind="image"
                label="Photo"
                valueUrl={str(item.src)}
                onChange={({ url }) => update(i, { ...item, src: url })}
              />
              <Field label="Description">
                <input
                  className={inputClass}
                  value={str(item.alt)}
                  onChange={(e) =>
                    update(i, { ...item, alt: e.target.value })
                  }
                />
              </Field>
            </div>
          )}
        />
      </div>
    );
  }

  if (type === "faq") {
    const items = asArray(d.items).map((s) => asRecord(s));
    return (
      <div className="flex flex-col gap-4">
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
        <ArrayEditor
          label="Questions"
          items={items}
          onChange={(next) => patch({ items: next })}
          emptyItem={() => ({ question: "", answer: "" })}
          renderItem={(item, i, update) => (
            <div className="flex flex-col gap-3">
              <Field label="Question">
                <input
                  className={inputClass}
                  value={str(item.question)}
                  onChange={(e) =>
                    update(i, { ...item, question: e.target.value })
                  }
                />
              </Field>
              <Field label="Answer">
                <textarea
                  className={cn(inputClass, "min-h-24 py-3")}
                  value={str(item.answer)}
                  onChange={(e) =>
                    update(i, { ...item, answer: e.target.value })
                  }
                  rows={3}
                />
              </Field>
            </div>
          )}
        />
      </div>
    );
  }

  return (
    <p className="text-muted-foreground text-sm">
      No visual editor for this section type yet.
    </p>
  );
}

function ArrayEditor<T extends Record<string, unknown>>({
  label,
  help,
  items,
  onChange,
  emptyItem,
  renderItem,
}: {
  label: string;
  help?: string;
  items: T[];
  onChange: (next: T[]) => void;
  emptyItem: () => T;
  renderItem: (
    item: T,
    index: number,
    update: (index: number, next: T) => void,
  ) => React.ReactNode;
}) {
  function update(index: number, next: T) {
    onChange(items.map((item, i) => (i === index ? next : item)));
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[0.75rem] font-semibold">{label}</p>
        {help ? (
          <p className="text-muted-foreground text-[0.6875rem]">{help}</p>
        ) : null}
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="border-line rounded-md border p-3"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[0.625rem] font-semibold tracking-wide uppercase opacity-60">
              Item {i + 1}
            </p>
            <Button
              type="button"
              variant="ghost"
              className="h-8 text-[0.75rem] text-destructive"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="size-3.5" />
              Remove
            </Button>
          </div>
          {renderItem(item, i, update)}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="h-9 self-start text-[0.8125rem]"
        onClick={() => onChange([...items, emptyItem()])}
      >
        <Plus className="size-3.5" />
        Add item
      </Button>
    </div>
  );
}
