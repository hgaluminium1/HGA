"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  ArrowRightLeft,
  BookOpen,
  Boxes,
  Building2,
  FileText,
  FolderTree,
  ImageIcon,
  LogOut,
  Menu,
  PanelTop,
  Trash2,
  Upload,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof FileText;
  hint?: string;
};

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Website",
    items: [
      {
        href: "/admin/pages",
        label: "Pages",
        icon: FileText,
        hint: "Fixed templates — edit section content only",
      },
    ],
  },
  {
    title: "Chrome",
    items: [
      {
        href: "/admin/navigation",
        label: "Header & footer",
        icon: PanelTop,
        hint: "Primary nav and footer columns",
      },
    ],
  },
  {
    title: "Catalogue",
    items: [
      {
        href: "/admin/categories",
        label: "Categories",
        icon: FolderTree,
        hint: "Category → N products",
      },
      {
        href: "/admin/products",
        label: "Products",
        icon: Boxes,
        hint: "Present lines need a photo to publish",
      },
      { href: "/admin/dictionaries", label: "Dictionaries", icon: BookOpen },
    ],
  },
  {
    title: "Company",
    items: [
      {
        href: "/admin/settings/company",
        label: "Company profile",
        icon: Building2,
        hint: "Addresses, map locations, contact",
      },
      {
        href: "/admin/corporate/people",
        label: "People / Chairmen",
        icon: Users,
        hint: "Photos & messages for Chairman’s page",
      },
      {
        href: "/admin/corporate/capacity-metrics",
        label: "Capacity",
        icon: Boxes,
      },
      {
        href: "/admin/corporate/certifications",
        label: "Certifications",
        icon: FileText,
      },
      {
        href: "/admin/corporate/sustainability",
        label: "Sustainability",
        icon: Building2,
      },
      {
        href: "/admin/corporate/customer-logos",
        label: "Customer logos",
        icon: ImageIcon,
      },
      {
        href: "/admin/corporate/case-studies",
        label: "Case studies",
        icon: FileText,
      },
      {
        href: "/admin/corporate/testimonials",
        label: "Testimonials",
        icon: Users,
      },
      {
        href: "/admin/corporate/expansion",
        label: "Expansion",
        icon: Building2,
      },
    ],
  },
  {
    title: "Media",
    items: [
      {
        href: "/admin/media",
        label: "Media library",
        icon: ImageIcon,
        hint: "Upload photos for heroes, products, people",
      },
    ],
  },
  {
    title: "Tools",
    items: [
      { href: "/admin/import", label: "CSV import", icon: Upload },
      { href: "/admin/redirects", label: "Redirects", icon: ArrowRightLeft },
      { href: "/admin/trash", label: "Trash", icon: Trash2 },
    ],
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="space-y-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="text-muted-foreground mb-2 px-2 text-[0.7rem] font-semibold tracking-wide uppercase">
            {group.title}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex min-h-11 items-start gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-brand/10 text-brand font-semibold"
                        : "text-ink hover:bg-muted",
                    )}
                  >
                    <Icon className="mt-0.5 size-4 shrink-0" />
                    <span className="min-w-0">
                      <span className="block leading-tight">{item.label}</span>
                      {item.hint ? (
                        <span className="text-muted-foreground mt-0.5 block text-[0.7rem] font-normal leading-snug">
                          {item.hint}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function ResponsiveAdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-bg min-h-svh">
      <header className="border-line bg-surface sticky top-0 z-40 flex h-14 items-center gap-3 border-b px-4 min-[900px]:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="hover:bg-muted inline-flex size-10 items-center justify-center rounded-full"
            aria-label="Open admin menu"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(20rem,92vw)] p-0">
            <SheetHeader className="border-line border-b px-4 py-3">
              <SheetTitle>Admin</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto p-3 pb-8">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <p className="font-display font-semibold">HG Admin</p>
      </header>

      <div className="min-[900px]:grid min-[900px]:grid-cols-[15.5rem_1fr]">
        <aside className="border-line bg-surface sticky top-0 hidden h-svh flex-col border-r min-[900px]:flex">
          <div className="border-line border-b px-4 py-4">
            <p className="font-display text-lg font-semibold text-ink">
              HG Admin
            </p>
            <p className="text-muted-foreground mt-1 text-xs leading-snug">
              Site → Page → Section → Field. No JSON.
            </p>
          </div>
          <nav className="flex-1 overflow-y-auto p-3">
            <NavLinks />
          </nav>
          <div className="border-line space-y-2 border-t p-3">
            <p className="text-muted-foreground truncate px-1 text-xs">
              {userEmail}
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full min-h-10"
              onClick={() => void signOut({ callbackUrl: "/admin/login" })}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </aside>
        <main className="min-w-0 p-4 min-[640px]:p-6 min-[900px]:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
