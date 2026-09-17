import { serveBrandIconResponse } from "@/features/public-site/lib/serve-brand-icon";

/** Apple touch icon — same CMS / packaged logo as header & footer. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return serveBrandIconResponse(180);
}
