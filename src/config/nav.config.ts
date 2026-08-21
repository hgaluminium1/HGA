/**
 * Config-driven public navigation (§23.11).
 * Locale prefix is applied by helpers — paths are locale-relative.
 */

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  icon?: "drop" | "ingot" | "billet" | "recycle" | "factory" | "leaf" | "handshake";
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavLink[];
  feature?: {
    href: string;
    imageSrc: string;
    imageAlt: string;
    eyebrow: string;
    title: string;
  };
};

export const localeDefault = "en" as const;

export const publicPages = [
  { slug: "", title: "Home", description: "HG Aluminium Smelters home" },
  { slug: "about", title: "About HG", description: "About HG Aluminium Smelters" },
  {
    slug: "journey",
    title: "Our Journey",
    description: "Company profile and journey",
  },
  {
    slug: "products",
    title: "Products",
    description: "Product overview",
  },
  {
    slug: "products/extrusion-profiles",
    title: "Aluminium Extrusion Profiles",
    description: "Extrusion profiles",
  },
  {
    slug: "products/billets",
    title: "Aluminium Billets",
    description: "Extrusion-ready billets",
  },
  {
    slug: "products/ingots-alloys",
    title: "Aluminium Ingots / Alloys",
    description: "Ingots and alloys",
  },
  {
    slug: "industries",
    title: "Industries & Applications",
    description: "Industries we serve",
  },
  {
    slug: "manufacturing",
    title: "Manufacturing & Infrastructure",
    description: "Plants and infrastructure",
  },
  {
    slug: "quality",
    title: "Quality & Certifications",
    description: "Quality systems and certifications",
  },
  {
    slug: "sustainability",
    title: "Sustainability / ESG",
    description: "Sustainability and ESG",
  },
  {
    slug: "procurement",
    title: "Global Procurement & Export",
    description: "Procurement and export",
  },
  { slug: "careers", title: "Careers", description: "Careers at HG" },
  {
    slug: "resources",
    title: "Resources / Downloads",
    description: "Resources and downloads",
  },
  {
    slug: "contact",
    title: "Contact Us / RFQ",
    description: "Contact and RFQ",
  },
] as const;

export function localePath(locale: string, slug = "") {
  const clean = slug.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

export const productNav: NavGroup = {
  id: "products",
  label: "Products",
  items: [
    {
      label: "Aluminium Alloy (Liquid)",
      href: "products/ingots-alloys",
      description: "Molten alloy, direct furnace-to-furnace supply",
      icon: "drop",
    },
    {
      label: "Aluminium Alloy (Ingot)",
      href: "products/ingots-alloys",
      description: "Solid ingots cast to LME-grade spec",
      icon: "ingot",
    },
    {
      label: "Aluminium Billets",
      href: "products/billets",
      description: "Extrusion-ready billets, custom diameters",
      icon: "billet",
    },
    {
      label: "Extrusion Profiles",
      href: "products/extrusion-profiles",
      description: "Profiles for industrial applications",
      icon: "recycle",
    },
  ],
  feature: {
    href: "products",
    imageSrc: "https://picsum.photos/seed/hg-ingots-stack/460/440",
    imageAlt: "Stacked aluminium ingots",
    eyebrow: "Full Catalogue",
    title: "Explore every alloy grade & spec sheet →",
  },
};

export const companyNav: NavGroup = {
  id: "company",
  label: "Company",
  items: [
    { label: "About Us", href: "about" },
    { label: "Our Journey", href: "journey" },
    { label: "Quality", href: "quality" },
    { label: "Infrastructure", href: "manufacturing" },
    { label: "Sustainability", href: "sustainability" },
    { label: "Procurement & Export", href: "procurement" },
    { label: "Careers", href: "careers" },
    { label: "Resources", href: "resources" },
  ],
};

export const primaryNavLinks: NavLink[] = [
  { label: "Industries", href: "industries" },
  { label: "Contact Us", href: "contact" },
];

export const footerQuickLinks: NavLink[] = [
  { label: "Aluminium Alloy (Ingot)", href: "products/ingots-alloys" },
  { label: "Aluminium Alloy (Liquid)", href: "products/ingots-alloys" },
  { label: "Aluminium Billets", href: "products/billets" },
  { label: "Extrusion Profiles", href: "products/extrusion-profiles" },
  { label: "Careers", href: "careers" },
  { label: "Resources", href: "resources" },
  { label: "Contact / RFQ", href: "contact" },
];

export const footerContact = {
  address:
    "HG Aluminium Smelters Ltd., 7th Floor, Tower 2, Business Park, Faridabad, Haryana – 121003, India",
  email: "info@hgaluminiumsmelters.example",
  phone: "+91 (000) 000-0000",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Faridabad+Haryana",
} as const;
