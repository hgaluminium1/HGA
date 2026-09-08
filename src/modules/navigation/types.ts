export type NavMenuKey =
  | "footer-products"
  | "footer-company"
  | "footer-support"
  | "primary";

export type NavMenuItemDTO = {
  label: string;
  href: string;
  description?: string;
  order: number;
};

export type NavMenuDTO = {
  id: string;
  key: NavMenuKey;
  title: string;
  locale: string;
  items: NavMenuItemDTO[];
  status: "draft" | "published";
  version: number;
  updatedAt: string;
};
