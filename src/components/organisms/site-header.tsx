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
  useRef,
  useState,
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

function isFinePointerHover() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

/** Compact trigger — panel is rendered full-bleed on the header (Apple / Microsoft / Adobe). */
function NavTrigger({
  id,
  label,
  open,
  onOpen,
  onToggle,
}: {
  id: string;
  label: string;
  open: boolean;
  onOpen: () => void;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      id={id}
      className={cn(
        "inline-flex min-h-11 items-center gap-1 rounded-full px-3.5 py-2.5 text-[0.92rem] font-semibold transition-colors",
        open
          ? "bg-bg-alt text-brand-blue"
          : "hover:bg-bg-alt hover:text-brand-blue",
      )}
      aria-expanded={open}
      aria-controls={`${id}-panel`}
      onMouseEnter={() => {
        if (isFinePointerHover()) onOpen();
      }}
      onClick={onToggle}
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
  );
}

function MegaSectionLabel({
  title,
  href,
  locale,
  onNavigate,
}: {
  title: string;
  href?: string;
  locale: string;
  onNavigate: () => void;
}) {
  if (href) {
    return (
      <Link
        href={localePath(locale, href)}
        onClick={onNavigate}
        className="text-text-faint hover:text-brand-blue mb-2 flex items-center gap-1 text-[0.65rem] font-semibold tracking-[0.14em] uppercase transition-colors"
      >
        {title}
        <ArrowRight className="size-3 opacity-60" aria-hidden />
      </Link>
    );
  }
  return (
    <p className="text-text-faint mb-2 text-[0.65rem] font-semibold tracking-[0.14em] uppercase">
      {title}
    </p>
  );
}

