import { z } from "zod";

import {
  ENQUIRY_SOURCES,
  ENQUIRY_STATUSES,
} from "@/modules/enquiries/types";

export const createEnquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(160).optional().default(""),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  productInterest: z.string().trim().max(200).optional().default(""),
  productSlug: z.string().trim().max(120).nullable().optional().default(null),
  alloy: z.string().trim().max(80).optional().default(""),
  temper: z.string().trim().max(40).optional().default(""),
  monthlyTonnage: z.string().trim().max(40).optional().default(""),
  destination: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(1).max(4000),
  locale: z.string().trim().max(10).optional().default("en"),
  source: z.enum(ENQUIRY_SOURCES).optional().default("contact"),
  /** Honeypot — bots fill this; humans never see it. */
  website: z.string().max(200).optional().default(""),
});

export const updateEnquirySchema = z.object({
  status: z.enum(ENQUIRY_STATUSES),
});
