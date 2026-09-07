/**
 * Site-wide flags and metadata.
 * Free-tier account values live in env; this file is code/config only.
 */
export const siteConfig = {
  name: "HG Aluminium Smelters",
  shortName: "HG Aluminium",
  flags: {
    analytics: false,
    leadsCrmWebhook: false,
    investorsSection: false,
    /** Lazy Three.js Home hero — off by default (Core Web Vitals). */
    heroThree: false,
  },
} as const;
