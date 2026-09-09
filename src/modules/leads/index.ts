// Leads = persisted RFQ / contact enquiries (Phase 7).
export type { EnquiryDTO as LeadDTO } from "@/modules/enquiries";
export {
  ENQUIRY_SOURCES,
  ENQUIRY_STATUSES,
  createEnquiry,
  createEnquirySchema,
  listEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  updateEnquirySchema,
  countNewEnquiries,
} from "@/modules/enquiries";
