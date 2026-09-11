import type { PublicSocialLink } from "@/features/public-site/lib/resolve-public-nav";

type OrganizationJsonLdProps = {
  name: string;
  /** Absolute or site-relative path; absolute preferred for schema.org. */
  url?: string;
  socialLinks: PublicSocialLink[];
};

function absoluteUrl(pathOrUrl?: string): string | undefined {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!base) return pathOrUrl;
  return `${base}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** Minimal Organization structured data with sameAs for social profiles. */
export function OrganizationJsonLd({
  name,
  url,
  socialLinks,
}: OrganizationJsonLdProps) {
  const sameAs = socialLinks.map((l) => l.url.trim()).filter(Boolean);
  if (!sameAs.length) return null;

  const resolvedUrl = absoluteUrl(url);
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    ...(resolvedUrl ? { url: resolvedUrl } : {}),
    sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
