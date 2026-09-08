import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { buttonVariants } from "@/components/ui/button";
import { localePath } from "@/config/nav.config";
import { cn } from "@/lib/utils";

export type EmptyAction = {
  label: string;
  href: string;
  variant?: "default" | "outline";
};

type PublicEmptyStateProps = {
  locale: string;
  /** Short title with period — Stripe style: “No capacity metrics yet.” */
  title: string;
  /** One line: when / how content appears. */
  description: string;
  /** Single primary action preferred. */
  primary?: EmptyAction;
  secondary?: EmptyAction;
  /**
   * page = full section with container (after hero)
   * section = compact band inside an existing layout
   */
  density?: "page" | "section";
  className?: string;
};

/**
 * FAANG empty state — Linear / Stripe rules:
 * context + one-line guidance + one primary action. No illustration clutter.
 */
export function PublicEmptyState({
  locale,
  title,
  description,
  primary,
  secondary,
  density = "page",
  className,
}: PublicEmptyStateProps) {
  const primaryAction = primary ?? {
    label: "Contact / RFQ",
    href: "contact",
    variant: "default" as const,
  };
  const secondaryAction = secondary ?? {
    label: "Back to Home",
    href: "",
    variant: "outline" as const,
  };

  const body = (
    <div
      className={cn(
        density === "section" &&
          "border-line rounded-[var(--radius-md)] border border-dashed bg-bg-alt/40 px-5 py-8 text-center",
        className,
      )}
    >
      <h2
        className={cn(
          "font-display font-semibold text-ink text-balance",
          density === "page" ? "text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)]" : "text-[1.05rem]",
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "text-muted-foreground mx-auto mt-2 max-w-[36rem] leading-relaxed",
          density === "page" ? "text-[0.9875rem]" : "text-[0.875rem]",
        )}
      >
        {description}
      </p>
      <div
        className={cn(
          "mt-6 flex flex-wrap gap-3",
          density === "section" && "justify-center",
        )}
      >
        <Link
          href={localePath(locale, primaryAction.href)}
          className={cn(
            buttonVariants({
              variant: primaryAction.variant ?? "default",
            }),
            "min-h-10",
          )}
        >
          {primaryAction.label}
        </Link>
        <Link
          href={localePath(locale, secondaryAction.href)}
          className={cn(
            buttonVariants({
              variant: secondaryAction.variant ?? "outline",
            }),
            "min-h-10",
          )}
        >
          {secondaryAction.label}
        </Link>
      </div>
    </div>
  );

  if (density === "section") {
    return body;
  }

  return (
    <Section>
      <Container>{body}</Container>
    </Section>
  );
}

/** @deprecated Use PublicEmptyState — kept for existing imports. */
export function CmsEmptyState({
  locale,
  title = "This page isn’t published yet.",
}: {
  locale: string;
  title?: string;
}) {
  return (
    <PublicEmptyState
      locale={locale}
      title={title.endsWith(".") ? title : `${title}.`}
      description="Content appears here once an editor publishes it in Admin."
      primary={{ label: "Contact / RFQ", href: "contact" }}
      secondary={{ label: "Back to Home", href: "", variant: "outline" }}
    />
  );
}
