import { z } from "zod";

export const CAREER_DEPARTMENTS = [
  "operations",
  "quality",
  "maintenance",
  "commercial",
  "engineering",
  "hr",
  "other",
] as const;

export const CAREER_EMPLOYMENT_TYPES = [
  "full_time",
  "contract",
  "internship",
] as const;

export const careerStatusSchema = z.enum(["draft", "published"]);

export const createOpeningSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug: z.string().trim().min(1).max(120),
  department: z.enum(CAREER_DEPARTMENTS),
  location: z.string().trim().min(1).max(120),
  employmentType: z.enum(CAREER_EMPLOYMENT_TYPES).default("full_time"),
  summary: z.string().trim().max(400).default(""),
  description: z.string().trim().max(8000).default(""),
  applyEmail: z.union([z.string().email(), z.literal("")]).optional(),
  sortOrder: z.number().int().optional(),
  status: careerStatusSchema.optional(),
});

export const updateOpeningSchema = createOpeningSchema.partial().extend({
  version: z.number().int(),
});

export type CareerDepartment = (typeof CAREER_DEPARTMENTS)[number];
export type CareerEmploymentType = (typeof CAREER_EMPLOYMENT_TYPES)[number];
