/**
 * Where a non-technical editor actually changes content for each page.
 * Entity pages skip the "poster" and go straight to the data editor.
 * Composite pages (Customers) open a hub that lists every data source.
 */
export const PAGE_EDIT_DESTINATION: Record<
  string,
  { href: string; label: string; kind: "sections" | "data" | "composite" }
> = {
  leadership: {
    href: "/admin/corporate/people",
    label: "Edit people",
    kind: "data",
  },
  "chairmans-message": {
    href: "/admin/corporate/people",
    label: "Edit chairman profiles",
    kind: "data",
  },
  capacity: {
    href: "/admin/corporate/capacity",
    label: "Edit capacity metrics",
    kind: "data",
  },
  customers: {
    href: "/admin/pages/customers/sources",
    label: "Edit customer sources",
    kind: "composite",
  },
  expansion: {
    href: "/admin/corporate/expansion",
    label: "Edit expansion projects",
    kind: "data",
  },
  careers: {
    href: "/admin/careers",
    label: "Edit open roles",
    kind: "data",
  },
  contact: {
    href: "/admin/corporate/company",
    label: "Edit company profile",
    kind: "data",
  },
};

export function pageEditHref(slug: string): string {
  return PAGE_EDIT_DESTINATION[slug]?.href ?? `/admin/pages/${slug}`;
}
