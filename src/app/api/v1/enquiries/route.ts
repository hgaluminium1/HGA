import { authorize } from "@/modules/identity";
import { notifyEnquiryEmails } from "@/lib/email/enquiry-notify";
import {
  checkEnquiryRateLimit,
  clientIpFromRequest,
} from "@/lib/http/enquiry-rate-limit";
import { respondError, respondSuccess } from "@/lib/http/respond";
import { getCompanyProfile } from "@/modules/corporate";
import {
  createEnquiry,
  createEnquirySchema,
  listEnquiries,
  type EnquiryStatus,
} from "@/modules/enquiries";

export async function GET(req: Request) {
  const authz = await authorize("leads.read");
  if ("error" in authz) return authz.error;

  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");
  const status: EnquiryStatus | "all" =
    statusParam === "new" ||
    statusParam === "read" ||
    statusParam === "archived" ||
    statusParam === "all"
      ? statusParam
      : "all";

  try {
    const data = await listEnquiries({
      q: url.searchParams.get("q") ?? undefined,
      status,
    });
    return respondSuccess(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list";
    return respondError("INTERNAL", message, 500);
  }
}

export async function POST(req: Request) {
  try {
    const ip = clientIpFromRequest(req);
    const limited = await checkEnquiryRateLimit(ip);
    if (!limited.ok) {
      return respondError(
        "RATE_LIMITED",
        "Too many enquiries. Please try again later.",
        429,
      );
    }

    const body = await req.json();
    const parsed = createEnquirySchema.parse(body);

    // Honeypot: pretend success, do not persist or email.
    if (parsed.website?.trim()) {
      return respondSuccess({ id: "ok" }, { status: 201 });
    }

    const lead = await createEnquiry(parsed);

    let salesTo: string | null = null;
    try {
      const company = await getCompanyProfile();
      salesTo =
        company?.emails.sales?.trim() ||
        company?.emails.export?.trim() ||
        process.env.ADMIN_EMAIL?.trim() ||
        null;
    } catch {
      salesTo = process.env.ADMIN_EMAIL?.trim() || null;
    }

    const mail = await notifyEnquiryEmails({ lead, salesTo });
    if (mail.errors.length && process.env.NODE_ENV !== "production") {
      console.warn("[enquiry email]", mail.errors.join("; "));
    }

    return respondSuccess(
      {
        id: lead.id,
        email: {
          salesSent: mail.salesSent,
          buyerSent: mail.buyerSent,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid enquiry";
    if (message.includes("Database unavailable")) {
      return respondError("SERVICE_UNAVAILABLE", message, 503);
    }
    return respondError("VALIDATION_ERROR", message, 400);
  }
}
