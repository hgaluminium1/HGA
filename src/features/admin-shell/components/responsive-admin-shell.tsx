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
  Navigation,
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
        hint: "Edit Home & marketing with forms — no JSON",
      },
      {
        href: "/admin/navigation",
        label: "Navigation",
        icon: Navigation,
        hint: "Header & footer links",
      },
      { href: "/admin/media", label: "Media", icon: ImageIcon, hint: "R2 uploads" },
    ],
  },
  {
    title: "Catalogue",
    items: [
      {
        href: "/admin/products",
        label: "Products",
        icon: Boxes,
        hint: "Present lines need a photo to publish",
      },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/dictionaries", label: "Dictionaries", icon: BookOpen },
    ],
  },
  {
    title: "Company",
    items: [
      { href: "/admin/settings/company", label: "Company profile", icon: Building2 },
      { href: "/admin/corporate/people", label: "People", icon: Users },
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
          <p className="text-muted-foreground px-3 pb-1 text-[0.65rem] font-bold tracking-[0.12em] uppercase">
            {group.title}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    title={item.hint}
                    className={cn(
                      "flex min-h-10 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-brand-blue-light text-brand-blue"
                        : "text-ink hover:bg-bg-alt",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
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
              Edit catalogue & website content — forms only, no JSON.
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
