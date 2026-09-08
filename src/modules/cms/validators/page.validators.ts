import { z } from "zod";

export const appearanceSchema = z.enum([
  "default",
  "inverted",
  "tinted",
  "compact",
]);

export type BlockAppearance = z.infer<typeof appearanceSchema>;

export const heroBlockDataSchema = z.object({
  slides: z
    .array(
      z.object({
        imageSrc: z.string(),
        imageAlt: z.string(),
        imagePublicId: z.string().optional(),
        eyebrow: z.string(),
        title: z.string(),
        subtitle: z.string(),
        primaryCta: z
          .object({ label: z.string(), href: z.string() })
          .optional(),
        video: z
          .object({
            src: z.string().min(1),
            publicId: z.string().optional(),
            posterSrc: z.string().optional(),
            posterPublicId: z.string().optional(),
            label: z.string().optional(),
          })
          .nullable()
          .optional(),
      }),
    )
    .min(1),
  /** @deprecated Prefer per-slide primaryCta; kept for legacy drafts */
  primaryCta: z
    .object({ label: z.string(), href: z.string() })
    .optional(),
  /** @deprecated Prefer per-slide video */
  secondaryCta: z.object({ label: z.string() }).optional(),
  /** @deprecated Prefer per-slide video.src */
  videoSrc: z.string().optional(),
  /** @deprecated Prefer per-slide video.posterSrc */
  videoPoster: z.string().optional(),
});

export const capabilityBlockDataSchema = z.object({
  eyebrow: z.string(),
  title: z.string().min(1),
  body: z.string(),
  highlightWords: z.array(z.string()),
  stats: z.array(
    z.object({
      target: z.number(),
      suffix: z.string(),
      label: z.string(),
    }),
  ),
});

export const productsBlockDataSchema = z.object({
  eyebrow: z.string(),
  title: z.string().min(1),
  description: z.string(),
  /** Optional; when empty/absent the public renderer hydrates from published catalog */
  items: z
    .array(
      z.object({
        title: z.string(),
        href: z.string(),
        imageSrc: z.string(),
        imageAlt: z.string(),
        wide: z.boolean().optional(),
      }),
    )
    .default([]),
});

export const upcomingProductsBlockDataSchema = z.object({
  eyebrow: z.string().default("Pipeline"),
  title: z.string().default("Upcoming products"),
  description: z.string().default(""),
});

export const missionBlockDataSchema = z.object({
  imageSrc: z.string(),
  imageAlt: z.string(),
  statement: z.string(),
  videoSrc: z.string().optional(),
  videoPoster: z.string().optional(),
});

export const ctaBannerBlockDataSchema = z.object({
  title: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
});

export const testimonialsBlockDataSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  items: z.array(
    z.object({
      initials: z.string(),
      name: z.string(),
      role: z.string(),
      quote: z.string(),
    }),
  ),
});

export const customersBlockDataSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
  logos: z.array(z.string()),
});

export const jointVenturesBlockDataSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  imageSrc: z.string(),
  imageAlt: z.string(),
  items: z.array(
    z.object({
      title: z.string(),
      subtitle: z.string(),
      icon: z.enum(["handshake", "factory", "leaf"]),
    }),
  ),
});

export const careersTeaserBlockDataSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  body: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  images: z.array(z.object({ src: z.string(), alt: z.string() })),
});

export const faqBlockDataSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  items: z.array(z.object({ question: z.string(), answer: z.string() })),
});

export const BLOCK_TYPES = [
  "hero",
  "capability",
  "products",
  "mission",
  "cta-banner",
  "testimonials",
  "customers",
  "joint-ventures",
  "careers-teaser",
  "faq",
  "stats",
  "leadership-grid",
  "company-facts",
  "cert-grid",
  "sustainability-metrics",
  "logo-strip",
  "gallery",
  "expansion-roadmap",
  "upcoming-products",
  "markets",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export const blockTypeSchema = z.enum(BLOCK_TYPES);

const corporateBlockDataSchema = z.record(z.string(), z.unknown()).default({});

const blockDataByType = {
  hero: heroBlockDataSchema,
  capability: capabilityBlockDataSchema,
  products: productsBlockDataSchema,
  mission: missionBlockDataSchema,
  "cta-banner": ctaBannerBlockDataSchema,
  testimonials: testimonialsBlockDataSchema,
  customers: customersBlockDataSchema,
  "joint-ventures": jointVenturesBlockDataSchema,
  "careers-teaser": careersTeaserBlockDataSchema,
  faq: faqBlockDataSchema,
  stats: corporateBlockDataSchema,
  "leadership-grid": corporateBlockDataSchema,
  "company-facts": corporateBlockDataSchema,
  "cert-grid": corporateBlockDataSchema,
  "sustainability-metrics": corporateBlockDataSchema,
  "logo-strip": corporateBlockDataSchema,
  gallery: corporateBlockDataSchema,
  "expansion-roadmap": corporateBlockDataSchema,
  "upcoming-products": upcomingProductsBlockDataSchema,
  markets: corporateBlockDataSchema,
} as const;

export const pageBlockSchema = z
  .object({
    id: z.string().min(1),
    type: blockTypeSchema,
    order: z.number().int().nonnegative(),
    appearance: appearanceSchema.default("default"),
    data: z.unknown(),
  })
  .superRefine((block, ctx) => {
    const schema = blockDataByType[block.type];
    const parsed = schema.safeParse(block.data);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        ctx.addIssue({
          code: "custom",
          message: issue.message,
          path: ["data", ...issue.path],
        });
      }
    }
  });

