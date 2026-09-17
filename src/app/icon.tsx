import { serveBrandIconResponse } from "@/features/public-site/lib/serve-brand-icon";

/** Favicon — same CMS logo as header / footer. */
export const dynamic = "force-dynamic";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  return serveBrandIconResponse();
}
