import type { ReactNode } from "react";

import { CapabilitySection } from "@/features/public-home/components/capability-section";
import { CareersTeaserSection } from "@/features/public-home/components/careers-teaser-section";
import { CustomersLogoStrip } from "@/features/public-home/components/customers-logo-strip";
import { FaqSection } from "@/features/public-home/components/faq-section";
import { HeroCarousel } from "@/features/public-home/components/hero-carousel";
import { InquireCtaBanner } from "@/features/public-home/components/inquire-cta-banner";
import { JointVenturesSection } from "@/features/public-home/components/joint-ventures-section";
import { MissionVideoSection } from "@/features/public-home/components/mission-video-section";
import { ProductsSection } from "@/features/public-home/components/products-section";
import { TestimonialsCarousel } from "@/features/public-home/components/testimonials-carousel";
import type { HomeContent } from "@/features/public-home/content/home.en";
import { normalizeHeroContent } from "@/features/public-home/lib/normalize-hero";
import {
  CertGridBlock,
  CompanyFactsBlock,
  CustomerLogoStripBlock,
  ExpansionRoadmapBlock,
  LeadershipGridBlock,
  StatsBlock,
  SustainabilityMetricsBlock,
} from "@/features/public-corporate";
import { MarketsSection } from "@/features/public-site/components/markets-section";
import { UpcomingProductsStrip } from "@/features/public-site/components/upcoming-products";
import { productImageUrl } from "@/features/public-catalog/lib/product-media";
import {
  getCachedPublishedProducts,
} from "@/features/public-site/lib/public-cache";
import { getCachedPublishedLogos } from "@/features/public-corporate/lib/public-cache";

export type CmsBlock = {
  id: string;
  type: string;
  order: number;
  appearance?: string;
  data: unknown;
};

async function hydrateProductsBlock(
  content: HomeContent["products"],
): Promise<{
  content: HomeContent["products"];
  products: Awaited<
    ReturnType<typeof getCachedPublishedProducts>
  >["items"];
}> {
  const { items } = await getCachedPublishedProducts({
    limit: 6,
    upcoming: false,
  });
  if (!items.length) {
    return {
      content: { ...content, items: content.items ?? [] },
      products: [],
    };
  }
  return {
    content: {
      eyebrow: content.eyebrow || "Our Products",
      title: content.title || "Present catalogue lines",
      description:
        content.description ||
        "Extrusion profiles, homogenised billets and remelt ingots — published and ready for enquiry.",
      items: items.map((p, index) => ({
        title: p.name.en,
        href: `products/${p.slug}`,
        imageSrc: productImageUrl(p),
        imageAlt: p.name.en,
        wide: index === items.length - 1 && items.length % 2 === 1,
      })),
    },
    products: items,
  };
}

function parseUpcomingCopy(data: unknown): {
  eyebrow: string;
  title: string;
  description: string;
} {
  const d =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : {};
  return {
    eyebrow: typeof d.eyebrow === "string" && d.eyebrow ? d.eyebrow : "Pipeline",
    title:
      typeof d.title === "string" && d.title
        ? d.title
        : "Upcoming products",
    description:
      typeof d.description === "string"
        ? d.description
        : "Coming soon from HG — register interest for early allocation.",
  };
}

async function hydrateCustomersBlock(
  content: HomeContent["customers"],
): Promise<HomeContent["customers"]> {
  const logos = await getCachedPublishedLogos();
  if (!logos.length) return content;
  return {
    eyebrow: content.eyebrow || "Customers",
    title: content.title || "Organisations we serve",
    description:
      content.description ||
      "Name tiles from approved customer records — logos only with permission.",
    logos: logos.map((l) => l.name),
  };
}

function SoftFail({ type }: { type: string }) {
  return (
    <div className="border-line bg-surface-muted text-muted-foreground mx-auto my-6 max-w-3xl rounded-[var(--radius-md)] border border-dashed p-6 text-center text-sm">
      Section “{type}” is unavailable in this preview.
    </div>
  );
}

export async function renderCmsBlock(
  block: CmsBlock,
  locale: string,
): Promise<ReactNode> {
  const appearance = block.appearance ?? "default";
  const wrap = (node: ReactNode) => (
    <div data-block={block.type} data-appearance={appearance} key={block.id}>
      {node}
    </div>
  );

  try {
    switch (block.type) {
      case "hero":
        return wrap(
          <HeroCarousel
            locale={locale}
            content={normalizeHeroContent(block.data)}
          />,
        );
      case "capability":
        return wrap(
          <CapabilitySection
            content={block.data as HomeContent["capability"]}
          />,
        );
      case "products": {
        const hydrated = await hydrateProductsBlock(
          block.data as HomeContent["products"],
        );
        return wrap(
          <ProductsSection
            locale={locale}
            content={hydrated.content}
            products={hydrated.products}
          />,
        );
      }
      case "upcoming-products": {
        const copy = parseUpcomingCopy(block.data);
        return wrap(
          <UpcomingProductsStrip
            locale={locale}
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />,
        );
      }
      case "markets":
        return wrap(<MarketsSection locale={locale} limit={8} />);
      case "mission": {
        const data = block.data as HomeContent["mission"] & {
          videoSrc?: string;
          videoPoster?: string;
        };
        return wrap(
          <MissionVideoSection
            content={{
              imageSrc: data.imageSrc,
              imageAlt: data.imageAlt,
              statement: data.statement,
            }}
            videoSrc={data.videoSrc ?? ""}
            videoPoster={data.videoPoster ?? ""}
          />,
        );
      }
      case "customers":
        return wrap(
          <CustomersLogoStrip
            content={await hydrateCustomersBlock(
              block.data as HomeContent["customers"],
            )}
          />,
        );
      case "testimonials":
        return wrap(
          <TestimonialsCarousel
            content={block.data as HomeContent["testimonials"]}
          />,
        );
      case "cta-banner":
        return wrap(
          <InquireCtaBanner
            locale={locale}
            content={block.data as HomeContent["ctaBanner"]}
          />,
        );
      case "joint-ventures":
        return wrap(
          <JointVenturesSection
            content={block.data as HomeContent["jointVentures"]}
          />,
        );
      case "careers-teaser":
        return wrap(
          <CareersTeaserSection
            locale={locale}
            content={block.data as HomeContent["careers"]}
          />,
        );
      case "faq":
        return wrap(
          <FaqSection content={block.data as HomeContent["faq"]} />,
        );
      case "stats":
        return wrap(<StatsBlock />);
      case "company-facts":
        return wrap(<CompanyFactsBlock />);
      case "cert-grid":
        return wrap(<CertGridBlock />);
      case "sustainability-metrics":
        return wrap(<SustainabilityMetricsBlock />);
      case "leadership-grid":
        return wrap(<LeadershipGridBlock />);
      case "logo-strip":
      case "gallery":
        return wrap(<CustomerLogoStripBlock />);
      case "expansion-roadmap":
        return wrap(<ExpansionRoadmapBlock />);
      default:
        return <SoftFail key={block.id} type={block.type} />;
    }
  } catch {
    return <SoftFail key={block.id} type={block.type} />;
  }
}

export async function CmsPageBlocks({
  blocks,
  locale,
}: {
  blocks: CmsBlock[];
  locale: string;
}) {
  const ordered = [...blocks].sort((a, b) => a.order - b.order);
  const nodes = await Promise.all(
    ordered.map((b) => renderCmsBlock(b, locale)),
  );
  return <>{nodes}</>;
}
