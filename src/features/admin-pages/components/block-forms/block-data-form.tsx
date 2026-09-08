"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CorporateHydratedNotice,
  Field,
  MediaUrlField,
  TextArea,
  TextInput,
} from "@/features/admin-pages/components/block-forms/fields";
import type { BlockType } from "@/modules/cms/browser";

type BlockFormProps = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" && !Array.isArray(data)
    ? (data as Record<string, unknown>)
    : {};
}

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function HeroForm({ data, onChange }: BlockFormProps) {
  const d = asRecord(data);
  const slides = asArray<{
    imageSrc: string;
    imageAlt: string;
    eyebrow: string;
    title: string;
    subtitle: string;
  }>(d.slides);
  const primary = asRecord(d.primaryCta);
  const secondary = asRecord(d.secondaryCta);

  return (
    <div className="mt-4 space-y-5">
      <div className="grid gap-3 min-[640px]:grid-cols-2">
        <Field label="Primary CTA label">
          <TextInput
            value={String(primary.label ?? "")}
            onChange={(e) =>
              onChange({
                ...d,
                primaryCta: { ...primary, label: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Primary CTA link" hint="Locale-relative, e.g. contact">
          <TextInput
            value={String(primary.href ?? "")}
            onChange={(e) =>
              onChange({
                ...d,
                primaryCta: { ...primary, href: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Secondary CTA label">
          <TextInput
            value={String(secondary.label ?? "")}
            onChange={(e) =>
              onChange({
                ...d,
                secondaryCta: { ...secondary, label: e.target.value },
              })
            }
          />
        </Field>
        <MediaUrlField
          label="Video poster"
          value={String(d.videoPoster ?? "")}
          onChange={(url) => onChange({ ...d, videoPoster: url })}
        />
        <Field label="Video URL" className="min-[640px]:col-span-2">
          <TextInput
            value={String(d.videoSrc ?? "")}
            onChange={(e) => onChange({ ...d, videoSrc: e.target.value })}
          />
        </Field>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">Slides</p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              onChange({
                ...d,
                slides: [
                  ...slides,
                  {
                    imageSrc: "",
                    imageAlt: "",
                    eyebrow: "",
                    title: "New slide",
                    subtitle: "",
                  },
                ],
              })
            }
          >
            <Plus className="size-4" /> Add slide
          </Button>
        </div>
        {slides.map((slide, i) => (
          <div
            key={i}
            className="border-line space-y-3 rounded-[var(--radius-md)] border p-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-wide text-text-faint uppercase">
                Slide {i + 1}
              </p>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={slides.length <= 1}
                onClick={() =>
                  onChange({
                    ...d,
                    slides: slides.filter((_, j) => j !== i),
                  })
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <MediaUrlField
              label="Image"
              value={slide.imageSrc}
              onChange={(url) => {
                const next = [...slides];
                next[i] = { ...slide, imageSrc: url };
                onChange({ ...d, slides: next });
              }}
            />
            <div className="grid gap-3 min-[640px]:grid-cols-2">
              <Field label="Image alt">
                <TextInput
                  value={slide.imageAlt}
                  onChange={(e) => {
                    const next = [...slides];
                    next[i] = { ...slide, imageAlt: e.target.value };
                    onChange({ ...d, slides: next });
                  }}
                />
              </Field>
              <Field label="Eyebrow">
                <TextInput
                  value={slide.eyebrow}
                  onChange={(e) => {
                    const next = [...slides];
                    next[i] = { ...slide, eyebrow: e.target.value };
                    onChange({ ...d, slides: next });
                  }}
                />
              </Field>
              <Field label="Title" className="min-[640px]:col-span-2">
                <TextInput
                  value={slide.title}
                  onChange={(e) => {
                    const next = [...slides];
                    next[i] = { ...slide, title: e.target.value };
                    onChange({ ...d, slides: next });
                  }}
                />
              </Field>
              <Field label="Subtitle" className="min-[640px]:col-span-2">
                <TextArea
                  value={slide.subtitle}
                  onChange={(e) => {
                    const next = [...slides];
                    next[i] = { ...slide, subtitle: e.target.value };
                    onChange({ ...d, slides: next });
                  }}
                />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CapabilityForm({ data, onChange }: BlockFormProps) {
  const d = asRecord(data);
  const stats = asArray<{ target: number; suffix: string; label: string }>(
    d.stats,
  );
  const words = asArray<string>(d.highlightWords);

  return (
    <div className="mt-4 space-y-4">
      <Field label="Eyebrow">
        <TextInput
          value={String(d.eyebrow ?? "")}
          onChange={(e) => onChange({ ...d, eyebrow: e.target.value })}
        />
      </Field>
      <Field label="Title">
        <TextInput
          value={String(d.title ?? "")}
          onChange={(e) => onChange({ ...d, title: e.target.value })}
        />
      </Field>
      <Field label="Body">
        <TextArea
          value={String(d.body ?? "")}
          onChange={(e) => onChange({ ...d, body: e.target.value })}
        />
      </Field>
      <Field
        label="Highlight words"
        hint="Comma-separated words underlined in the body"
      >
        <TextInput
          value={words.join(", ")}
          onChange={(e) =>
            onChange({
              ...d,
              highlightWords: e.target.value
                .split(",")
                .map((w) => w.trim())
                .filter(Boolean),
            })
          }
        />
      </Field>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Stats</p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              onChange({
                ...d,
                stats: [...stats, { target: 0, suffix: "", label: "New stat" }],
              })
            }
          >
            <Plus className="size-4" /> Add
          </Button>
        </div>
        {stats.map((stat, i) => (
          <div
            key={i}
            className="border-line grid gap-2 rounded-[var(--radius-md)] border p-3 min-[640px]:grid-cols-[1fr_6rem_1fr_auto]"
          >
            <Field label="Label">
              <TextInput
                value={stat.label}
                onChange={(e) => {
                  const next = [...stats];
                  next[i] = { ...stat, label: e.target.value };
                  onChange({ ...d, stats: next });
                }}
              />
            </Field>
            <Field label="Number">
              <TextInput
                type="number"
                value={stat.target}
                onChange={(e) => {
                  const next = [...stats];
                  next[i] = { ...stat, target: Number(e.target.value) || 0 };
                  onChange({ ...d, stats: next });
                }}
              />
            </Field>
            <Field label="Suffix">
              <TextInput
                value={stat.suffix}
                onChange={(e) => {
                  const next = [...stats];
                  next[i] = { ...stat, suffix: e.target.value };
                  onChange({ ...d, stats: next });
                }}
              />
            </Field>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="mt-6"
              onClick={() =>
                onChange({ ...d, stats: stats.filter((_, j) => j !== i) })
              }
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsForm({ data, onChange }: BlockFormProps) {
  const d = asRecord(data);
  return (
    <div className="mt-4 space-y-4">
      <p className="text-muted-foreground text-sm">
        Product cards hydrate automatically from published catalogue products.
        Set section headings here only.
      </p>
      <Field label="Eyebrow">
        <TextInput
          value={String(d.eyebrow ?? "")}
          onChange={(e) => onChange({ ...d, eyebrow: e.target.value })}
        />
      </Field>
      <Field label="Title">
        <TextInput
          value={String(d.title ?? "")}
          onChange={(e) => onChange({ ...d, title: e.target.value })}
        />
      </Field>
      <Field label="Description">
        <TextArea
          value={String(d.description ?? "")}
          onChange={(e) => onChange({ ...d, description: e.target.value })}
        />
      </Field>
    </div>
  );
}

function MissionForm({ data, onChange }: BlockFormProps) {
  const d = asRecord(data);
  return (
    <div className="mt-4 space-y-4">
      <MediaUrlField
        label="Background image"
        value={String(d.imageSrc ?? "")}
        onChange={(url) => onChange({ ...d, imageSrc: url })}
      />
      <Field label="Image alt">
        <TextInput
          value={String(d.imageAlt ?? "")}
          onChange={(e) => onChange({ ...d, imageAlt: e.target.value })}
        />
      </Field>
      <Field label="Statement">
        <TextArea
          value={String(d.statement ?? "")}
          onChange={(e) => onChange({ ...d, statement: e.target.value })}
        />
      </Field>
      <Field label="Video URL (optional)">
        <TextInput
          value={String(d.videoSrc ?? "")}
          onChange={(e) => onChange({ ...d, videoSrc: e.target.value })}
        />
      </Field>
      <MediaUrlField
        label="Video poster (optional)"
        value={String(d.videoPoster ?? "")}
        onChange={(url) => onChange({ ...d, videoPoster: url })}
      />
    </div>
  );
}

function CtaForm({ data, onChange }: BlockFormProps) {
  const d = asRecord(data);
  return (
    <div className="mt-4 grid gap-4 min-[640px]:grid-cols-2">
      <Field label="Title" className="min-[640px]:col-span-2">
        <TextInput
          value={String(d.title ?? "")}
          onChange={(e) => onChange({ ...d, title: e.target.value })}
        />
      </Field>
      <Field label="Button label">
        <TextInput
          value={String(d.ctaLabel ?? "")}
          onChange={(e) => onChange({ ...d, ctaLabel: e.target.value })}
        />
      </Field>
      <Field label="Button link">
        <TextInput
          value={String(d.ctaHref ?? "")}
          onChange={(e) => onChange({ ...d, ctaHref: e.target.value })}
        />
      </Field>
    </div>
  );
}

function CustomersForm({ data, onChange }: BlockFormProps) {
  const d = asRecord(data);
  const logos = asArray<string>(d.logos);
  return (
    <div className="mt-4 space-y-4">
      <p className="text-muted-foreground text-sm">
        When Customer logos are published in Corporate admin, they replace the
        fallback name list below.
      </p>
      <Field label="Eyebrow">
        <TextInput
          value={String(d.eyebrow ?? "")}
          onChange={(e) => onChange({ ...d, eyebrow: e.target.value })}
        />
      </Field>
      <Field label="Title">
        <TextInput
          value={String(d.title ?? "")}
          onChange={(e) => onChange({ ...d, title: e.target.value })}
        />
      </Field>
      <Field label="Description">
        <TextArea
          value={String(d.description ?? "")}
          onChange={(e) => onChange({ ...d, description: e.target.value })}
        />
      </Field>
      <Field label="Fallback name tiles" hint="One company name per line">
        <TextArea
          value={logos.join("\n")}
          onChange={(e) =>
            onChange({
              ...d,
              logos: e.target.value
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean),
            })
          }
        />
      </Field>
    </div>
  );
}

function FaqForm({ data, onChange }: BlockFormProps) {
  const d = asRecord(data);
  const items = asArray<{ question: string; answer: string }>(d.items);
  return (
    <div className="mt-4 space-y-4">
      <Field label="Eyebrow">
        <TextInput
          value={String(d.eyebrow ?? "")}
          onChange={(e) => onChange({ ...d, eyebrow: e.target.value })}
        />
      </Field>
      <Field label="Title">
        <TextInput
          value={String(d.title ?? "")}
          onChange={(e) => onChange({ ...d, title: e.target.value })}
        />
      </Field>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Questions</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            onChange({
              ...d,
              items: [...items, { question: "", answer: "" }],
            })
          }
        >
          <Plus className="size-4" /> Add
        </Button>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="border-line space-y-2 rounded-[var(--radius-md)] border p-3"
        >
          <div className="flex justify-end">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() =>
                onChange({ ...d, items: items.filter((_, j) => j !== i) })
              }
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <Field label="Question">
            <TextInput
              value={item.question}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, question: e.target.value };
                onChange({ ...d, items: next });
              }}
            />
          </Field>
          <Field label="Answer">
            <TextArea
              value={item.answer}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, answer: e.target.value };
                onChange({ ...d, items: next });
              }}
            />
          </Field>
        </div>
      ))}
    </div>
  );
}

function TestimonialsForm({ data, onChange }: BlockFormProps) {
  const d = asRecord(data);
  const items = asArray<{
    initials: string;
    name: string;
    role: string;
    quote: string;
  }>(d.items);
  return (
    <div className="mt-4 space-y-4">
      <Field label="Eyebrow">
        <TextInput
          value={String(d.eyebrow ?? "")}
          onChange={(e) => onChange({ ...d, eyebrow: e.target.value })}
        />
      </Field>
      <Field label="Title">
        <TextInput
          value={String(d.title ?? "")}
          onChange={(e) => onChange({ ...d, title: e.target.value })}
        />
      </Field>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Quotes</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            onChange({
              ...d,
              items: [
                ...items,
                { initials: "", name: "", role: "", quote: "" },
              ],
            })
          }
        >
          <Plus className="size-4" /> Add
        </Button>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="border-line grid gap-2 rounded-[var(--radius-md)] border p-3 min-[640px]:grid-cols-2"
        >
          <Field label="Initials">
            <TextInput
              value={item.initials}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, initials: e.target.value };
                onChange({ ...d, items: next });
              }}
            />
          </Field>
          <Field label="Name">
            <TextInput
              value={item.name}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, name: e.target.value };
                onChange({ ...d, items: next });
              }}
            />
          </Field>
          <Field label="Role" className="min-[640px]:col-span-2">
            <TextInput
              value={item.role}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, role: e.target.value };
                onChange({ ...d, items: next });
              }}
            />
          </Field>
          <Field label="Quote" className="min-[640px]:col-span-2">
            <TextArea
              value={item.quote}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, quote: e.target.value };
                onChange({ ...d, items: next });
              }}
            />
          </Field>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="justify-self-start"
            onClick={() =>
              onChange({ ...d, items: items.filter((_, j) => j !== i) })
            }
          >
            <Trash2 className="size-4" /> Remove
          </Button>
        </div>
      ))}
    </div>
  );
}

