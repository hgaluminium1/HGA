import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SocialLinkDTO, SocialPlatform } from "@/modules/corporate/types";

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  x: "X",
  whatsapp: "WhatsApp",
  other: "Website",
};

function PlatformIcon({
  platform,
  className,
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  const common = cn("size-4", className);
  switch (platform) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden fill="currentColor">
          <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H17V3.6C16.6 3.5 15.6 3.4 14.4 3.4c-2.4 0-4 1.5-4 4.2v2.3H7.7V13h2.7v8z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden fill="currentColor">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9.5 9H13v1.7h.05c.5-.95 1.7-1.95 3.5-1.95 3.75 0 4.45 2.5 4.45 5.7V21h-4v-5.9c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-4z" />
        </svg>
      );
    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          className={common}
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden fill="currentColor">
          <path d="M18.9 3H21l-6.7 7.7L22 21h-6.4l-4.6-6-5.3 6H3l7.2-8.2L2 3h6.6l4.2 5.6zM17.8 19h1.4L6.3 4.9H4.8z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden fill="currentColor">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden fill="currentColor">
          <path d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.5-1-.9-1.5-2-1.7-2.3-.2-.3 0-.4.1-.5.1-.1.3-.3.4-.4.1-.1.2-.3.3-.4.1-.2.1-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.5 1.5.6 1.9.7 2.6.6.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1-.1-.1-.2-.1-.5-.2zM12 2a10 10 0 0 0-8.7 15l-1.1 4 4.1-1.1A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-2.5.7.7-2.4-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
        </svg>
      );
    default:
      return <ExternalLink className={common} aria-hidden />;
  }
}

export type SocialLinksProps = {
  links: Pick<SocialLinkDTO, "id" | "platform" | "url" | "label">[];
  variant?: "onDark" | "onLight";
  className?: string;
  /** Accessible name for the list (e.g. "Social media"). */
  label?: string;
};

export function SocialLinks({
  links,
  variant = "onDark",
  className,
  label = "Social media",
}: SocialLinksProps) {
  const visible = links.filter((l) => l.url?.trim());
  if (!visible.length) return null;

  return (
    <ul
      className={cn("flex flex-wrap gap-2.5", className)}
      aria-label={label}
    >
      {visible.map((link) => {
        const name =
          link.platform === "other" && link.label?.trim()
            ? link.label.trim()
            : PLATFORM_LABELS[link.platform];
        return (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className={cn(
                "inline-flex size-[38px] items-center justify-center rounded-full transition-colors",
                variant === "onDark"
                  ? "bg-white/10 text-white hover:bg-white/24"
                  : "bg-bg-alt text-ink hover:bg-line/80",
              )}
            >
              <PlatformIcon platform={link.platform} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
