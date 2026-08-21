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
      <div className="relative min-h-[clamp(380px,60vw,560px)]">
        <Image
          src={content.imageSrc}
          alt={content.imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,11,40,0.75),rgba(20,11,40,0.55))]"
          aria-hidden
        />

        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-8 text-center">
          <Reveal className="flex flex-col items-center">
            <p className="font-display max-w-[22ch] text-[clamp(1.2rem,3vw,2rem)] leading-[1.35]">
              {content.statement}
            </p>
            <button
              type="button"
              aria-label="Play company story video"
              className="animate-pulse-ring mt-8 flex size-[66px] items-center justify-center rounded-full bg-white/95 text-ink transition-transform hover:scale-105"
              onClick={() => setOpen(true)}
            >
              <Play className="ml-0.5 size-[22px] fill-current" />
            </button>
          </Reveal>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-full max-w-[min(920px,calc(100%-2rem))] overflow-hidden bg-black p-0 sm:max-w-[920px]"
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