function JointVenturesForm({ data, onChange }: BlockFormProps) {
  const d = asRecord(data);
  const items = asArray<{
    title: string;
    subtitle: string;
    icon: "handshake" | "factory" | "leaf";
  }>(d.items);
  return (
    <div className="mt-4 space-y-4">
      <Field label="Eyebrow">
        <TextInput
          value={String(d.eyebrow ?? "")}
          onChange={(e) => onChange({ ...d, eyebrow: e.target.value })}
        />
      </Field>
      <Field label="Title">
        <TextInput
          value={String(d.title ?? "")}
          onChange={(e) => onChange({ ...d, title: e.target.value })}
        />
      </Field>
      <MediaUrlField
        label="Background image"
        value={String(d.imageSrc ?? "")}
        onChange={(url) => onChange({ ...d, imageSrc: url })}
      />
      <Field label="Image alt">
        <TextInput
          value={String(d.imageAlt ?? "")}
          onChange={(e) => onChange({ ...d, imageAlt: e.target.value })}
        />
      </Field>
      {items.map((item, i) => (
        <div
          key={i}
          className="border-line grid gap-2 rounded-[var(--radius-md)] border p-3 min-[640px]:grid-cols-3"
        >
          <Field label="Title">
            <TextInput
              value={item.title}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, title: e.target.value };
                onChange({ ...d, items: next });
              }}
            />
          </Field>
          <Field label="Subtitle">
            <TextInput
              value={item.subtitle}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, subtitle: e.target.value };
                onChange({ ...d, items: next });
              }}
            />
          </Field>
          <Field label="Icon">
            <select
              className={inputClassFromFields()}
              value={item.icon}
              onChange={(e) => {
                const next = [...items];
                next[i] = {
                  ...item,
                  icon: e.target.value as "handshake" | "factory" | "leaf",
                };
                onChange({ ...d, items: next });
              }}
            >
              <option value="handshake">Handshake</option>
              <option value="factory">Factory</option>
              <option value="leaf">Leaf</option>
            </select>
          </Field>
        </div>
      ))}
    </div>
  );
}

