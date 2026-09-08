import {
  companyNavAllowlist,
  footerCompanyAllowlist,
  footerContactFallback,
  footerUtilityAllowlist,
  primaryNavAllowlist,
  productNavAllowlist,
  productNavFeatureDefault,
  type NavGroup,
  type NavLink,
  type NavSection,
} from "@/config/nav.config";
import { getCachedPublishedPage } from "@/features/public-site/lib/public-cache";
import { getCachedCompanyProfile } from "@/features/public-corporate/lib/public-cache";
import { getCachedPublishedProducts } from "@/features/public-site/lib/public-cache";
import { getPublishedNavMenu } from "@/modules/navigation";

export type PublicNavFooter = {
  /** Category landings + View full catalogue — never individual SKUs. */
  products: NavLink[];
  company: NavLink[];
  support: NavLink[];
  contact: {
    address: string;
    email: string;
    phone: string;
    mapsUrl: string;
  };
};

export type PublicNavResolved = {
  productNav: NavGroup;
  companyNav: NavGroup;
  primaryNavLinks: NavLink[];
  footer: PublicNavFooter;
  /** @deprecated Prefer `footer` columns — flat list for legacy callers. */
  footerQuickLinks: NavLink[];
  footerContact: PublicNavFooter["contact"];
};

async function publishedSlugs(slugs: string[], locale: string) {
  const results = await Promise.all(
    slugs.map(async (slug) => {
      const corporateOnly = new Set([
        "leadership",
        "capacity",
        "customers",
        "expansion",
        "products",
        "chairmans-message",
        "contact",
      ]);
      if (corporateOnly.has(slug)) return slug;
      const page = await getCachedPublishedPage(slug, locale);
      return page ? slug : null;
    }),
  );
  return new Set(results.filter((s): s is string => Boolean(s)));
}

function formatAddress(parts: {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}) {
  return [
    parts.line1,
    parts.line2,
    [parts.city, parts.state].filter(Boolean).join(", "),
    parts.postalCode,
    parts.country,
  ]
    .filter(Boolean)
    .join(", ");
}

const COMPANY_SECTIONS: { title: string; hrefs: string[] }[] = [
  {
    title: "About",
    hrefs: ["about", "journey", "chairmans-message", "leadership", "customers"],
  },
  {
    title: "Operations",
    hrefs: ["capacity", "manufacturing", "quality", "expansion", "sustainability"],
  },
  {
    title: "Work with us",
    hrefs: ["procurement", "careers", "resources"],
  },
];

/**
 * Resolve header + footer nav from allowlists ∩ published content.
 *
 * IA rules (category-first, FAANG/industrial chrome):
 * - Categories are the browse spine in mega + footer.
 * - Present / upcoming SKUs are capped in the mega only (not footer).
 * - Footer = durable Products (categories) + Company + Support.
 */
