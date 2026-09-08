import { describe, expect, it } from "vitest";

import { normalizeHeroContent } from "@/features/public-home/lib/normalize-hero";
import { safeAdminCallbackUrl } from "@/lib/auth/safe-callback-url";

describe("normalizeHeroContent", () => {
  it("migrates block-level video onto slide 0", () => {
    const hero = normalizeHeroContent({
      slides: [
        {
          imageSrc: "/a.jpg",
          imageAlt: "a",
          eyebrow: "e",
          title: "t",
          subtitle: "s",
        },
      ],
      primaryCta: { label: "Go", href: "contact" },
      secondaryCta: { label: "Watch" },
      videoSrc: "https://example.com/v.mp4",
      videoPoster: "https://example.com/p.jpg",
    });
    expect(hero.slides[0]?.video?.src).toBe("https://example.com/v.mp4");
    expect(hero.slides[0]?.video?.label).toBe("Watch");
    expect(hero.slides[0]?.primaryCta.label).toBe("Go");
  });

  it("keeps per-slide video", () => {
    const hero = normalizeHeroContent({
      slides: [
        {
          imageSrc: "/a.jpg",
          imageAlt: "",
          eyebrow: "",
          title: "One",
          subtitle: "",
          primaryCta: { label: "A", href: "a" },
          video: { src: "https://example.com/one.mp4", label: "Play" },
        },
      ],
    });
    expect(hero.slides[0]?.video?.src).toContain("one.mp4");
  });
});

describe("safeAdminCallbackUrl", () => {
  it("rejects open redirects", () => {
    expect(safeAdminCallbackUrl("https://evil.com/admin")).toBe("/admin");
    expect(safeAdminCallbackUrl("//evil.com")).toBe("/admin");
    expect(safeAdminCallbackUrl("/admin/landing")).toBe("/admin/landing");
    expect(safeAdminCallbackUrl("/admin/login")).toBe("/admin");
  });
});
