/**
 * Single source of truth for locales (§12).
 * Add a language = append here + messages/<locale>/ folder.
 */
export const routing = {
  locales: ["en"] as const,
  defaultLocale: "en" as const,
};

export type AppLocale = (typeof routing.locales)[number];
