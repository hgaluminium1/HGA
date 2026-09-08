import type { BlockType } from "../validators/page.validators";
import { defaultBlockData } from "../validators/page.validators";

export type TemplateSection = {
  /** Stable block id within the page document */
  id: string;
  type: BlockType;
  title: string;
  help: string;
};

export type PageTemplate = {
  slug: string;
  label: string;
  description: string;
  /** Public path under /[locale]/ (empty = home) */
  publicPath: string;
  /** Entity-driven pages: section checklist is optional chrome only */
  mode: "sections" | "entity";
  sections: TemplateSection[];
};

/**
 * Locked page templates — editors edit content inside sections only.
 * New marketing URLs require a developer to register a template here.
 */
export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    slug: "home",
    label: "Home",
    description: "Landing page — hero carousel and site sections",
    publicPath: "",
    mode: "sections",
    sections: [
      {
        id: "hero",
        type: "hero",
        title: "Hero carousel",
        help: "Top of the homepage — photos, headlines, and optional video per slide.",
      },
      {
        id: "capability",
        type: "capability",
        title: "Capability & stats",
        help: "Company pitch copy and the large numbers visitors see next.",
      },
      {
        id: "products",
        type: "products",
        title: "Products band",
        help: "Section headline for products; cards come from published catalogue.",
      },
      {
        id: "upcoming-products",
        type: "upcoming-products",
        title: "Upcoming products",
        help: "Section headline for upcoming lines; cards come from catalogue products marked coming soon.",
      },
      {
        id: "markets",
        type: "markets",
        title: "Markets we serve",
        help: "Industry segments — filled from site data automatically.",
      },
      {
        id: "mission",
        type: "mission",
        title: "Mission / video",
        help: "A statement over a large photo, with an optional video.",
      },
      {
        id: "cta-banner",
        type: "cta-banner",
        title: "Inquire banner",
        help: "Mid-page call-to-action with a button.",
      },
      {
        id: "testimonials",
        type: "testimonials",
        title: "Testimonials",
        help: "Partner or customer quotes you can add and reorder.",
      },
      {
        id: "customers",
        type: "customers",
        title: "Customers",
        help: "Logo strip headings; published logos override names when set.",
      },
      {
        id: "joint-ventures",
        type: "joint-ventures",
        title: "Plant capability / JVs",
        help: "Partnership highlights with a supporting photo.",
      },
      {
        id: "careers-teaser",
        type: "careers-teaser",
        title: "Careers teaser",
        help: "Short careers invite with photos and a button.",
      },
      {
        id: "faq",
        type: "faq",
        title: "FAQ",
        help: "Questions and answers visitors ask most often.",
      },
    ],
  },
  {
    slug: "about",
    label: "About",
    description: "Company overview",
    publicPath: "about",
    mode: "sections",
    sections: [
      {
        id: "a-facts",
        type: "company-facts",
        title: "Company facts",
        help: "Hydrated from Company profile.",
      },
      {
        id: "a-stats",
        type: "stats",
        title: "Capacity stats",
        help: "Hydrated from Capacity metrics.",
      },
      {
        id: "a-lead",
        type: "leadership-grid",
        title: "Leadership",
        help: "Hydrated from People.",
      },
      {
        id: "a-certs",
        type: "cert-grid",
        title: "Certifications",
        help: "Hydrated from Certifications.",
      },
      {
        id: "a-exp",
        type: "expansion-roadmap",
        title: "Expansion",
        help: "Hydrated from Expansion projects.",
      },
    ],
  },
  {
    slug: "journey",
    label: "Our Journey",
    description: "Milestones and history",
    publicPath: "journey",
    mode: "sections",
    sections: [
      {
        id: "j-facts",
        type: "company-facts",
        title: "Company facts",
        help: "Hydrated from Company profile.",
      },
      {
        id: "j-stats",
        type: "stats",
        title: "Capacity stats",
        help: "Hydrated from Capacity metrics.",
      },
    ],
  },
  {
    slug: "industries",
    label: "Industries",
    description: "Markets and applications",
    publicPath: "industries",
    mode: "sections",
    sections: [
      {
        id: "i-stats",
        type: "stats",
        title: "Capacity stats",
        help: "Hydrated from Capacity metrics.",
      },
      {
        id: "i-gallery",
        type: "gallery",
        title: "Gallery",
        help: "Customer / application proof.",
      },
    ],
  },
  {
    slug: "manufacturing",
    label: "Manufacturing",
    description: "Plant and infrastructure",
    publicPath: "manufacturing",
    mode: "sections",
    sections: [
      {
        id: "m-stats",
        type: "stats",
        title: "Capacity stats",
        help: "Hydrated from Capacity metrics.",
      },
      {
        id: "m-certs",
        type: "cert-grid",
        title: "Certifications",
        help: "Hydrated from Certifications.",
      },
    ],
  },
  {
    slug: "quality",
    label: "Quality",
    description: "Quality systems",
    publicPath: "quality",
    mode: "sections",
    sections: [
      {
        id: "q-certs",
        type: "cert-grid",
        title: "Certifications",
        help: "Hydrated from Certifications.",
      },
      {
        id: "q-facts",
        type: "company-facts",
        title: "Company facts",
        help: "Hydrated from Company profile.",
      },
    ],
  },
  {
    slug: "sustainability",
    label: "Sustainability",
    description: "ESG metrics",
    publicPath: "sustainability",
    mode: "sections",
    sections: [
      {
        id: "s-metrics",
        type: "sustainability-metrics",
        title: "Sustainability metrics",
        help: "Hydrated from Sustainability admin.",
      },
    ],
  },
  {
    slug: "procurement",
    label: "Procurement",
    description: "Global procurement & export",
    publicPath: "procurement",
    mode: "sections",
    sections: [
      {
        id: "p-facts",
        type: "company-facts",
        title: "Company facts",
        help: "Hydrated from Company profile.",
      },
    ],
  },
  {
    slug: "careers",
    label: "Careers",
    description: "Careers landing",
    publicPath: "careers",
    mode: "sections",
    sections: [
      {
        id: "c-teaser",
        type: "careers-teaser",
        title: "Careers teaser",
        help: "Employer brand copy and images.",
      },
    ],
  },
  {
    slug: "resources",
    label: "Resources",
    description: "Downloads and resources",
    publicPath: "resources",
    mode: "sections",
    sections: [
      {
        id: "r-facts",
        type: "company-facts",
        title: "Company facts",
        help: "Hydrated from Company profile.",
      },
    ],
  },
  {
    slug: "chairmans-message",
    label: "Chairman’s Message",
    description: "N chairmen — photo, title, message (edit People)",
    publicPath: "chairmans-message",
    mode: "entity",
    sections: [],
  },
  {
    slug: "contact",
    label: "Contact",
    description: "Enquiry form, locations, and map",
    publicPath: "contact",
    mode: "entity",
    sections: [],
  },
];

export function getPageTemplate(slug: string): PageTemplate | undefined {
  return PAGE_TEMPLATES.find((t) => t.slug === slug);
}

export function isTemplatedSlug(slug: string): boolean {
  return PAGE_TEMPLATES.some((t) => t.slug === slug);
}

/** Merge existing page blocks onto the locked template order (fill missing). */
export function syncBlocksToTemplate(
  slug: string,
  existing: Array<{
    id: string;
    type: string;
    order: number;
    appearance: string;
    data: unknown;
  }>,
): Array<{
  id: string;
  type: BlockType;
  order: number;
  appearance: string;
  data: unknown;
}> {
  const template = getPageTemplate(slug);
  if (!template || template.mode !== "sections") {
    return existing.map((b, i) => ({
      ...b,
      type: b.type as BlockType,
      order: i,
    }));
  }

  return template.sections.map((section, order) => {
    const found =
      existing.find((b) => b.id === section.id) ??
      existing.find((b) => b.type === section.type);
    return {
      id: section.id,
      type: section.type,
      order,
      appearance: found?.appearance ?? "default",
      data: found?.data ?? defaultBlockData(section.type),
    };
  });
}
