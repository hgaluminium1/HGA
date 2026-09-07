import { respondError, respondSuccess } from "@/lib/http/respond";
import { createEnquiry, createEnquirySchema } from "@/modules/enquiries";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createEnquirySchema.parse(body);
    const result = await createEnquiry(parsed);
    return respondSuccess(result, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid enquiry";
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
