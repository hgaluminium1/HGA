"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  Search,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

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
  companyNav as defaultCompanyNav,
  localePath,
  primaryNavLinks as defaultPrimaryNavLinks,
  productNav as defaultProductNav,
  type NavGroup,
  type NavLink,
  type NavSection,
} from "@/config/nav.config";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  locale: string;
  productNav?: NavGroup;
  companyNav?: NavGroup;
  primaryNavLinks?: NavLink[];
};

type MenuKey = "products" | "company";

function NavDisclosure({
  id,
  label,
  open,
  onOpenChange,
  panelClassName,
  children,
}: {
  id: string;
  label: string;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  panelClassName?: string;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = `${id}-panel`;

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => onOpenChange(false), 200);
  };

  const isFinePointerHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  useEffect(() => () => clearCloseTimer(), []);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => {
        if (!isFinePointerHover()) return;
        clearCloseTimer();
        onOpenChange(true);
      }}
      onMouseLeave={() => {
        if (!isFinePointerHover()) return;
        scheduleClose();
      }}
      onFocusCapture={() => clearCloseTimer()}
      onBlurCapture={(e) => {
        const next = e.relatedTarget as Node | null;
        if (next && rootRef.current?.contains(next)) return;
        onOpenChange(false);
      }}
    >
      <button
        type="button"
        className={cn(
          "inline-flex min-h-11 items-center gap-1 rounded-full px-3.5 py-2.5 text-[0.92rem] font-semibold transition-colors",
          open
            ? "bg-bg-alt text-brand-blue"
            : "hover:bg-bg-alt hover:text-brand-blue",
        )}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
      >
        {label}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "absolute top-full left-0 z-50 mt-2 rounded-[var(--radius-lg)] border border-line bg-surface shadow-brand-lg",
          panelClassName,
        )}
        onMouseEnter={() => {
          if (!isFinePointerHover()) return;
          clearCloseTimer();
        }}
      >
        {children}
      </div>
    </div>
  );
}

