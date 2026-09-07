"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Factory,
  Handshake,
  Leaf,
  Menu,
  Recycle,
  Search,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
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

const navIconMap = {
  drop: Recycle,
  ingot: Factory,
  billet: Factory,
  recycle: Recycle,
  factory: Factory,
  leaf: Leaf,
  handshake: Handshake,
} as const;

const MEGA_VIEWPORT_GUTTER = 16;

/**
 * Viewport-aware mega panel placement (Floating UI / Radix collision pattern):
 * prefer trigger-aligned start, flip/shift horizontally so the panel never
 * clips the viewport; cap width to available space.
 */
function computeMegaPanelStyle(
  triggerEl: HTMLElement,
  panelEl: HTMLElement,
): CSSProperties {
  const gutter = MEGA_VIEWPORT_GUTTER;
  const trigger = triggerEl.getBoundingClientRect();
  const vw = window.innerWidth;
  const available = Math.max(240, vw - gutter * 2);

  // Measure intrinsic width without our previous clamp fighting the layout.
  const prevMax = panelEl.style.maxWidth;
  const prevWidth = panelEl.style.width;
  panelEl.style.maxWidth = "none";
  panelEl.style.width = "max-content";
  const intrinsic = Math.ceil(panelEl.getBoundingClientRect().width);
  panelEl.style.maxWidth = prevMax;
  panelEl.style.width = prevWidth;

  const panelWidth = Math.min(Math.max(intrinsic, 240), available);

  // Prefer aligning panel start with trigger start; if that overflows, shift.
  let absoluteLeft = trigger.left;
  if (absoluteLeft + panelWidth > vw - gutter) {
    absoluteLeft = vw - gutter - panelWidth;
  }
  if (absoluteLeft < gutter) {
    absoluteLeft = gutter;
  }

  return {
    left: absoluteLeft - trigger.left,
    right: "auto",
    width: panelWidth,
    maxWidth: available,
  };
}

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
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = `${id}-panel`;
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({
    left: 0,
    right: "auto",
  });

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

  const reposition = useCallback(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel || !open) return;
    setPanelStyle(computeMegaPanelStyle(root, panel));
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    reposition();
    const panel = panelRef.current;
    const ro =
      typeof ResizeObserver !== "undefined" && panel
        ? new ResizeObserver(() => {
            reposition();
          })
        : null;
    if (panel && ro) ro.observe(panel);
    const onWin = () => reposition();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [open, reposition, children]);

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
        ref={panelRef}
        id={panelId}
        hidden={!open}
        style={panelStyle}
        className={cn(
          "absolute top-full z-50 mt-2 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-brand-lg",
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

function CategoryLink({
  locale,
  item,
  onNavigate,
}: {
  locale: string;
  item: NavLink;
  onNavigate: () => void;
}) {
  const Icon = item.icon ? navIconMap[item.icon] : Factory;
  return (
    <Link
      href={localePath(locale, item.href)}
      onClick={onNavigate}
      className="hover:bg-brand-blue-light group flex gap-3 rounded-[var(--radius-md)] px-2.5 py-2.5 transition-colors"
    >
      <span className="bg-brand-blue-light text-brand-blue flex size-9 shrink-0 items-center justify-center rounded-[10px] transition-colors group-hover:bg-brand-blue group-hover:text-white">
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-[0.95rem] font-semibold text-ink group-hover:text-brand-blue">
          {item.label}
        </span>
        {item.description ? (
          <span className="text-muted-foreground mt-0.5 block text-xs leading-snug">
            {item.description}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

function SkuLink({
  locale,
  item,
  onNavigate,
  badge,
}: {
  locale: string;
  item: NavLink;
  onNavigate: () => void;
  badge?: string;
}) {
  return (
    <Link
      href={localePath(locale, item.href)}
      onClick={onNavigate}
      className="hover:bg-brand-blue-light group block rounded-lg px-2.5 py-2 transition-colors"
    >
      <span className="flex items-start justify-between gap-2">
        <span className="min-w-0 text-sm font-semibold text-ink group-hover:text-brand-blue">
          {item.label}
        </span>
        {badge ? (
          <span className="shrink-0 rounded-full bg-ink/90 px-1.5 py-0.5 text-[0.6rem] font-bold tracking-wide text-brand-red uppercase">
            {badge}
          </span>
        ) : null}
      </span>
      {item.description ? (
        <span className="text-muted-foreground mt-0.5 block text-xs leading-snug">
          {item.description}
        </span>
      ) : null}
    </Link>
  );
}

function ProductMegaPanel({
  locale,
  sections,
  feature,
  onNavigate,
}: {
  locale: string;
  sections: NavSection[];
  feature?: NavGroup["feature"];
  onNavigate: () => void;
}) {
  const categorySection = sections.find((s) =>
    s.title.toLowerCase().includes("category"),
  );
  const presentSection = sections.find((s) =>
    s.title.toLowerCase().includes("present"),
  );
  const upcomingSection = sections.find((s) =>
    s.title.toLowerCase().includes("coming"),
  );
  const otherSections = sections.filter(
    (s) => s !== categorySection && s !== presentSection && s !== upcomingSection,
  );

  return (
    <div className="w-full min-w-[min(100%,20rem)] max-w-[56rem]">
      <div className="grid min-[900px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,0.95fr)]">
        <div className="border-line p-4 min-[720px]:p-5 min-[900px]:border-r">
          {categorySection ? (
            <>
              {categorySection.href ? (
                <Link
                  href={localePath(locale, categorySection.href)}
                  onClick={onNavigate}
                  className="text-brand-blue mb-3 flex items-center gap-1 text-[0.7rem] font-bold tracking-[0.12em] uppercase hover:underline"
                >
                  {categorySection.title}
                  <ArrowRight className="size-3" aria-hidden />
                </Link>
              ) : (
                <p className="text-text-faint mb-3 text-[0.7rem] font-bold tracking-[0.12em] uppercase">
                  {categorySection.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {categorySection.items.map((item) => (
                  <li key={item.href + item.label}>
                    <CategoryLink
                      locale={locale}
                      item={item}
                      onNavigate={onNavigate}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <div className="border-line flex flex-col gap-5 p-4 min-[720px]:p-5 min-[900px]:border-r">
          {presentSection ? (
            <div>
              {presentSection.href ? (
                <Link
                  href={localePath(locale, presentSection.href)}
                  onClick={onNavigate}
                  className="text-brand-blue mb-2.5 flex items-center gap-1 text-[0.7rem] font-bold tracking-[0.12em] uppercase hover:underline"
                >
                  {presentSection.title}
                  <ArrowRight className="size-3" aria-hidden />
                </Link>
              ) : (
                <p className="text-text-faint mb-2.5 text-[0.7rem] font-bold tracking-[0.12em] uppercase">
                  {presentSection.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {presentSection.items.map((item) => (
                  <li key={item.href + item.label}>
                    <SkuLink
                      locale={locale}
                      item={item}
                      onNavigate={onNavigate}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {upcomingSection ? (
            <div>
              {upcomingSection.href ? (
                <Link
                  href={localePath(locale, upcomingSection.href)}
                  onClick={onNavigate}
                  className="text-brand-blue mb-2.5 flex items-center gap-1 text-[0.7rem] font-bold tracking-[0.12em] uppercase hover:underline"
                >
                  {upcomingSection.title}
                  <ArrowRight className="size-3" aria-hidden />
                </Link>
              ) : (
                <p className="text-text-faint mb-2.5 text-[0.7rem] font-bold tracking-[0.12em] uppercase">
                  {upcomingSection.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {upcomingSection.items.map((item) => (
                  <li key={item.href + item.label}>
                    <SkuLink
                      locale={locale}
                      item={item}
                      onNavigate={onNavigate}
                      badge="Soon"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {otherSections.map((section) => (
            <div key={section.title}>
              <p className="text-text-faint mb-2.5 text-[0.7rem] font-bold tracking-[0.12em] uppercase">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.href + item.label}>
                    <SkuLink
                      locale={locale}
                      item={item}
                      onNavigate={onNavigate}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {feature ? (
          <Link
            href={localePath(locale, feature.href)}
            onClick={onNavigate}
            className="group relative hidden min-h-[14rem] overflow-hidden bg-ink min-[900px]:block"
          >
            <Image
              src={feature.imageSrc}
              alt={feature.imageAlt}
              fill
              sizes="18rem"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span
              className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_18_47_/_0.25)_0%,rgb(0_18_47_/_0.88)_100%)]"
              aria-hidden
            />
            <span className="absolute inset-x-0 bottom-0 z-[1] p-4 text-white">
              <span className="text-[0.65rem] font-bold tracking-[0.14em] text-brand-red uppercase">
                {feature.eyebrow}
              </span>
              <span className="font-display mt-1.5 block text-[0.98rem] font-semibold leading-snug">
                {feature.title}
              </span>
            </span>
          </Link>
        ) : null}
      </div>

      {feature ? (
        <div className="border-line bg-bg-alt flex items-center justify-between gap-3 border-t px-5 py-3 min-[900px]:hidden">
          <Link
            href={localePath(locale, feature.href)}
            onClick={onNavigate}
            className="text-brand-blue inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          >
            {feature.title}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      ) : null}
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
        "grid w-full gap-5 p-4 min-[900px]:gap-6 min-[900px]:p-5",
        sections.length >= 3
          ? "min-w-[min(100%,20rem)] max-w-[48rem] grid-cols-1 min-[720px]:grid-cols-3"
          : sections.length === 2
            ? "min-w-[min(100%,18rem)] max-w-[36rem] grid-cols-1 min-[560px]:grid-cols-2"
            : "min-w-[14rem] max-w-[22rem] grid-cols-1",
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
                  <span className="block text-sm font-semibold break-words text-ink group-hover:text-brand-blue">
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

  /** Mobile: categories first, then present / upcoming. */
  const mobileProductSections = [...productSections].sort((a, b) => {
    const rank = (t: string) =>
      t.toLowerCase().includes("category")
        ? 0
        : t.toLowerCase().includes("present")
          ? 1
          : 2;
    return rank(a.title) - rank(b.title);
  });

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
              <ProductMegaPanel
                locale={locale}
                sections={productSections}
                feature={productNav.feature}
                onNavigate={() => setMenu(null)}
              />
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
              <p className="text-text-faint px-3 pb-1 text-[0.65rem] font-bold tracking-[0.12em] uppercase">
                Products
              </p>
              <Accordion multiple defaultValue={["p-Shop by category"]} className="w-full">
                {mobileProductSections.map((section) => (
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
                            <span className="font-medium">{item.label}</span>
                            {item.description ? (
                              <span className="text-muted-foreground mt-0.5 block text-xs">
                                {item.description}
                              </span>
                            ) : null}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <p className="text-text-faint mt-4 px-3 pb-1 text-[0.65rem] font-bold tracking-[0.12em] uppercase">
                Company
              </p>
              <Accordion multiple className="w-full">
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

              {productNav.feature ? (
                <Link
                  href={localePath(locale, productNav.feature.href)}
                  className="text-brand-blue mt-3 block px-5 py-2 text-sm font-semibold"
                  onClick={() => setDrawerOpen(false)}
                >
                  {productNav.feature.title}
                </Link>
              ) : null}

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
