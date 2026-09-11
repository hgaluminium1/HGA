"use client";

import { SiteHeader } from "@/components/organisms/site-header";
import { useSiteSearch } from "@/features/public-site/components/site-search";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof SiteHeader>, "onSearchOpen">;

/** Header wired to the site search palette without importing features into organisms. */
export function SiteHeaderWithSearch(props: Props) {
  const { openSearch } = useSiteSearch();
  return <SiteHeader {...props} onSearchOpen={openSearch} />;
}
