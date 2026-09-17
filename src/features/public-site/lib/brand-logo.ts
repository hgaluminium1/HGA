import { getCachedCompanyProfile } from "@/features/public-corporate/lib/public-cache";

/** Same resolution order as header / footer brand lockup. */
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

export async function resolveBrandLogoSrc(): Promise<string | null> {
  const company = await getCachedCompanyProfile();
  return brandLogoSrcFromProfile(company);
}

/** Static fallback when CMS logo is not set. */
export const FALLBACK_BRAND_ICON = "/icons/icon-192x192.png";
