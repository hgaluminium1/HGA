import { getCachedCompanyProfile } from "@/features/public-corporate/lib/public-cache";

/**
 * Same resolution as header / footer BrandLockup:
 * company PNG → company SVG → packaged HG mark (caller applies fallback).
 */
export function brandLogoSrcFromProfile(
  company:
    | {
        logo?: {
          png?: string | null;
          svg?: string | null;
        } | null;
      }
    | null
    | undefined,
): string | null {
  const png = company?.logo?.png?.trim();
  if (png) return png;
  const svg = company?.logo?.svg?.trim();
  if (svg) return svg;
  return null;
}

/** Packaged mark used by BrandLockup when CMS logo is empty. */
export const FALLBACK_BRAND_ICON = "/HGLogo.jpeg";

export async function resolveBrandLogoSrc(): Promise<string | null> {
  const company = await getCachedCompanyProfile();
  return brandLogoSrcFromProfile(company);
}
