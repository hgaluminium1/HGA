"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

import { Reveal } from "@/components/atoms/reveal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HomeContent } from "@/features/public-home/content/home.en";

type MissionVideoSectionProps = {
  content: HomeContent["mission"];
  videoSrc: string;
  videoPoster: string;
};

export function MissionVideoSection({
  content,
  videoSrc,
  videoPoster,
}: MissionVideoSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section
      data-block="mission"
      id="home-sustainability"
      className="relative overflow-hidden text-white"
    >
      <div className="relative min-h-[clamp(20rem,55vw,34rem)]">
        <Image
          src={content.imageSrc}
          alt={content.imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_18_47_/_0.78),rgb(0_18_47_/_0.58))]"
          aria-hidden
        />

        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-[var(--pad-inline)] text-center">
          <Reveal className="flex max-w-[40rem] flex-col items-center">
            <p className="font-display text-balance text-[clamp(1.15rem,0.95rem+1.4vw,1.85rem)] leading-[1.35]">
              {content.statement}
            </p>
            {videoSrc ? (
              <button
                type="button"
                aria-label="Play company story video"
                className="mt-7 flex size-14 items-center justify-center rounded-full bg-white text-ink shadow-[0_8px_28px_rgb(0_0_0_/_0.35)] transition-transform hover:scale-105 min-[480px]:size-[66px]"
                onClick={() => setOpen(true)}
              >
                <Play className="ml-0.5 size-5 fill-current min-[480px]:size-[22px]" />
              </button>
            ) : null}
          </Reveal>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-full max-w-[min(920px,calc(100%-1rem))] overflow-hidden bg-black p-0 sm:max-w-[920px]"
          showCloseButton
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Company story video</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            {open ? (
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
