"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  Briefcase,
  FileText,
  Package,
  Search,
  Layers,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { localePath } from "@/config/nav.config";
import {
  filterSearchIndex,
  type SearchIndexItem,
  type SearchResultType,
} from "@/features/public-site/lib/search-index-shared";
import { cn } from "@/lib/utils";

type SiteSearchContextValue = {
  openSearch: () => void;
};

const SiteSearchContext = createContext<SiteSearchContextValue | null>(null);

export function useSiteSearch() {
  const ctx = useContext(SiteSearchContext);
  if (!ctx) {
    throw new Error("useSiteSearch must be used within SiteSearchProvider");
  }
  return ctx;
}

const TYPE_META: Record<
  SearchResultType,
  { label: string; icon: typeof Package }
> = {
  product: { label: "Products", icon: Package },
  category: { label: "Categories", icon: Layers },
  page: { label: "Pages", icon: FileText },
  career: { label: "Careers", icon: Briefcase },
};

const TYPE_ORDER: SearchResultType[] = [
  "product",
  "category",
  "page",
  "career",
];

const QUICK_LINKS: { title: string; href: string; description: string }[] = [
  {
    title: "Products",
    href: "products",
    description: "Browse the full catalogue",
  },
  {
    title: "Contact / RFQ",
    href: "contact",
    description: "Send a programme brief",
  },
  {
    title: "Careers",
    href: "careers",
    description: "Open roles at HG",
  },
];

function groupResults(items: SearchIndexItem[]) {
  const groups: { type: SearchResultType; items: SearchIndexItem[] }[] = [];
  for (const type of TYPE_ORDER) {
    const slice = items.filter((i) => i.type === type);
    if (slice.length) groups.push({ type, items: slice });
  }
  return groups;
}