export async function resolvePublicNav(
  locale = "en",
): Promise<PublicNavResolved> {
  const companySlugs = companyNavAllowlist.map((i) => i.href);
  const productPageSlugs = productNavAllowlist.map((i) => i.href);
  const primarySlugs = primaryNavAllowlist.map((i) => i.href);
  const footerCompanySlugs = footerCompanyAllowlist.map((i) => i.href);
  const utilitySlugs = footerUtilityAllowlist.map((i) => i.href);

  const [live, present, upcoming, company, cmsFooterProducts, cmsFooterCompany, cmsFooterSupport, cmsPrimary] =
    await Promise.all([
    publishedSlugs(
      [
        ...new Set([
          ...companySlugs,
          ...productPageSlugs,
          ...primarySlugs,
          ...footerCompanySlugs,
          ...utilitySlugs,
          "products",
        ]),
      ],
      locale,
    ),
    getCachedPublishedProducts({ limit: 6, upcoming: false }),
    getCachedPublishedProducts({ limit: 4, upcoming: true }),
    getCachedCompanyProfile(),
    getPublishedNavMenu("footer-products", locale).catch(() => null),
    getPublishedNavMenu("footer-company", locale).catch(() => null),
    getPublishedNavMenu("footer-support", locale).catch(() => null),
    getPublishedNavMenu("primary", locale).catch(() => null),
  ]);

  const companyItems = companyNavAllowlist.filter((i) => live.has(i.href));
  const primaryNavLinks = cmsPrimary?.items?.length
    ? cmsPrimary.items.map(({ label, href, description }) => ({
        label,
        href,
        description,
      }))
    : primaryNavAllowlist.filter((i) => live.has(i.href));

  const categoryItems = productNavAllowlist.filter((i) => live.has(i.href));
  const categoriesForNav = categoryItems.length
    ? categoryItems
    : productNavAllowlist.slice(0, 3);

  const presentLinks: NavLink[] = present.items.slice(0, 4).map((p) => ({
    label: p.name.en,
    href: `products/${p.slug}`,
    description: p.sku,
  }));

  const upcomingLinks: NavLink[] = upcoming.items.slice(0, 3).map((p) => ({
    label: p.name.en,
    href: `products/${p.slug}`,
    description: "Coming soon",
  }));

  const productSections: NavSection[] = [
    {
      title: "Shop by category",
      href: live.has("products") ? "products" : undefined,
      items: categoriesForNav,
    },
  ];

  if (presentLinks.length) {
    productSections.push({
      title: "Present lines",
      href: live.has("products") ? "products" : undefined,
      items: presentLinks,
    });
  }

  if (upcomingLinks.length) {
    productSections.push({
      title: "Coming soon",
      href: live.has("products") ? "products#upcoming" : undefined,
      items: upcomingLinks,
    });
  }

  const companySections: NavSection[] = COMPANY_SECTIONS.map((sec) => ({
    title: sec.title,
    items: companyItems.filter((i) => sec.hrefs.includes(i.href)),
  })).filter((sec) => sec.items.length > 0);

  const footerProducts: NavLink[] = cmsFooterProducts?.items?.length
    ? cmsFooterProducts.items.map(({ label, href, description }) => ({
        label,
        href,
        description,
      }))
    : [
        ...categoriesForNav.map(({ label, href, description }) => ({
          label,
          href,
          description,
        })),
        ...(live.has("products")
          ? [{ label: "View full catalogue", href: "products" }]
          : []),
      ];

  const footerCompany = cmsFooterCompany?.items?.length
    ? cmsFooterCompany.items.map(({ label, href }) => ({ label, href }))
    : footerCompanyAllowlist.filter((i) => live.has(i.href));
  const footerSupport = cmsFooterSupport?.items?.length
    ? cmsFooterSupport.items.map(({ label, href }) => ({ label, href }))
    : footerUtilityAllowlist.filter((i) => live.has(i.href));

  const office = company?.registeredOffice ?? company?.factoryAddress;
  const phone = company?.phones?.[0]?.number ?? footerContactFallback.phone;
  const email = company?.emails?.sales || footerContactFallback.email;
  const address = office
    ? formatAddress(office)
    : footerContactFallback.address;
  const mapsQuery = encodeURIComponent(address);

  const footerContact = {
    address,
    email,
    phone,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
  };

  const footer: PublicNavFooter = {
    products: footerProducts,
    company: footerCompany,
    support: footerSupport,
    contact: footerContact,
  };

  return {
    productNav: {
      id: "products",
      label: "Products",
      items: categoriesForNav,
      sections: productSections,
      feature: {
        ...productNavFeatureDefault,
        href: live.has("products") ? "products" : productNavFeatureDefault.href,
        eyebrow: "Catalogue",
        title: "View all products & specs →",
      },
    },
    companyNav: {
      id: "company",
      label: "Company",
      items: companyItems,
      sections: companySections,
    },
    primaryNavLinks,
    footer,
    footerQuickLinks: [
      ...footer.products,
      ...footer.company,
      ...footer.support,
    ],
    footerContact,
  };
}
