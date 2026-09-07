import { unstable_cache } from "next/cache";

import {
  getCompanyProfile,
  listPublishedCapacityMetrics,
  listPublishedCaseStudies,
  listPublishedCertifications,
  listPublishedCustomerLogos,
  listPublishedPeople,
  listPublishedSustainabilityMetrics,
  listPublishedTestimonials,
  listPublishedExpansionProjects,
} from "@/modules/corporate";

const cacheDisabled =
  process.env.DISABLE_CMS_CACHE === "1" ||
  process.env.NODE_ENV === "development";

export function getCachedCompanyProfile() {
  if (cacheDisabled) return getCompanyProfile();
  return unstable_cache(() => getCompanyProfile(), ["company-profile"], {
    tags: ["corporate"],
    revalidate: 60,
  })();
}

export function getCachedPublishedPeople() {
  if (cacheDisabled) return listPublishedPeople();
  return unstable_cache(() => listPublishedPeople(), ["published-people"], {
    tags: ["corporate"],
    revalidate: 60,
  })();
}

export function getCachedPublishedCapacity() {
  if (cacheDisabled) return listPublishedCapacityMetrics();
  return unstable_cache(
    () => listPublishedCapacityMetrics(),
    ["published-capacity"],
    { tags: ["capacity", "corporate"], revalidate: 60 },
  )();
}

export function getCachedPublishedCertifications() {
  if (cacheDisabled) return listPublishedCertifications();
  return unstable_cache(
    () => listPublishedCertifications(),
    ["published-certs"],
    { tags: ["corporate"], revalidate: 60 },
  )();
}

export function getCachedPublishedSustainability() {
  if (cacheDisabled) return listPublishedSustainabilityMetrics();
  return unstable_cache(
    () => listPublishedSustainabilityMetrics(),
    ["published-sustain"],
    { tags: ["corporate"], revalidate: 60 },
  )();
}

export function getCachedPublishedLogos() {
  if (cacheDisabled) return listPublishedCustomerLogos();
  return unstable_cache(
    () => listPublishedCustomerLogos(),
    ["published-logos"],
    { tags: ["corporate"], revalidate: 60 },
  )();
}

export function getCachedPublishedCaseStudies() {
  if (cacheDisabled) return listPublishedCaseStudies();
  return unstable_cache(
    () => listPublishedCaseStudies(),
    ["published-cases"],
    { tags: ["corporate"], revalidate: 60 },
  )();
}

export function getCachedPublishedTestimonials() {
  if (cacheDisabled) return listPublishedTestimonials();
  return unstable_cache(
    () => listPublishedTestimonials(),
    ["published-testimonials"],
    { tags: ["corporate"], revalidate: 60 },
  )();
}

export function getCachedPublishedExpansion() {
  if (cacheDisabled) return listPublishedExpansionProjects();
  return unstable_cache(
    () => listPublishedExpansionProjects(),
    ["published-expansion"],
    { tags: ["corporate"], revalidate: 60 },
  )();
}
