export type {
  Address,
  CapacityMetricDTO,
  CaseStudyDTO,
  CertificationDTO,
  CompanyLocationDTO,
  CompanyProfileDTO,
  CustomerLogoDTO,
  ExpansionProjectDTO,
  LocalizedString,
  PersonDTO,
  SocialLinkDTO,
  SocialPlatform,
  SustainabilityMetricDTO,
  TestimonialDTO,
} from "./types";

export const PERSON_ROLES = [
  "director",
  "chairman",
  "md",
  "company_secretary",
  "executive",
] as const;

export type PersonRole = (typeof PERSON_ROLES)[number];

export const CAPACITY_CATEGORIES = [
  "extrusion",
  "billet",
  "ingot",
  "melting",
  "press",
  "dimension",
  "commercial",
] as const;

export type CapacityCategory = (typeof CAPACITY_CATEGORIES)[number];

export const CERTIFICATION_TYPES = [
  "iso",
  "quality_policy",
  "test_certificate_template",
  "other",
] as const;

export type CertificationType = (typeof CERTIFICATION_TYPES)[number];

export const DISCLOSURE_TIERS = [
  "verified_metric",
  "initiative",
  "commitment",
] as const;

export type DisclosureTier = (typeof DISCLOSURE_TIERS)[number];

export const EXPANSION_STATUSES = [
  "confirmed",
  "proposed",
  "planned",
] as const;

export type ExpansionStatus = (typeof EXPANSION_STATUSES)[number];
