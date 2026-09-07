"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
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

const NAV = [
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/dictionaries", label: "Dictionaries", icon: BookOpen },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings/company", label: "Company", icon: Building2 },
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
  { href: "/admin/import", label: "CSV import", icon: Upload },
  { href: "/admin/redirects", label: "Redirects", icon: ArrowRightLeft },
  { href: "/admin/trash", label: "Trash", icon: Trash2 },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-[var(--admin-touch-min)] items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-medium",
              active
                ? "bg-brand/10 text-brand"
                : "text-ink hover:bg-surface-muted",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function ResponsiveAdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-surface-muted min-h-screen">
      <header className="border-line bg-surface sticky top-0 z-40 flex min-h-14 items-center gap-3 border-b px-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button type="button" variant="outline" size="icon" className="min-h-11 min-w-11">
                <Menu className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            }
          />
          <SheetContent side="left" className="w-[280px]">
            <SheetHeader>
              <SheetTitle>Admin</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <p className="font-display font-semibold">HG Admin</p>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 p-4 md:p-6">
        <aside className="border-line bg-surface hidden w-56 shrink-0 rounded-[var(--radius-lg)] border p-3 md:block">
          <p className="font-display mb-3 px-3 text-lg font-semibold">
            HG Admin
          </p>
          <NavLinks />
          <div className="border-line mt-6 border-t pt-3">
            <p className="text-muted-foreground truncate px-3 text-xs">
              {data?.user?.email}
            </p>
            <Button
              type="button"
              variant="ghost"
              className="mt-1 w-full justify-start"
              onClick={() => void signOut({ callbackUrl: "/admin/login" })}
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </Button>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
