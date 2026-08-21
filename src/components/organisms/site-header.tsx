"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Menu,
  Search,
  Droplets,
  Cylinder,
  Recycle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { BrandLockup } from "@/components/molecules/brand-lockup";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/atoms/container";
import {
  companyNav,
  localePath,
  primaryNavLinks,
  productNav,
} from "@/config/nav.config";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  locale: string;
};

function MegaIcon({ name }: { name?: string }) {
  if (name === "drop") return <Droplets className="size-5" />;
  if (name === "billet") return <Cylinder className="size-5" />;
  if (name === "recycle") return <Recycle className="size-5" />;
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="9" width="18" height="9" rx="1.5" />
      <path d="M6 9l2-4h8l2 4" />
    </svg>
  );
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<"products" | "company" | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const home = localePath(locale);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-line bg-surface transition-[box-shadow,padding]",
          scrolled && "shadow-brand-md",
        )}
      >
        <Container
          className={cn(
            "flex items-center justify-between gap-4 transition-[padding]",
            scrolled ? "py-2.5" : "py-4",
          )}
        >
          <BrandLockup href={home} />

          <nav
            className="hidden items-center gap-0.5 min-[68.75rem]:flex"
            aria-label="Primary navigation"
          >
            <div
              className="relative"
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3.5 py-2.5 text-[0.92rem] font-semibold transition-colors",
                  openMenu === "products"
                    ? "bg-bg-alt text-brand-accent"
                    : "hover:bg-bg-alt hover:text-brand-accent",
                )}
                aria-expanded={openMenu === "products"}
                onClick={() =>
                  setOpenMenu(openMenu === "products" ? null : "products")
                }
                onMouseEnter={() => setOpenMenu("products")}
              >
                {productNav.label}
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform",
                    openMenu === "products" && "rotate-180",
                  )}
                />
              </button>
              {openMenu === "products" ? (
                <div
                  className="absolute top-full left-0 z-50 mt-2 grid w-[min(720px,90vw)] grid-cols-[1.2fr_0.8fr] gap-3 rounded-[var(--radius-lg)] border border-line bg-surface p-4 shadow-brand-lg"
                  role="menu"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {productNav.items.map((item) => (
                      <Link
                        key={item.label}
                        href={localePath(locale, item.href)}
                        className="hover:bg-bg-alt flex gap-3 rounded-[var(--radius-md)] p-3 transition-colors"
                        role="menuitem"
                        onClick={() => setOpenMenu(null)}
                      >
                        <span className="bg-brand-accent-light text-brand-accent flex size-10 shrink-0 items-center justify-center rounded-xl">
                          <MegaIcon name={item.icon} />
                        </span>
                        <span>
                          <strong className="block text-sm">{item.label}</strong>
                          <small className="text-muted-foreground text-xs">
                            {item.description}
                          </small>
                        </span>
                      </Link>
                    ))}
                  </div>
                  {productNav.feature ? (
                    <Link
                      href={localePath(locale, productNav.feature.href)}
                      className="relative min-h-48 overflow-hidden rounded-[var(--radius-md)]"
                      onClick={() => setOpenMenu(null)}
                    >
                      <Image
                        src={productNav.feature.imageSrc}
                        alt={productNav.feature.imageAlt}
                        fill
                        className="object-cover"
                        sizes="280px"
                      />
                      <span className="absolute inset-0 bg-linear-to-t from-ink/90 to-transparent" />
                      <span className="absolute inset-x-0 bottom-0 p-4 text-on-dark">
                        <span className="text-xs font-bold tracking-wide uppercase text-gold">
                          {productNav.feature.eyebrow}
                        </span>
                        <strong className="mt-1 block text-sm">
                          {productNav.feature.title}
                        </strong>
                      </span>
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>

            <Link
              href={localePath(locale, "industries")}
              className="hover:bg-bg-alt hover:text-brand-accent rounded-full px-3.5 py-2.5 text-[0.92rem] font-semibold transition-colors"
            >
              Industries
            </Link>

            <div
              className="relative"
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3.5 py-2.5 text-[0.92rem] font-semibold transition-colors",
                  openMenu === "company"
                    ? "bg-bg-alt text-brand-accent"
                    : "hover:bg-bg-alt hover:text-brand-accent",
                )}
                aria-expanded={openMenu === "company"}
                onClick={() =>
                  setOpenMenu(openMenu === "company" ? null : "company")
                }
                onMouseEnter={() => setOpenMenu("company")}
              >
                {companyNav.label}
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform",
                    openMenu === "company" && "rotate-180",
                  )}
                />
              </button>
              {openMenu === "company" ? (
                <div
                  className="absolute top-full left-0 z-50 mt-2 min-w-52 rounded-[var(--radius-md)] border border-line bg-surface p-2 shadow-brand-md"
                  role="menu"
                >
                  {companyNav.items.map((item) => (
                    <Link
                      key={item.href + item.label}
                      href={localePath(locale, item.href)}
                      className="hover:bg-bg-alt block rounded-lg px-3 py-2 text-sm font-medium"
                      role="menuitem"
                      onClick={() => setOpenMenu(null)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            {siteConfig.flags.investorsSection ? (
              <Link
                href={localePath(locale, "about")}
                className="hover:bg-bg-alt hover:text-brand-accent rounded-full px-3.5 py-2.5 text-[0.92rem] font-semibold"
              >
                Investor Relations
              </Link>
            ) : null}

            {primaryNavLinks
              .filter((l) => l.href === "contact")
              .map((link) => (
                <Link
                  key={link.href}
                  href={localePath(locale, link.href)}
                  className="hover:bg-bg-alt hover:text-brand-accent rounded-full px-3.5 py-2.5 text-[0.92rem] font-semibold"
                >
                  {link.label}
                </Link>
              ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Open search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-[19px]" />
            </Button>
            <Button
              className="hidden min-[560px]:inline-flex"
              render={<Link href={localePath(locale, "contact")} />}
            >
              Inquire Now
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="min-[68.75rem]:hidden"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </Container>
      </header>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-[min(380px,88vw)] p-0">
          <SheetHeader className="border-b border-line px-4 py-4">
            <SheetTitle className="font-display text-left">
              HG Aluminium
            </SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto px-2 py-3">
              <Accordion multiple className="w-full">
                <AccordionItem value="products">
                  <AccordionTrigger className="px-3">
                    Products
                  </AccordionTrigger>
                  <AccordionContent className="px-3">
                    <div className="flex flex-col gap-1">
                      {productNav.items.map((item) => (
                        <Link
                          key={item.label}
                          href={localePath(locale, item.href)}
                          className="hover:bg-bg-alt rounded-lg px-3 py-2 text-sm"
                          onClick={() => setDrawerOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="company">
                  <AccordionTrigger className="px-3">Company</AccordionTrigger>
                  <AccordionContent className="px-3">
                    <div className="flex flex-col gap-1">
                      {companyNav.items.map((item) => (
                        <Link
                          key={item.href + item.label}
                          href={localePath(locale, item.href)}
                          className="hover:bg-bg-alt rounded-lg px-3 py-2 text-sm"
                          onClick={() => setDrawerOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Link
                href={localePath(locale, "industries")}
                className="hover:bg-bg-alt mt-1 block rounded-lg px-5 py-3 text-sm font-semibold"
                onClick={() => setDrawerOpen(false)}
              >
                Industries
              </Link>
              <Link
                href={localePath(locale, "contact")}
                className="hover:bg-bg-alt block rounded-lg px-5 py-3 text-sm font-semibold"
                onClick={() => setDrawerOpen(false)}
              >
                Contact Us
              </Link>
            </div>
            <div className="border-t border-line p-4">
              <Button
                className="w-full"
                render={<Link href={localePath(locale, "contact")} />}
                onClick={() => setDrawerOpen(false)}
              >
                Inquire Now
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="top-[20%] max-w-xl translate-y-0 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex items-center gap-3 border-b border-line pb-3"
          >
            <Search className="text-muted-foreground size-5 shrink-0" />
            <input
              type="search"
              placeholder="Search products, plants, careers…"
              aria-label="Search"
              className="w-full bg-transparent text-base outline-none"
              autoFocus
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
            >
              <X className="size-5" />
            </button>
          </form>
          <p className="text-muted-foreground text-sm">
            Press Esc to close. Full search arrives in a later phase.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
