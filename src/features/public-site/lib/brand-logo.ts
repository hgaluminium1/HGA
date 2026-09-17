import { getCachedCompanyProfile } from "@/features/public-corporate/lib/public-cache";
import {
  brandLogoSrcFromProfile,
  FALLBACK_BRAND_ICON,
} from "@/lib/brand";

export { brandLogoSrcFromProfile, FALLBACK_BRAND_ICON };

/** Server-only: resolve CMS logo URL (png → svg). */
export async function resolveBrandLogoSrc(): Promise<string | null> {
  const company = await getCachedCompanyProfile();
  return brandLogoSrcFromProfile(company);
}
