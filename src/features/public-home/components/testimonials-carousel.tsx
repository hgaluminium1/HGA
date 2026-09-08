"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import type { HomeContent } from "@/features/public-home/content/home.en";
import { cn } from "@/lib/utils";

type TestimonialsCarouselProps = {
  content: HomeContent["testimonials"];
};

function perViewForWidth(width: number) {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

export function TestimonialsCarousel({ content }: TestimonialsCarouselProps) {
  const [perView, setPerView] = useState(1);
  const [index, setIndex] = useState(0);
  const total = content.items.length;

  useEffect(() => {
    const update = () => setPerView(perViewForWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, total - perView);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const pageCount = maxIndex + 1;
  const dots = useMemo(
    () => Array.from({ length: pageCount }, (_, i) => i),
    [pageCount],
  );

  const slideBasis = `${100 / perView}%`;

  return (
    <Section data-block="testimonials" id="testimonials">
      <Container>
        <Reveal>
          <SectionHeader
            center
            eyebrow={content.eyebrow}
            title={content.title}
          />
        </Reveal>

        <Reveal>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-[var(--ease)]"
                style={{
                  transform: `translateX(-${(100 / perView) * index}%)`,
                }}
              >
                {content.items.map((item) => (
                  <div
                    key={item.name}
                    className="shrink-0 px-2 py-1"
                    style={{ flexBasis: slideBasis, maxWidth: slideBasis }}
                  >
                    <article className="flex h-full flex-col border-t-2 border-brand-blue/80 pt-5">
                      <blockquote className="font-display flex-1 text-[clamp(1.05rem,0.95rem+0.45vw,1.25rem)] font-medium leading-snug text-ink text-balance">
                        “{item.quote}”
                      </blockquote>
                      <div className="mt-6 flex items-center gap-3">
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-blue-light text-[0.7rem] font-bold tracking-wide text-brand-blue"
                          aria-hidden
                        >
                          {item.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[0.875rem] font-semibold text-ink">
                            {item.name}
                          </p>
                          <p className="text-muted-foreground truncate text-[0.75rem]">
                            {item.role}
                          </p>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>

            {pageCount > 1 ? (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  disabled={index <= 0}
                  className="inline-flex size-10 items-center justify-center rounded-full text-ink transition hover:bg-black/[0.04] disabled:opacity-30"
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                >
                  <ArrowLeft className="size-4" />
                </button>
                <div className="flex gap-1.5">
                  {dots.map((dot) => (
                    <button
                      key={dot}
                      type="button"
                      aria-label={`Go to testimonials page ${dot + 1}`}
                      aria-current={dot === index}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        dot === index
                          ? "w-5 bg-brand-blue"
                          : "bg-line w-1.5",
                      )}
                      onClick={() => setIndex(dot)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Next testimonial"
                  disabled={index >= maxIndex}
                  className="inline-flex size-10 items-center justify-center rounded-full text-ink transition hover:bg-black/[0.04] disabled:opacity-30"
                  onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
