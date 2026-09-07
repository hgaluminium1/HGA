import Link from "next/link";

import { localePath } from "@/config/nav.config";
import { cn } from "@/lib/utils";

export type Crumb = {
  label: string;
  href?: string;
};

type CatalogueBreadcrumbsProps = {
  locale: string;
  items: Crumb[];
  className?: string;
  tone?: "light" | "dark";
};

export function CatalogueBreadcrumbs({
  locale,
  items,
  className,
  tone = "light",
}: CatalogueBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("text-[0.8rem]", className)}
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {i > 0 ? (
                <span
                  className={
                    tone === "dark" ? "text-white/35" : "text-text-faint"
                  }
                  aria-hidden
                >
                  /
                </span>
              ) : null}
              {item.href && !last ? (
                <Link
                  href={localePath(locale, item.href)}
                  className={
                    tone === "dark"
                      ? "text-white/70 hover:text-white"
                      : "text-muted-foreground hover:text-brand-blue"
                  }
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    tone === "dark"
                      ? "font-medium text-white"
                      : "font-medium text-ink"
                  }
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