function SiteSearchDialog({
  locale,
  open,
  onOpenChange,
}: {
  locale: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchIndexItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
      return;
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open || index) return;
    let cancelled = false;
    setLoading(true);
    void fetch(
      `/api/v1/public/search-index?locale=${encodeURIComponent(locale)}`,
    )
      .then(async (res) => {
        if (!res.ok) throw new Error("index failed");
        const json = (await res.json()) as {
          data?: { items?: SearchIndexItem[] };
        };
        if (!cancelled) setIndex(json.data?.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setIndex([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, index, locale]);

  const results = useMemo(() => {
    if (!index || !query.trim()) return [];
    return filterSearchIndex(index, query);
  }, [index, query]);

  const groups = useMemo(() => groupResults(results), [results]);

  const flat = useMemo(() => {
    if (query.trim()) return results;
    return QUICK_LINKS.map(
      (q, i): SearchIndexItem => ({
        id: `quick-${i}`,
        type: "page",
        title: q.title,
        description: q.description,
        href: q.href,
        keywords: [],
      }),
    );
  }, [query, results]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-search-index="${active}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(localePath(locale, href));
    },
    [close, locale, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(flat.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[active];
      if (item) go(item.href);
    }
  };

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[min(18vh,7rem)] max-w-xl translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl"
        onKeyDown={onKeyDown}
      >
        <DialogTitle className="sr-only">Search the site</DialogTitle>
        <div className="border-line flex items-center gap-3 border-b px-4 py-3">
          <Search
            className="text-muted-foreground size-[18px] shrink-0"
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, pages, careers…"
            aria-label="Search"
            aria-controls="site-search-results"
            aria-autocomplete="list"
            className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-[0.9375rem] outline-none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <kbd className="text-text-faint hidden rounded border border-line bg-bg-alt px-1.5 py-0.5 text-[0.65rem] font-medium tracking-wide uppercase sm:inline-block">
            Esc
          </kbd>
        </div>

        <div
          id="site-search-results"
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="max-h-[min(55vh,22rem)] overflow-y-auto overscroll-contain py-2"
        >
          {loading && !index ? (
            <p className="text-muted-foreground px-4 py-6 text-sm">
              Loading catalogue…
            </p>
          ) : query.trim() && results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-medium text-ink">No matches</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Try a product name, SKU, or page title.
              </p>
            </div>
          ) : query.trim() ? (
            groups.map((group) => {
              const Meta = TYPE_META[group.type];
              return (
                <div key={group.type} className="mb-1">
                  <p className="text-text-faint px-4 pb-1 pt-2 text-[0.65rem] font-bold tracking-[0.12em] uppercase">
                    {Meta.label}
                  </p>
                  <ul>
                    {group.items.map((item) => {
                      const idx = flat.findIndex((f) => f.id === item.id);
                      const Icon = TYPE_META[item.type].icon;
                      const selected = idx === active;
                      return (
                        <li
                          key={item.id}
                          role="option"
                          aria-selected={selected}
                        >
                          <Link
                            href={localePath(locale, item.href)}
                            data-search-index={idx}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 transition-colors",
                              selected
                                ? "bg-brand-blue/8 text-ink"
                                : "hover:bg-bg-alt",
                            )}
                            onMouseEnter={() => setActive(idx)}
                            onClick={close}
                          >
                            <span
                              className={cn(
                                "inline-flex size-8 shrink-0 items-center justify-center rounded-lg",
                                selected
                                  ? "bg-brand-blue/12 text-brand-blue"
                                  : "bg-bg-alt text-muted-foreground",
                              )}
                            >
                              <Icon className="size-4" aria-hidden />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">
                                {item.title}
                              </span>
                              {item.description ? (
                                <span className="text-muted-foreground block truncate text-xs">
                                  {item.description}
                                </span>
                              ) : null}
                            </span>
                            <ArrowRight
                              className={cn(
                                "size-3.5 shrink-0",
                                selected
                                  ? "text-brand-blue opacity-100"
                                  : "opacity-0",
                              )}
                              aria-hidden
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          ) : (
            <div>
              <p className="text-text-faint px-4 pb-1 pt-2 text-[0.65rem] font-bold tracking-[0.12em] uppercase">
                Suggested
              </p>
              <ul>
                {QUICK_LINKS.map((item, i) => {
                  const selected = i === active;
                  return (
                    <li key={item.href} role="option" aria-selected={selected}>
                      <Link
                        href={localePath(locale, item.href)}
                        data-search-index={i}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 transition-colors",
                          selected
                            ? "bg-brand-blue/8 text-ink"
                            : "hover:bg-bg-alt",
                        )}
                        onMouseEnter={() => setActive(i)}
                        onClick={close}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">
                            {item.title}
                          </span>
                          <span className="text-muted-foreground block text-xs">
                            {item.description}
                          </span>
                        </span>
                        <ArrowRight
                          className={cn(
                            "size-3.5 shrink-0",
                            selected
                              ? "text-brand-blue opacity-100"
                              : "opacity-0",
                          )}
                          aria-hidden
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="border-line text-text-faint flex items-center justify-between gap-3 border-t px-4 py-2 text-[0.7rem]">
          <span className="hidden sm:inline">
            <kbd className="rounded border border-line bg-bg-alt px-1 py-0.5 font-medium">
              ↑↓
            </kbd>{" "}
            navigate{" "}
            <kbd className="ml-1.5 rounded border border-line bg-bg-alt px-1 py-0.5 font-medium">
              ↵
            </kbd>{" "}
            open
          </span>
          <span className="sm:ml-auto">
            <kbd className="rounded border border-line bg-bg-alt px-1.5 py-0.5 font-medium">
              {isMac ? "⌘" : "Ctrl"}
            </kbd>
            <kbd className="ml-0.5 rounded border border-line bg-bg-alt px-1.5 py-0.5 font-medium">
              K
            </kbd>{" "}
            to search
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SiteSearchProvider({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          (e.target as HTMLElement | null)?.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(() => ({ openSearch }), [openSearch]);

  return (
    <SiteSearchContext.Provider value={value}>
      {children}
      <SiteSearchDialog locale={locale} open={open} onOpenChange={setOpen} />
    </SiteSearchContext.Provider>
  );
}
