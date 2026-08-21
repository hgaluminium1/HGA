import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/components/atoms/container";
import { BrandLockup } from "@/components/molecules/brand-lockup";
import {
  footerContact,
  footerQuickLinks,
  localePath,
} from "@/config/nav.config";

type SiteFooterProps = {
  locale: string;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="bg-ink text-on-dark">
      <Container className="grid gap-10 py-[var(--section-pad)] max-[640px]:grid-cols-1 min-[640px]:grid-cols-2 min-[980px]:grid-cols-4">
        <div className="space-y-4">
          <BrandLockup href={localePath(locale)} inverted />
          <p className="text-on-dark-muted text-sm leading-relaxed">
            India&apos;s largest producer of aluminium and zinc die-casting
            alloys, with a combined annual capacity of over 620,000 MT.
          </p>
        </div>

        <div>
          <h5 className="font-display mb-4 text-sm font-semibold tracking-wide uppercase">
            Quick Links
          </h5>
          <ul className="space-y-2">
            {footerQuickLinks.map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={localePath(locale, link.href)}
                  className="text-on-dark-muted hover:text-gold text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-display mb-4 text-sm font-semibold tracking-wide uppercase">
            Contact Us
          </h5>
          <ul className="text-on-dark-muted space-y-3 text-sm">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>{footerContact.address}</span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
              <a
                href={`mailto:${footerContact.email}`}
                className="hover:text-gold"
              >
                {footerContact.email}
              </a>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
              <a
                href={`tel:${footerContact.phone.replace(/\s/g, "")}`}
                className="hover:text-gold"
              >
                {footerContact.phone}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-display mb-4 text-sm font-semibold tracking-wide uppercase">
            Find Us
          </h5>
          <div className="relative flex h-40 items-end overflow-hidden rounded-[var(--radius-md)] bg-violet-900 p-3">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(255 255 255 / 25%) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 25%) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <MapPin className="absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 text-gold" />
            <a
              href={footerContact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm hover:bg-white/25"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10 py-4 text-center text-xs text-on-dark-muted">
        Copyright © {year} HG Aluminium Smelters Ltd.
      </div>
    </footer>
  );
}