export const pageStatusSchema = z.enum(["draft", "scheduled", "published"]);

export const pageSeoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export const createPageSchema = z.object({
  title: z.string().min(1),
  slug: z.string(),
  locale: z.string().default("en"),
  blocks: z.array(pageBlockSchema).default([]),
  seo: pageSeoSchema.optional(),
  createRedirectOnSlugChange: z.boolean().optional(),
});

export const updatePageSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().optional(),
  locale: z.string().optional(),
  blocks: z.array(pageBlockSchema).optional(),
  seo: pageSeoSchema.optional(),
  status: pageStatusSchema.optional(),
  scheduledPublishAt: z.string().datetime().nullable().optional(),
  createRedirectOnSlugChange: z.boolean().optional(),
  version: z.number().int(),
});

export const redirectSchema = z.object({
  fromPath: z.string().min(1),
  toPath: z.string().min(1),
  statusCode: z.union([z.literal(301), z.literal(302)]).default(301),
  active: z.boolean().default(true),
});

export const BLOCK_PICKER: { type: BlockType; label: string; description: string }[] =
  [
    { type: "hero", label: "Hero", description: "Full-bleed carousel with CTAs" },
    {
      type: "capability",
      label: "Capability & stats",
      description: "Company pitch with animated numbers",
    },
    {
      type: "products",
      label: "Products grid",
      description: "Product cards linking to catalog pages",
    },
    {
      type: "mission",
      label: "Mission / video",
      description: "Statement over a full-bleed image",
    },
    {
      type: "cta-banner",
      label: "Inquire banner",
      description: "Mid-page call to action",
    },
    {
      type: "testimonials",
      label: "Testimonials",
      description: "Partner quotes carousel",
    },
    {
      type: "customers",
      label: "Customers",
      description: "Logo / name strip",
    },
    {
      type: "joint-ventures",
      label: "Joint ventures",
      description: "Partnership highlights",
    },
    {
      type: "careers-teaser",
      label: "Careers teaser",
      description: "Employer brand section",
    },
    { type: "faq", label: "FAQ", description: "Accordion questions" },
    { type: "stats", label: "Capacity stats", description: "Verified capacity metrics" },
    {
      type: "leadership-grid",
      label: "Leadership",
      description: "Published people grid",
    },
    {
      type: "company-facts",
      label: "Company facts",
      description: "Company profile snapshot",
    },
    {
      type: "cert-grid",
      label: "Certifications",
      description: "Published certifications",
    },
    {
      type: "sustainability-metrics",
      label: "Sustainability",
      description: "Tiered sustainability metrics",
    },
    {
      type: "logo-strip",
      label: "Customer logos",
      description: "Approved customer logos",
    },
    {
      type: "gallery",
      label: "Gallery / customers",
      description: "Customer proof gallery",
    },
    {
      type: "expansion-roadmap",
      label: "Expansion roadmap",
      description: "Published expansion projects",
    },
    {
      type: "upcoming-products",
      label: "Upcoming products",
      description: "Coming-soon catalogue strip",
    },
    {
      type: "markets",
      label: "Markets we serve",
      description: "Industry segments grid",
    },
  ];

export function defaultBlockData(type: BlockType): unknown {
  switch (type) {
    case "hero":
      return {
        slides: [
          {
            imageSrc: "https://picsum.photos/seed/hg-plant-wide/1600/900",
            imageAlt: "Plant",
            eyebrow: "New section",
            title: "Headline",
            subtitle: "Supporting text",
            primaryCta: { label: "Inquire Now", href: "contact" },
            video: null,
          },
        ],
      };
    case "capability":
      return {
        eyebrow: "About",
        title: "Title",
        body: "Body copy",
        highlightWords: [],
        stats: [{ target: 0, suffix: "", label: "Metric" }],
      };
    case "products":
      return {
        eyebrow: "Products",
        title: "Products",
        description: "",
        items: [],
      };
    case "mission":
      return {
        imageSrc: "https://picsum.photos/seed/hg-city-glass/1600/900",
        imageAlt: "",
        statement: "Mission statement",
        videoSrc: "",
        videoPoster: "",
      };
    case "cta-banner":
      return {
        title: "Call to action",
        ctaLabel: "Inquire Now",
        ctaHref: "contact",
      };
    case "testimonials":
      return { eyebrow: "Testimonials", title: "What partners say", items: [] };
    case "customers":
      return {
        eyebrow: "Customers",
        title: "Trusted by",
        description: "",
        logos: [],
      };
    case "joint-ventures":
      return {
        eyebrow: "Joint Ventures",
        title: "Partners",
        imageSrc: "https://picsum.photos/seed/hg-handshake-deal/1600/900",
        imageAlt: "",
        items: [],
      };
    case "careers-teaser":
      return {
        eyebrow: "Careers",
        title: "Join us",
        body: "",
        ctaLabel: "Apply Now",
        ctaHref: "careers",
        images: [],
      };
    case "faq":
      return { eyebrow: "FAQ", title: "Questions", items: [] };
    case "stats":
    case "leadership-grid":
    case "company-facts":
    case "cert-grid":
    case "sustainability-metrics":
    case "logo-strip":
    case "gallery":
    case "expansion-roadmap":
    case "markets":
      return { seeded: true };
    case "upcoming-products":
      return {
        eyebrow: "Pipeline",
        title: "Upcoming products",
        description:
          "Coming soon from HG — register interest for early allocation.",
      };
  }
}
