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
    description: "Company overview — fixed sections editors fill in Admin",
    publicPath: "about",
    mode: "sections",
    sections: [
      {
        id: "a-intro",
        type: "page-intro",
        title: "Intro",
        help: "Opening narrative — eyebrow, title, body and optional CTA.",
      },
      {
        id: "a-pillars",
        type: "pillar-list",
        title: "Pillars",
        help: "Three company pillars under the intro.",
      },
      {
        id: "a-stats",
        type: "stats",
        title: "Capacity stats",
        help: "Hydrated from Capacity metrics. Empty until published.",
      },
      {
        id: "a-facts",
        type: "company-facts",
        title: "Company facts",
        help: "Hydrated from Company profile.",
      },
      {
        id: "a-cta",
        type: "cta-banner",
        title: "Inquire banner",
        help: "Closing call-to-action band.",
      },
    ],
  },
  {
    slug: "journey",
    label: "Our Journey",
    description: "Milestones — editable timeline narrative",
    publicPath: "journey",
    mode: "sections",
    sections: [
      {
        id: "j-intro",
        type: "page-intro",
        title: "Intro",
        help: "Opening narrative for the journey page.",
      },
      {
        id: "j-timeline",
        type: "timeline",
        title: "Timeline",
        help: "Yeared milestones visitors scan.",
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
        id: "i-intro",
        type: "page-intro",
        title: "Intro",
        help: "Opening narrative for industries.",
      },
      {
        id: "i-list",
        type: "industry-list",
        title: "Industry list",
        help: "Sectors, applications and product links.",
      },
    ],
  },
  {
    slug: "manufacturing",
    label: "Infrastructure",
    description: "Plant / process — narrative plus entity stats & certs",
    publicPath: "manufacturing",
    mode: "sections",
    sections: [
      {
        id: "m-intro",
        type: "page-intro",
        title: "Intro",
        help: "Opening narrative for infrastructure.",
      },
      {
        id: "m-steps",
        type: "numbered-steps",
        title: "Process steps",
        help: "Charge-to-certificate numbered rail.",
      },
      {
        id: "m-campus",
        type: "pillar-list",
        title: "Campus pillars",
        help: "What integrated campus means here.",
      },
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
    description: "Quality systems — gates, lab and certifications",
    publicPath: "quality",
    mode: "sections",
    sections: [
      {
        id: "q-intro",
        type: "page-intro",
        title: "Intro",
        help: "Opening narrative for quality systems.",
      },
      {
        id: "q-gates",
        type: "numbered-steps",
        title: "Release gates",
        help: "How a lot clears the quality gate.",
      },
      {
        id: "q-lab",
        type: "pillar-list",
        title: "Lab & inspection",
        help: "What we measure when it matters.",
      },
      {
        id: "q-certs",
        type: "cert-grid",
        title: "Certifications",
        help: "Hydrated from Certifications. Empty until published.",
      },
    ],
  },
  {
    slug: "sustainability",
    label: "Sustainability",
    description: "ESG narrative plus metrics from corporate records",
    publicPath: "sustainability",
    mode: "sections",
    sections: [
      {
        id: "s-intro",
        type: "page-intro",
        title: "Intro",
        help: "Opening sustainability narrative.",
      },
      {
        id: "s-pillars",
        type: "pillar-list",
        title: "Approach pillars",
        help: "Secondary pathways, plant discipline, disclosure tiers.",
      },
      {
        id: "s-metrics",
        type: "sustainability-metrics",
        title: "Sustainability metrics",
        help: "Hydrated from Sustainability. Empty until published.",
      },
    ],
  },
  {
    slug: "procurement",
    label: "Procurement & Export",
    description: "Buyer path — steps, export pillars and company facts",
    publicPath: "procurement",
    mode: "sections",
    sections: [
      {
        id: "p-intro",
        type: "page-intro",
        title: "Intro",
        help: "Opening narrative for procurement & export.",
      },
      {
        id: "p-steps",
        type: "numbered-steps",
        title: "How to buy",
        help: "RFQ-to-programme numbered steps.",
      },
      {
        id: "p-export",
        type: "pillar-list",
        title: "Export pillars",
        help: "What export buyers usually ask first.",
      },
      {
        id: "p-facts",
        type: "company-facts",
        title: "Company facts",
        help: "Hydrated from Company profile (contacts).",
      },
    ],
  },
  {
    slug: "resources",
    label: "Resources",
    description: "Technical packs — requestable list plus certs",
    publicPath: "resources",
    mode: "sections",
    sections: [
      {
        id: "r-intro",
        type: "page-intro",
        title: "Intro",
        help: "Opening narrative for resources.",
      },
      {
        id: "r-packs",
        type: "resource-list",
        title: "Resource packs",
        help: "Requestable datasheets and certificate samples.",
      },
      {
        id: "r-certs",
        type: "cert-grid",
        title: "Certifications",
        help: "Hydrated from Certifications.",
      },
    ],
  },
  {
    slug: "careers",
    label: "Careers",
    description: "Open roles — managed under Admin → Careers",
    publicPath: "careers",
    mode: "entity",
    sections: [],
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
  {
    slug: "leadership",
    label: "Leadership",
    description: "Published people — edit under corporate People",
    publicPath: "leadership",
    mode: "entity",
    sections: [],
  },
  {
    slug: "capacity",
    label: "Capacity",
    description: "Verified capacity metrics — edit Capacity records",
    publicPath: "capacity",
    mode: "entity",
    sections: [],
  },
  {
    slug: "customers",
    label: "Customers",
    description: "Approved customer logos — edit corporate logos",
    publicPath: "customers",
    mode: "entity",
    sections: [],
  },
  {
    slug: "expansion",
    label: "Expansion",
    description: "Roadmap projects — edit Expansion records",
    publicPath: "expansion",
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