function CompactLink({
  locale,
  item,
  onNavigate,
  badge,
  showDescription = true,
}: {
  locale: string;
  item: NavLink;
  onNavigate: () => void;
  badge?: string;
  showDescription?: boolean;
}) {
  return (
    <Link
      href={localePath(locale, item.href)}
      onClick={onNavigate}
      className="group -mx-1.5 flex items-start justify-between gap-2 rounded-md px-1.5 py-1.5 transition-colors hover:bg-bg-alt"
    >
      <span className="min-w-0">
        <span className="block text-[0.875rem] font-medium text-ink group-hover:text-brand-blue">
          {item.label}
        </span>
        {showDescription && item.description ? (
          <span className="text-muted-foreground mt-0.5 line-clamp-1 block text-[0.7rem] leading-snug">
            {item.description}
          </span>
        ) : null}
      </span>
      {badge ? (
        <span className="mt-0.5 shrink-0 text-[0.6rem] font-bold tracking-[0.08em] text-brand-red uppercase">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function CategoryCompactLink({
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
      className="group -mx-1.5 flex items-center gap-2.5 rounded-md px-1.5 py-1.5 transition-colors hover:bg-bg-alt"
    >
      <span className="text-brand-blue flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-blue-light">
        <Icon className="size-3.5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-[0.875rem] font-medium text-ink group-hover:text-brand-blue">
          {item.label}
        </span>
        {item.description ? (
          <span className="text-muted-foreground mt-0.5 line-clamp-1 block text-[0.7rem] leading-snug">
            {item.description}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

function MegaFeatureTile({
  locale,
  feature,
  onNavigate,
}: {
  locale: string;
  feature: NonNullable<NavGroup["feature"]>;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={localePath(locale, feature.href)}
      onClick={onNavigate}
      className="group relative block aspect-[5/4] w-full overflow-hidden rounded-[var(--radius-md)] bg-ink min-[900px]:aspect-auto min-[900px]:min-h-[11.5rem] min-[900px]:h-full"
    >
      <Image
        src={feature.imageSrc}
        alt={feature.imageAlt}
        fill
        sizes="20rem"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
      <span
        className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgb(0_18_47_/_0.88)_100%)]"
        aria-hidden
      />
      <span className="absolute inset-x-0 bottom-0 z-[1] p-3.5 text-white">
        <span className="text-[0.6rem] font-bold tracking-[0.14em] text-brand-red uppercase">
          {feature.eyebrow}
        </span>
        <span className="mt-1 block text-[0.875rem] font-semibold leading-snug">
          {feature.title}
        </span>
      </span>
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
    (s) =>
      s !== categorySection && s !== presentSection && s !== upcomingSection,
  );

  return (
    <div className="w-full">
      <div
        className={cn(
          "grid gap-6 py-5 min-[720px]:gap-8 min-[720px]:py-6",
          "grid-cols-1 min-[720px]:grid-cols-2",
          upcomingSection && feature
            ? "min-[960px]:grid-cols-[1.1fr_1.2fr_1.1fr_0.95fr]"
            : feature
              ? "min-[960px]:grid-cols-[1.15fr_1.25fr_0.95fr]"
              : "min-[960px]:grid-cols-3",
        )}
      >
        {categorySection ? (
          <div className="min-w-0">
            <MegaSectionLabel
              title={categorySection.title}
              href={categorySection.href}
              locale={locale}
              onNavigate={onNavigate}
            />
            <ul>
              {categorySection.items.map((item) => (
                <li key={item.href + item.label}>
                  <CategoryCompactLink
                    locale={locale}
                    item={item}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {presentSection ? (
          <div className="min-w-0">
            <MegaSectionLabel
              title={presentSection.title}
              href={presentSection.href}
              locale={locale}
              onNavigate={onNavigate}
            />
            <ul>
              {presentSection.items.map((item) => (
                <li key={item.href + item.label}>
                  <CompactLink
                    locale={locale}
                    item={item}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
            {!upcomingSection
              ? otherSections.map((section) => (
                  <div key={section.title} className="mt-5">
                    <MegaSectionLabel
                      title={section.title}
                      href={section.href}
                      locale={locale}
                      onNavigate={onNavigate}
                    />
                    <ul>
                      {section.items.map((item) => (
                        <li key={item.href + item.label}>
                          <CompactLink
                            locale={locale}
                            item={item}
                            onNavigate={onNavigate}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              : null}
          </div>
        ) : null}

        {upcomingSection ? (
          <div className="min-w-0">
            <MegaSectionLabel
              title={upcomingSection.title}
              href={upcomingSection.href}
              locale={locale}
              onNavigate={onNavigate}
            />
            <ul>
              {upcomingSection.items.map((item) => (
                <li key={item.href + item.label}>
                  <CompactLink
                    locale={locale}
                    item={item}
                    onNavigate={onNavigate}
                    badge="Soon"
                  />
                </li>
              ))}
            </ul>
            {otherSections.map((section) => (
              <div key={section.title} className="mt-5">
                <MegaSectionLabel
                  title={section.title}
                  href={section.href}
                  locale={locale}
                  onNavigate={onNavigate}
                />
                <ul>
                  {section.items.map((item) => (
                    <li key={item.href + item.label}>
                      <CompactLink
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
        ) : null}

        {feature ? (
          <div className="min-w-0 min-[960px]:pl-2">
            <MegaFeatureTile
              locale={locale}
              feature={feature}
              onNavigate={onNavigate}
            />
          </div>
        ) : null}
      </div>

      <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t py-3">
        {feature ? (
          <Link
            href={localePath(locale, feature.href)}
            onClick={onNavigate}
            className="text-brand-blue inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold hover:underline"
          >
            View full catalogue
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={localePath(locale, "contact")}
          onClick={onNavigate}
          className="text-ink hover:text-brand-blue inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold transition-colors"
        >
          Request a quote
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function CompanyMegaPanel({
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
  return (
    <div className="w-full">
      <div
        className={cn(
          "grid gap-6 py-5 min-[720px]:gap-8 min-[720px]:py-6",
          "grid-cols-1 min-[640px]:grid-cols-2",
          feature
            ? "min-[960px]:grid-cols-[1fr_1fr_1fr_0.95fr]"
            : "min-[960px]:grid-cols-3",
        )}
      >
        {sections.map((section) => (
          <div key={section.title} className="min-w-0">
            <MegaSectionLabel
              title={section.title}
              href={section.href}
              locale={locale}
              onNavigate={onNavigate}
            />
            <ul>
              {section.items.map((item) => (
                <li key={item.href + item.label}>
                  <CompactLink
                    locale={locale}
                    item={item}
                    onNavigate={onNavigate}
                    showDescription
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}

        {feature ? (
          <div className="min-w-0 min-[960px]:pl-2">
            <MegaFeatureTile
              locale={locale}
              feature={feature}
              onNavigate={onNavigate}
            />
          </div>
        ) : null}
      </div>

      <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t py-3">
        <Link
          href={localePath(locale, "careers")}
          onClick={onNavigate}
          className="text-ink hover:text-brand-blue text-[0.8125rem] font-semibold transition-colors"
        >
          Careers
        </Link>
        <Link
          href={localePath(locale, "contact")}
          onClick={onNavigate}
          className="text-brand-blue inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold hover:underline"
        >
          Contact / RFQ
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
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
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  }, [clearCloseTimer]);

  const setMenu = useCallback(
    (key: MenuKey | null) => {
      clearCloseTimer();
      setOpenMenu(key);
    },
    [clearCloseTimer],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

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

  const closeMega = () => setMenu(null);

  return (
    <>
      <header
        className="relative sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-md"
        onMouseEnter={clearCloseTimer}
        onMouseLeave={() => {
          if (isFinePointerHover()) scheduleClose();
        }}
      >
        <div className="relative h-14 min-[400px]:h-16">
          <Container className="flex h-full min-w-0 items-center justify-between gap-2 min-[400px]:gap-3 min-[68.75rem]:gap-4">
            <BrandLockup href={home} />

            <nav
              className="hidden items-center gap-0.5 min-[68.75rem]:flex"
              aria-label="Primary"
            >
              <NavTrigger
                id={`${navId}-products`}
                label={productNav.label}
                open={openMenu === "products"}
                onOpen={() => setMenu("products")}
                onToggle={() =>
                  setMenu(openMenu === "products" ? null : "products")
                }
              />

              <Link
                href={localePath(locale, "industries")}
                className="hover:bg-bg-alt hover:text-brand-blue min-h-11 rounded-full px-3.5 py-2.5 text-[0.92rem] font-semibold transition-colors"
                onMouseEnter={() => {
                  if (isFinePointerHover()) setMenu(null);
                }}
              >
                Industries
              </Link>

              <NavTrigger
                id={`${navId}-company`}
                label={companyNav.label}
                open={openMenu === "company"}
                onOpen={() => setMenu("company")}
                onToggle={() =>
                  setMenu(openMenu === "company" ? null : "company")
                }
              />

              {siteConfig.flags.investorsSection ? (
                <Link
                  href={localePath(locale, "about")}
                  className="hover:bg-bg-alt hover:text-brand-blue min-h-11 rounded-full px-3.5 py-2.5 text-[0.92rem] font-semibold"
                  onMouseEnter={() => {
                    if (isFinePointerHover()) setMenu(null);
                  }}
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
                    onMouseEnter={() => {
                      if (isFinePointerHover()) setMenu(null);
                    }}
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
        </div>

        {/* Full-bleed mega — Apple / Microsoft / Adobe pattern */}
        {openMenu ? (
          <div
            id={
              openMenu === "products"
                ? `${navId}-products-panel`
                : `${navId}-company-panel`
            }
            className="border-line absolute inset-x-0 top-full z-50 hidden border-b bg-surface shadow-[0_18px_40px_-28px_rgb(0_18_47_/_0.45)] min-[68.75rem]:block"
            role="region"
            aria-label={openMenu === "products" ? "Products menu" : "Company menu"}
          >
            <Container>
              {openMenu === "products" ? (
                <ProductMegaPanel
                  locale={locale}
                  sections={productSections}
                  feature={productNav.feature}
                  onNavigate={closeMega}
                />
              ) : (
                <CompanyMegaPanel
                  locale={locale}
                  sections={companySections}
                  feature={companyNav.feature}
                  onNavigate={closeMega}
                />
              )}
            </Container>
          </div>
        ) : null}
      </header>

      {openMenu ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-x-0 bottom-0 top-14 z-40 hidden bg-ink/30 min-[400px]:top-16 min-[68.75rem]:block"
          onClick={closeMega}
        />
      ) : null}

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
                              <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-xs">
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
                            <span className="font-medium">{item.label}</span>
                            {item.description ? (
                              <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-xs">
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
