"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { localePath } from "@/config/nav.config";
import type { HomeContent } from "@/features/public-home/content/home.en";
import { cn } from "@/lib/utils";

type HeroCarouselProps = {
  locale: string;
  content: HomeContent["hero"];
};

const AUTOPLAY_MS = 6000;

export function HeroCarousel({ locale, content }: HeroCarouselProps) {
  const { slides, primaryCta, secondaryCta, videoSrc, videoPoster } = content;
  const [index, setIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const reduceMotion = useRef(false);

  const count = slides.length;
  const active = slides[index] ?? slides[0];

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    if (count < 2 || videoOpen) return;
    if (reduceMotion.current) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [count, videoOpen, index]);

  if (!active) return null;

  return (
    <section
      data-block="hero"
      className="bg-ink relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        const end = e.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (start == null || end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 48) return;
        go(index + (delta < 0 ? 1 : -1));
      }}
    >
      <div
        className="relative min-h-[26.25rem]"
        style={{ height: "var(--hero-height)" }}
      >
        {slides.map((slide, i) => (
          <div
            key={`${slide.imageSrc}-${i}`}
            className={cn(
              "absolute inset-0 transition-[opacity,visibility] duration-1000 ease-[var(--ease)]",
              i === index
                ? "z-[1] visible opacity-100"
                : "invisible opacity-0",
            )}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.imageSrc}
              alt={slide.imageAlt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(0deg,rgba(15,8,30,0.86)_0%,rgba(15,8,30,0.45)_48%,rgba(15,8,30,0.55)_100%)]"
              aria-hidden
            />
          </div>
        ))}

        <div className="absolute inset-0 z-[5] mx-auto flex max-w-[var(--container)] flex-col items-start justify-center px-[var(--pad-inline)] text-left">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgb(232_169_60_/_0.4)] bg-[rgb(232_169_60_/_0.14)] px-3.5 py-1.5 text-[0.78rem] font-bold tracking-[0.14em] text-gold uppercase">
            {active.eyebrow}
          </span>
          <h1 className="text-fs-h1 max-w-[16ch] text-white [text-shadow:0_4px_30px_rgb(0_0_0_/_0.35)]">
            {active.title}
          </h1>
          <p className="text-fs-lead text-on-dark-muted mt-5 max-w-[46ch]">
            {active.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <Button
              render={
                <Link href={localePath(locale, primaryCta.href)} />
              }
            >
              {primaryCta.label}
            </Button>
            <Button
              type="button"
              variant="ghost-light"
              onClick={() => setVideoOpen(true)}
            >
              <Play className="size-4" />
              {secondaryCta.label}
            </Button>
          </div>
        </div>

        {count > 1 ? (
          <>
            <Button
              type="button"
              variant="ghost-light"
              size="icon"
              className="absolute top-1/2 left-[clamp(0.75rem,3vw,2.5rem)] z-[6] hidden -translate-y-1/2 min-[600px]:inline-flex"
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
            >
              <ArrowLeft className="size-[18px]" />
            </Button>
            <Button
              type="button"
              variant="ghost-light"
              size="icon"
              className="absolute top-1/2 right-[clamp(0.75rem,3vw,2.5rem)] z-[6] hidden -translate-y-1/2 min-[600px]:inline-flex"
              aria-label="Next slide"
              onClick={() => go(index + 1)}
            >
              <ArrowRight className="size-[18px]" />
            </Button>
            <div className="absolute inset-x-0 bottom-[clamp(1.25rem,4vw,2.25rem)] z-[6] flex justify-center gap-2.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "h-2.5 rounded-full bg-white/40 transition-all duration-300 ease-[var(--ease)]",
                    i === index
                      ? "w-[26px] rounded-md bg-gold"
                      : "w-2.5",
                  )}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent
          className="w-full max-w-[min(920px,calc(100%-2rem))] overflow-hidden bg-black p-0 sm:max-w-[920px]"
          showCloseButton
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Company story video</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            {videoOpen ? (
              <video
                className="size-full"
                controls
                playsInline
                autoPlay
                poster={videoPoster}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
