import { normalizeHeroContent } from "@/features/public-home/lib/normalize-hero";
import type { HomeContent } from "@/features/public-home/content/home.en";

export type HeroSlideDraft = HomeContent["hero"]["slides"][number];

export type HeroBlockDraft = {
  slides: HeroSlideDraft[];
};

export function emptySlide(): HeroSlideDraft {
  return {
    imageSrc: "",
    imageAlt: "",
    eyebrow: "",
    title: "",
    subtitle: "",
    primaryCta: { label: "Inquire Now", href: "contact" },
    video: null,
  };
}

export function normalizeHeroBlock(raw: unknown): HeroBlockDraft {
  return normalizeHeroContent(raw);
}
