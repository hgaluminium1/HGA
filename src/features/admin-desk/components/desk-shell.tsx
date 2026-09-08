"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DESK_FOOTER_ID } from "@/features/admin-desk/components/desk-footer-portal";
import { getPageTemplate } from "@/modules/cms/browser";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Website",
    items: [{ href: "/admin/pages", label: "Pages", match: "/admin/pages" }],
  },
  {
    label: "Catalogue",
    items: [
      {
        href: "/admin/catalogue/products",
        label: "Products",
        match: "/admin/catalogue/products",
      },
      {
        href: "/admin/catalogue/categories",
        label: "Categories",
        match: "/admin/catalogue/categories",
      },
    ],
  },
] as const;

function parsePageRoute(pathname: string): {
  slug: string | null;
  sectionId: string | null;
} {
  const m = pathname.match(/^\/admin\/pages\/([^/]+)(?:\/([^/]+))?/);
  if (!m) return { slug: null, sectionId: null };
  return { slug: m[1] ?? null, sectionId: m[2] ?? null };
}

export function DeskShell({
  userEmail,
  children,
}: {
  userEmail: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const { slug: activeSlug, sectionId: activeSection } = useMemo(
    () => parsePageRoute(pathname),
    [pathname],
  );
  const activeTemplate = activeSlug ? getPageTemplate(activeSlug) : undefined;

  function isActive(match: string) {
    return pathname === match || pathname.startsWith(`${match}/`);
  }

  const nav = (
    <div className="flex flex-col gap-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="text-muted-foreground mb-1.5 px-2.5 text-[0.625rem] font-bold tracking-[0.14em] uppercase">
            {group.label}
          </p>
          <nav className="flex flex-col gap-0.5" aria-label={group.label}>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "min-h-9 rounded-md px-2.5 py-2 text-[0.8125rem] font-semibold transition-colors",
                  isActive(item.match)
                    ? "bg-ink text-white"
                    : "text-ink hover:bg-black/5",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ))}

      {activeTemplate?.mode === "sections" && activeTemplate.sections.length ? (
        <div>
          <p className="text-muted-foreground mb-1.5 flex items-center gap-1 px-2.5 text-[0.625rem] font-bold tracking-[0.14em] uppercase">
            {activeTemplate.label}
            <ChevronRight className="size-3 opacity-50" aria-hidden />
            Sections
          </p>
          <nav
            className="flex flex-col gap-0.5"
            aria-label={`${activeTemplate.label} sections`}
          >
            {activeTemplate.sections.map((section) => {
              const href = `/admin/pages/${activeTemplate.slug}/${section.id}`;
              const active = activeSection === section.id;
              return (
                <Link
                  key={section.id}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "min-h-9 rounded-md px-2.5 py-1.5 text-[0.8125rem] transition-colors",
                    active
                      ? "bg-brand-red/10 font-semibold text-brand-red"
                      : "text-ink/80 hover:bg-black/5",
                  )}
                >
                  {section.title}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="bg-bg text-ink fixed inset-0 flex flex-col overflow-hidden">
      <header className="border-line bg-surface z-40 flex h-12 shrink-0 items-center justify-between gap-2 border-b px-3 min-[900px]:hidden">
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md border border-line"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
        <p className="font-display text-sm font-semibold">HG Desk</p>
        <Button
          type="button"
          variant="ghost"
          className="h-9 px-2 text-xs"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          Sign out
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "border-line bg-surface fixed inset-y-0 left-0 z-50 flex w-[min(16.5rem,88vw)] flex-col border-r transition-transform min-[900px]:static min-[900px]:z-0 min-[900px]:w-56 min-[900px]:shrink-0 min-[900px]:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="hidden shrink-0 border-b border-line px-3 py-3 min-[900px]:block">
            <p className="font-display text-[0.9375rem] font-semibold tracking-tight">
              HG Desk
            </p>
            <p className="text-muted-foreground mt-0.5 truncate text-[0.6875rem]">
              {userEmail ?? "Signed in"}
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">{nav}</div>

          <div className="hidden shrink-0 border-t border-line p-2.5 min-[900px]:block">
            <Button
              type="button"
              variant="outline"
              className="h-9 w-full text-[0.8125rem]"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              Sign out
            </Button>
          </div>
        </aside>

        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 min-[900px]:hidden"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 min-[640px]:px-5 min-[640px]:py-4">
            {children}
          </div>
          {/* Empty until DeskSaveBar portals in — full width of main column */}
          <div
            id={DESK_FOOTER_ID}
            className="border-line bg-surface empty:hidden shrink-0 border-t"
          />
        </div>
      </div>
    </div>
  );
}
