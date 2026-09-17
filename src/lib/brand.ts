/**
 * Brand asset constants — safe for components + features (no DB).
 */

/** Packaged mark when CMS logo is empty (header / footer / favicon fallback). */
export const FALLBACK_BRAND_ICON = "/HGLogo.jpeg";

/**
 * Same resolution as header / footer BrandLockup:
 * company PNG → company SVG → null (caller applies fallback).
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
