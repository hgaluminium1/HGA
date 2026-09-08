import type { HomeContent } from "@/features/public-home/content/home.en";

/**
 * Normalize stored / legacy hero block into per-slide video + CTA shape.
 * Shared by public renderer and admin desk.
 */
export function normalizeHeroContent(raw: unknown): HomeContent["hero"] {
  const d = (raw && typeof raw === "object" ? raw : {}) as Record<
    string,
    unknown
  >;
  const slidesIn = Array.isArray(d.slides) ? d.slides : [];
  const legacyVideoSrc = typeof d.videoSrc === "string" ? d.videoSrc : "";
  const legacyPoster = typeof d.videoPoster === "string" ? d.videoPoster : "";
  const legacySecondary = (
    d.secondaryCta && typeof d.secondaryCta === "object" ? d.secondaryCta : {}
  ) as { label?: string };
  const legacyPrimary = (
    d.primaryCta && typeof d.primaryCta === "object" ? d.primaryCta : {}
  ) as { label?: string; href?: string };

  const slides = slidesIn.map((s, i) => {
    const slide = (s && typeof s === "object" ? s : {}) as Record<
      string,
      unknown
    >;
    const slideCta = (
      slide.primaryCta && typeof slide.primaryCta === "object"
        ? slide.primaryCta
        : null
    ) as { label?: string; href?: string } | null;
    const slideVideo = (
      slide.video && typeof slide.video === "object" ? slide.video : null
    ) as {
      src?: string;
      publicId?: string;
      posterSrc?: string;
      posterPublicId?: string;
      label?: string;
    } | null;

    let video: HomeContent["hero"]["slides"][number]["video"] = null;
    if (slideVideo?.src) {
      video = {
        src: slideVideo.src,
        publicId: slideVideo.publicId,
        posterSrc: slideVideo.posterSrc,
        posterPublicId: slideVideo.posterPublicId,
        label: slideVideo.label ?? "Watch video",
      };
    } else if (i === 0 && legacyVideoSrc) {
      video = {
        src: legacyVideoSrc,
        posterSrc: legacyPoster || undefined,
        label: legacySecondary.label ?? "Watch Our Story",
      };
    }

    return {
      imageSrc: String(slide.imageSrc ?? ""),
      imageAlt: String(slide.imageAlt ?? ""),
      imagePublicId:
        typeof slide.imagePublicId === "string"
          ? slide.imagePublicId
          : undefined,
      eyebrow: String(slide.eyebrow ?? ""),
      title: String(slide.title ?? ""),
      subtitle: String(slide.subtitle ?? ""),
      primaryCta: {
        label: String(slideCta?.label ?? legacyPrimary.label ?? "Inquire Now"),
        href: String(slideCta?.href ?? legacyPrimary.href ?? "contact"),
      },
      video,
    };
  });

  return {
    slides: slides.length
      ? slides
      : [
          {
            imageSrc: "",
            imageAlt: "",
            eyebrow: "",
            title: "",
            subtitle: "",
            primaryCta: { label: "Inquire Now", href: "contact" },
            video: null,
          },
        ],
  };
}
