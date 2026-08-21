"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import { Button } from "@/components/ui/button";
import type { HomeContent } from "@/features/public-home/content/home.en";
import { cn } from "@/lib/utils";

type TestimonialsCarouselProps = {
  content: HomeContent["testimonials"];
};

function perViewForWidth(width: number) {
  if (width >= 1000) return 3;
  if (width >= 720) return 2;
  return 1;
}

export function TestimonialsCarousel({ content }: TestimonialsCarouselProps) {
  const [perView, setPerView] = useState(1);
  const [index, setIndex] = useState(0);
  const total = content.items.length;

  useEffect(() => {
    const update = () => setPerView(perViewForWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update);
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
                    className="shrink-0 p-1.5"
                    style={{ flexBasis: slideBasis, maxWidth: slideBasis }}
                  >
                    <article className="shadow-brand-sm border-line bg-surface flex h-full flex-col items-center rounded-[var(--radius-lg)] border px-7 py-8 text-center">
                      <div className="mx-auto size-[68px] rounded-full bg-[linear-gradient(135deg,var(--brand-accent),var(--gold))] p-[3px]">
                        <div className="font-display bg-violet-700 flex size-full items-center justify-center rounded-full text-[1.1rem] font-bold text-white">
                          {item.initials}
                        </div>
                      </div>
                      <h4 className="mt-4 text-base font-semibold">
                        {item.name}
                      </h4>
                      <p className="text-muted-foreground mt-0.5 text-[0.8rem]">
                        {item.role}
                      </p>
                      <div
                        className="mt-3 flex justify-center gap-0.5 text-gold"
                        aria-label="5 out of 5 stars"
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="size-[15px] fill-current"
                          />
                        ))}
                      </div>
                      <blockquote className="text-muted-foreground mt-3.5 text-[0.94rem]">
                        {item.quote}
                      </blockquote>
                    </article>
                  </div>
                ))}
              </div>
            </div>

            {pageCount > 1 ? (
              <div className="mt-8 flex items-center justify-center gap-5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Previous testimonial"
                  disabled={index <= 0}
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <div className="flex gap-2">
                  {dots.map((dot) => (
                    <button
                      key={dot}
                      type="button"
                      aria-label={`Go to testimonials page ${dot + 1}`}
                      aria-current={dot === index}
                      className={cn(
                        "h-2 rounded-full bg-line transition-all duration-300 ease-[var(--ease)]",
                        dot === index
                          ? "w-[22px] rounded-[5px] bg-brand-accent"
                          : "w-2",
                      )}
                      onClick={() => setIndex(dot)}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Next testimonial"
                  disabled={index >= maxIndex}
                  onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
                >
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