function MegaSections({
  locale,
  sections,
  onNavigate,
}: {
  locale: string;
  sections: NavSection[];
  onNavigate: () => void;
}) {
  return (
    <div
      className={cn(
        "grid gap-5 p-4 min-[900px]:gap-6 min-[900px]:p-5",
        sections.length >= 3
          ? "w-[min(52rem,calc(100vw-2rem))] grid-cols-1 min-[720px]:grid-cols-3"
          : sections.length === 2
            ? "w-[min(36rem,calc(100vw-2rem))] grid-cols-1 min-[560px]:grid-cols-2"
            : "min-w-[14rem] max-w-[calc(100vw-2rem)] grid-cols-1",
      )}
    >
      {sections.map((section) => (
        <div key={section.title} className="min-w-0">
          {section.href ? (
            <Link
              href={localePath(locale, section.href)}
              onClick={onNavigate}
              className="text-brand-blue mb-3 flex items-center gap-1 text-[0.7rem] font-bold tracking-[0.12em] uppercase hover:underline"
            >
              {section.title}
              <ArrowRight className="size-3" aria-hidden />
            </Link>
          ) : (
            <p className="text-text-faint mb-3 text-[0.7rem] font-bold tracking-[0.12em] uppercase">
              {section.title}
            </p>
          )}
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={localePath(locale, item.href)}
                  onClick={onNavigate}
                  className="hover:bg-brand-blue-light group block rounded-lg px-2.5 py-2 transition-colors"
                >
                  <span className="block text-sm font-semibold text-ink group-hover:text-brand-blue">
                    {item.label}
                  </span>
                  {item.description ? (
                    <span className="text-muted-foreground mt-0.5 block text-xs leading-snug">
                      {item.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MegaFooterCta({
  locale,
  href,
  label,
  onNavigate,
}: {
  locale: string;
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <div className="border-line bg-bg-alt flex items-center justify-between gap-3 border-t px-5 py-3">
      <Link
        href={localePath(locale, href)}
        onClick={onNavigate}
        className="text-brand-blue inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
      >
        {label}
        <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </div>
  );
}

export function SiteHeader({
  locale,
  productNav = defaultProductNav,
  companyNav = defaultCompanyNav,
  primaryNavLinks = defaultPrimaryNavLinks,
}: SiteHeaderProps) {
  const navId = useId();
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const setMenu = useCallback((key: MenuKey | null) => {
    setOpenMenu(key);
  }, []);

  const home = localePath(locale);
  const productSections = productNav.sections?.length
    ? productNav.sections
    : [{ title: "Products", items: productNav.items }];
  const companySections = companyNav.sections?.length
    ? companyNav.sections
    : [{ title: "Company", items: companyNav.items }];

  return (
    <>
      <header className="sticky top-0 z-50 h-14 border-b border-line bg-surface/95 backdrop-blur-md min-[400px]:h-16">
        <Container className="flex h-full min-w-0 items-center justify-between gap-2 min-[400px]:gap-3 min-[68.75rem]:gap-4">
          <BrandLockup href={home} />

          <nav
            className="hidden items-center gap-0.5 min-[68.75rem]:flex"
            aria-label="Primary"
          >
            <NavDisclosure
              id={`${navId}-products`}
              label={productNav.label}
              open={openMenu === "products"}
              onOpenChange={(next) => setMenu(next ? "products" : null)}
              panelClassName="overflow-hidden p-0"
            >
              <MegaSections
                locale={locale}
                sections={productSections}
                onNavigate={() => setMenu(null)}
              />
              {productNav.feature ? (
                <MegaFooterCta
                  locale={locale}
                  href={productNav.feature.href}
                  label={productNav.feature.title}
                  onNavigate={() => setMenu(null)}
                />
              ) : null}
            </NavDisclosure>

            <Link
              href={localePath(locale, "industries")}
              className="hover:bg-bg-alt hover:text-brand-blue min-h-11 rounded-full px-3.5 py-2.5 text-[0.92rem] font-semibold transition-colors"
            >
              Industries
            </Link>

            <NavDisclosure
              id={`${navId}-company`}
              label={companyNav.label}
              open={openMenu === "company"}
              onOpenChange={(next) => setMenu(next ? "company" : null)}
              panelClassName="overflow-hidden p-0"
            >
              <MegaSections
                locale={locale}
                sections={companySections}
                onNavigate={() => setMenu(null)}
              />
            </NavDisclosure>

            {siteConfig.flags.investorsSection ? (
              <Link
                href={localePath(locale, "about")}
                className="hover:bg-bg-alt hover:text-brand-blue min-h-11 rounded-full px-3.5 py-2.5 text-[0.92rem] font-semibold"
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
                  className="hover:bg-bg-alt hover:text-brand-blue min-h-11 rounded-full px-3.5 py-2.5 text-[0.92rem] font-semibold"
                >
                  {link.label}
                </Link>
              ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1 min-[400px]:gap-1.5 min-[560px]:gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 min-[400px]:size-10"
              aria-label="Open search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-[18px] min-[400px]:size-[19px]" />
            </Button>
            <Button
              className="hidden min-[720px]:inline-flex"
              size="sm"
              render={<Link href={localePath(locale, "contact")} />}
            >
              Inquire Now
            </Button>
            <button
              type="button"
              className="hover:bg-muted inline-flex size-9 items-center justify-center rounded-full min-[400px]:size-10 min-[68.75rem]:hidden"
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
              aria-controls={`${navId}-mobile-drawer`}
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </Container>
      </header>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          id={`${navId}-mobile-drawer`}
          side="right"
          className="flex w-[min(380px,92vw)] flex-col p-0"
        >
          <SheetHeader className="border-b border-line px-4 py-3">
            <SheetTitle className="sr-only">Site menu</SheetTitle>
            <BrandLockup href={home} />
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-3">
              <Accordion multiple className="w-full">
                {productSections.map((section) => (
                  <AccordionItem key={section.title} value={`p-${section.title}`}>
                    <AccordionTrigger className="min-h-11 px-3 text-brand-blue">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-3">
                      <div className="flex flex-col gap-1">
                        {section.items.map((item) => (
                          <Link
                            key={item.href + item.label}
                            href={localePath(locale, item.href)}
                            className="hover:bg-brand-blue-light rounded-lg px-3 py-2.5 text-sm"
                            onClick={() => setDrawerOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
                {companySections.map((section) => (
                  <AccordionItem key={section.title} value={`c-${section.title}`}>
                    <AccordionTrigger className="min-h-11 px-3 text-brand-blue">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-3">
                      <div className="flex flex-col gap-1">
                        {section.items.map((item) => (
                          <Link
                            key={item.href + item.label}
                            href={localePath(locale, item.href)}
                            className="hover:bg-brand-blue-light rounded-lg px-3 py-2.5 text-sm"
                            onClick={() => setDrawerOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Link
                href={localePath(locale, "industries")}
                className="hover:bg-brand-blue-light mt-1 block rounded-lg px-5 py-3 text-sm font-semibold"
                onClick={() => setDrawerOpen(false)}
              >
                Industries
              </Link>
              <Link
                href={localePath(locale, "contact")}
                className="hover:bg-brand-blue-light block rounded-lg px-5 py-3 text-sm font-semibold"
                onClick={() => setDrawerOpen(false)}
              >
                Contact Us
              </Link>
            </div>
            <div className="border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
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
            onSubmit={(e) => e.preventDefault()}
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
