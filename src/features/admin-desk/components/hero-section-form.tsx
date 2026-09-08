"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CloudinaryPicker } from "@/features/admin-desk/components/cloudinary-picker";
import {
  emptySlide,
  normalizeHeroBlock,
  type HeroSlideDraft,
} from "@/features/admin-desk/lib/hero-draft";
import { cn } from "@/lib/utils";

/** Dense Apple/Linear field chrome — soft radius, not pills */
const inputClass =
  "h-8 w-full rounded-[6px] border border-[#d2d2d7] bg-white px-2.5 text-[13px] text-[#1d1d1f] outline-none transition placeholder:text-[#86868b] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20";

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

function IconBtn({
  label,
  disabled,
  danger,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-[6px] transition disabled:opacity-30",
        danger
          ? "text-[#ff3b30] hover:bg-[#ff3b30]/10"
          : "text-[#1d1d1f]/70 hover:bg-black/[0.05]",
      )}
    >
      {children}
    </button>
  );
}

export function heroCanPublish(slides: HeroSlideDraft[]): boolean {
  return (
    slides.length > 0 &&
    slides.every((s) => s.imageSrc.trim() && s.title.trim())
  );
}

export function HeroSectionForm({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: { slides: HeroSlideDraft[] }) => void;
}) {
  const slides = normalizeHeroBlock(value).slides;
  const [openIndex, setOpenIndex] = useState(0);

  function setSlides(next: HeroSlideDraft[]) {
    onChange({ slides: next });
  }

  function updateSlide(i: number, slide: HeroSlideDraft) {
    setSlides(slides.map((s, idx) => (idx === i ? slide : s)));
  }

  function moveSlide(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    const copy = [...slides];
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
    setSlides(copy);
    setOpenIndex(j);
  }

  return (
    <div className="flex flex-col gap-2">
      {slides.length === 0 ? (
        <button
          type="button"
          onClick={() => {
            setSlides([emptySlide()]);
            setOpenIndex(0);
          }}
          className="flex flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-[#d2d2d7] bg-[#fafafa] px-4 py-10 text-center transition hover:border-[#86868b] hover:bg-[#f5f5f7]"
        >
          <Plus className="size-5 text-[#86868b]" />
          <span className="text-[13px] font-medium text-[#1d1d1f]">
            Add first slide
          </span>
          <span className="text-[11px] text-[#86868b]">
            Photo + headline required to publish
          </span>
        </button>
      ) : (
        <ul className="overflow-hidden rounded-[10px] border border-[#d2d2d7] bg-white">
          {slides.map((slide, i) => {
            const open = openIndex === i;
            return (
              <li
                key={i}
                className={cn(
                  i > 0 && "border-t border-[#e8e8ed]",
                  open && "bg-[#fbfbfd]",
                )}
              >
                {/* Row chrome — title + icon actions (Notion / Linear) */}
                <div className="flex items-center gap-1 pr-1.5">
                  <button
                    type="button"
                    className="flex min-h-10 min-w-0 flex-1 items-center gap-2.5 px-2.5 py-1.5 text-left"
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    aria-expanded={open}
                  >
                    <span className="relative size-8 shrink-0 overflow-hidden rounded-[6px] bg-[#f5f5f7]">
                      {slide.imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={slide.imageSrc}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center text-[10px] font-semibold text-[#86868b]">
                          {i + 1}
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-[#1d1d1f]">
                        {slide.title || `Slide ${i + 1}`}
                      </span>
                      <span className="block truncate text-[11px] text-[#86868b]">
                        {slide.eyebrow || "Untitled"}
                      </span>
                    </span>
                    {open ? (
                      <ChevronDown className="size-3.5 shrink-0 text-[#86868b]" />
                    ) : (
                      <ChevronRight className="size-3.5 shrink-0 text-[#86868b]" />
                    )}
                  </button>

                  <div
                    className="flex shrink-0 items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconBtn
                      label="Move up"
                      disabled={i === 0}
                      onClick={() => moveSlide(i, -1)}
                    >
                      <ArrowUp className="size-3.5" />
                    </IconBtn>
                    <IconBtn
                      label="Move down"
                      disabled={i === slides.length - 1}
                      onClick={() => moveSlide(i, 1)}
                    >
                      <ArrowDown className="size-3.5" />
                    </IconBtn>
                    <IconBtn
                      label="Delete slide"
                      danger
                      disabled={slides.length <= 1}
                      onClick={() => {
                        setSlides(slides.filter((_, idx) => idx !== i));
                        setOpenIndex(Math.max(0, i - 1));
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </IconBtn>
                  </div>
                </div>

                {open ? (
                  <div className="border-t border-[#e8e8ed] px-3 py-3">
                    {/* Media + core copy — single dense band */}
                    <div className="flex flex-col gap-3 min-[680px]:flex-row min-[680px]:gap-4">
                      <CloudinaryPicker
                        kind="image"
                        label="Photo"
                        help="Required"
                        size={64}
                        valueUrl={slide.imageSrc}
                        valuePublicId={slide.imagePublicId}
                        onChange={({ url, publicId }) =>
                          updateSlide(i, {
                            ...slide,
                            imageSrc: url,
                            imagePublicId: publicId || undefined,
                          })
                        }
                      />

                      <div className="grid min-w-0 flex-1 gap-2.5 sm:grid-cols-2">
                        <Field label="Headline" className="sm:col-span-2">
                          <input
                            className={inputClass}
                            value={slide.title}
                            onChange={(e) =>
                              updateSlide(i, {
                                ...slide,
                                title: e.target.value,
                              })
                            }
                          />
                        </Field>
                        <Field label="Eyebrow">
                          <input
                            className={inputClass}
                            value={slide.eyebrow}
                            onChange={(e) =>
                              updateSlide(i, {
                                ...slide,
                                eyebrow: e.target.value,
                              })
                            }
                          />
                        </Field>
                        <Field label="Alt text">
                          <input
                            className={inputClass}
                            value={slide.imageAlt}
                            onChange={(e) =>
                              updateSlide(i, {
                                ...slide,
                                imageAlt: e.target.value,
                              })
                            }
                          />
                        </Field>
                        <Field label="Supporting line" className="sm:col-span-2">
                          <textarea
                            className={cn(
                              inputClass,
                              "h-auto min-h-[52px] resize-y py-1.5 leading-snug",
                            )}
                            value={slide.subtitle}
                            onChange={(e) =>
                              updateSlide(i, {
                                ...slide,
                                subtitle: e.target.value,
                              })
                            }
                            rows={2}
                          />
                        </Field>
                        <Field label="Button label">
                          <input
                            className={inputClass}
                            value={slide.primaryCta.label}
                            onChange={(e) =>
                              updateSlide(i, {
                                ...slide,
                                primaryCta: {
                                  ...slide.primaryCta,
                                  label: e.target.value,
                                },
                              })
                            }
                          />
                        </Field>
                        <Field label="Button link">
                          <input
                            className={inputClass}
                            value={slide.primaryCta.href}
                            placeholder="contact"
                            onChange={(e) =>
                              updateSlide(i, {
                                ...slide,
                                primaryCta: {
                                  ...slide.primaryCta,
                                  href: e.target.value,
                                },
                              })
                            }
                          />
                        </Field>
                      </div>
                    </div>

                    {/* Optional video — compact strip */}
                    <div className="mt-3 flex flex-wrap items-end gap-3 border-t border-[#e8e8ed] pt-3">
                      <CloudinaryPicker
                        kind="video"
                        label="Video"
                        size={48}
                        valueUrl={slide.video?.src ?? ""}
                        valuePublicId={slide.video?.publicId}
                        onChange={({ url, publicId }) =>
                          updateSlide(i, {
                            ...slide,
                            video: url
                              ? {
                                  src: url,
                                  publicId: publicId || undefined,
                                  posterSrc: slide.video?.posterSrc,
                                  posterPublicId: slide.video?.posterPublicId,
                                  label: slide.video?.label ?? "Watch video",
                                }
                              : null,
                          })
                        }
                      />
                      {slide.video?.src ? (
                        <>
                          <CloudinaryPicker
                            kind="image"
                            label="Poster"
                            size={48}
                            valueUrl={slide.video.posterSrc ?? ""}
                            valuePublicId={slide.video.posterPublicId}
                            onChange={({ url, publicId }) =>
                              updateSlide(i, {
                                ...slide,
                                video: {
                                  ...slide.video!,
                                  posterSrc: url || undefined,
                                  posterPublicId: publicId || undefined,
                                },
                              })
                            }
                          />
                          <Field label="Play label" className="min-w-[10rem] flex-1">
                            <input
                              className={inputClass}
                              value={slide.video.label ?? "Watch video"}
                              onChange={(e) =>
                                updateSlide(i, {
                                  ...slide,
                                  video: {
                                    ...slide.video!,
                                    label: e.target.value,
                                  },
                                })
                              }
                            />
                          </Field>
                        </>
                      ) : (
                        <p className="pb-1 text-[11px] text-[#86868b]">
                          Optional — add a video for this slide
                        </p>
                      )}
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {slides.length > 0 ? (
        <Button
          type="button"
          variant="ghost"
          className="h-8 self-start px-2 text-[12px] font-medium text-[#0071e3] hover:bg-[#0071e3]/08 hover:text-[#0071e3]"
          onClick={() => {
            setSlides([...slides, emptySlide()]);
            setOpenIndex(slides.length);
          }}
        >
          <Plus className="size-3.5" />
          Add slide
        </Button>
      ) : null}
    </div>
  );
}