function inputClassFromFields() {
  return "border-line min-h-11 w-full rounded-[var(--radius-md)] border bg-surface px-3 text-sm";
}

function CareersForm({ data, onChange }: BlockFormProps) {
  const d = asRecord(data);
  const images = asArray<{ src: string; alt: string }>(d.images);
  return (
    <div className="mt-4 space-y-4">
      <Field label="Eyebrow">
        <TextInput
          value={String(d.eyebrow ?? "")}
          onChange={(e) => onChange({ ...d, eyebrow: e.target.value })}
        />
      </Field>
      <Field label="Title">
        <TextInput
          value={String(d.title ?? "")}
          onChange={(e) => onChange({ ...d, title: e.target.value })}
        />
      </Field>
      <Field label="Body">
        <TextArea
          value={String(d.body ?? "")}
          onChange={(e) => onChange({ ...d, body: e.target.value })}
        />
      </Field>
      <div className="grid gap-3 min-[640px]:grid-cols-2">
        <Field label="CTA label">
          <TextInput
            value={String(d.ctaLabel ?? "")}
            onChange={(e) => onChange({ ...d, ctaLabel: e.target.value })}
          />
        </Field>
        <Field label="CTA link">
          <TextInput
            value={String(d.ctaHref ?? "")}
            onChange={(e) => onChange({ ...d, ctaHref: e.target.value })}
          />
        </Field>
      </div>
      {images.map((img, i) => (
        <div key={i} className="border-line space-y-2 rounded-[var(--radius-md)] border p-3">
          <MediaUrlField
            label={`Image ${i + 1}`}
            value={img.src}
            onChange={(url) => {
              const next = [...images];
              next[i] = { ...img, src: url };
              onChange({ ...d, images: next });
            }}
          />
          <Field label="Alt">
            <TextInput
              value={img.alt}
              onChange={(e) => {
                const next = [...images];
                next[i] = { ...img, alt: e.target.value };
                onChange({ ...d, images: next });
              }}
            />
          </Field>
        </div>
      ))}
    </div>
  );
}

