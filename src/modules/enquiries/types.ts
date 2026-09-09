export const ENQUIRY_STATUSES = ["new", "read", "archived"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_SOURCES = ["contact", "product", "header"] as const;
export type EnquirySource = (typeof ENQUIRY_SOURCES)[number];

export type EnquiryDTO = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  productInterest: string;
  productSlug: string | null;
  alloy: string;
  temper: string;
  monthlyTonnage: string;
  destination: string;
  message: string;
  locale: string;
  source: EnquirySource;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
};