const CORPORATE_TYPES = new Set([
  "stats",
  "leadership-grid",
  "company-facts",
  "cert-grid",
  "sustainability-metrics",
  "logo-strip",
  "gallery",
  "expansion-roadmap",
  "upcoming-products",
  "markets",
]);

export function BlockDataForm({
  type,
  data,
  onChange,
}: {
  type: string;
  data: unknown;
  onChange: (data: unknown) => void;
}) {
  const record = asRecord(data);
  const set = (next: Record<string, unknown>) => onChange(next);

  if (CORPORATE_TYPES.has(type)) {
    return (
      <div className="mt-4">
        <CorporateHydratedNotice label={type} />
      </div>
    );
  }

  switch (type as BlockType) {
    case "hero":
      return <HeroForm data={record} onChange={set} />;
    case "capability":
      return <CapabilityForm data={record} onChange={set} />;
    case "products":
      return <ProductsForm data={record} onChange={set} />;
    case "mission":
      return <MissionForm data={record} onChange={set} />;
    case "cta-banner":
      return <CtaForm data={record} onChange={set} />;
    case "customers":
      return <CustomersForm data={record} onChange={set} />;
    case "faq":
      return <FaqForm data={record} onChange={set} />;
    case "testimonials":
      return <TestimonialsForm data={record} onChange={set} />;
    case "joint-ventures":
      return <JointVenturesForm data={record} onChange={set} />;
    case "careers-teaser":
      return <CareersForm data={record} onChange={set} />;
    default:
      return (
        <div className="mt-4">
          <CorporateHydratedNotice label={type} />
        </div>
      );
  }
}
