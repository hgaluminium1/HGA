"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Download, Share, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";
import {
  bumpSessionPageViews,
  detectPwaPlatform,
  dismissInstallPrompt,
  isPwaStandalone,
  PWA_ENGAGE_MS,
  PWA_ENGAGE_SCROLL,
  scrollEngagementRatio,
  wasInstallDismissed,
  type BeforeInstallPromptEvent,
  type PwaPlatform,
} from "@/features/public-site/lib/pwa-install";
import { cn } from "@/lib/utils";

type Surface = "hidden" | "chromium" | "ios-safari" | "ios-other";

function subscribeOnline(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

/**
 * FAANG-grade install promotion (public site only):
 * - Chromium: capture beforeinstallprompt → branded CTA → native prompt()
 * - iOS Safari: instructional Add to Home Screen sheet (no API exists)
 * - Never on first paint; engagement-gated; dismissible 30d; hidden in standalone
 */
export function PwaInstallPrompt() {
  const titleId = useId();
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<PwaPlatform>("unsupported");
  const [engaged, setEngaged] = useState(false);
  const [open, setOpen] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [chromiumReady, setChromiumReady] = useState(false);

  const online = useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  );

  const close = useCallback((persistDismiss: boolean) => {
    setOpen(false);
    if (persistDismiss) dismissInstallPrompt();
  }, []);

  useEffect(() => {
    if (isPwaStandalone() || wasInstallDismissed()) return;

    const p = detectPwaPlatform();
    setPlatform(p);
    bumpSessionPageViews();

    const engageTimer = window.setTimeout(() => setEngaged(true), PWA_ENGAGE_MS);
    const onScroll = () => {
      if (scrollEngagementRatio() >= PWA_ENGAGE_SCROLL) setEngaged(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const onBip = (e: Event) => {
      e.preventDefault();
      deferred.current = e as BeforeInstallPromptEvent;
      setChromiumReady(true);
    };
    const onInstalled = () => {
      deferred.current = null;
      setChromiumReady(false);
      setOpen(false);
      dismissInstallPrompt();
    };

    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.clearTimeout(engageTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (!engaged || !online || isPwaStandalone() || wasInstallDismissed()) {
      return;
    }

    let surface: Surface = "hidden";
    if (platform === "chromium" && chromiumReady) surface = "chromium";
    else if (platform === "ios-safari") surface = "ios-safari";
    else if (platform === "ios-other") surface = "ios-other";

    if (surface === "hidden") return;

    // Slight delay after engagement so it doesn’t collide with nav mega-open.
    const t = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(t);
  }, [engaged, online, platform, chromiumReady]);

  async function onInstallClick() {
    const bip = deferred.current;
    if (!bip) return;
    setInstalling(true);
    try {
      await bip.prompt();
      await bip.userChoice;
    } finally {
      deferred.current = null;
      setChromiumReady(false);
      setInstalling(false);
      setOpen(false);
      dismissInstallPrompt();
    }
  }

  if (!open) return null;

  const isIos = platform === "ios-safari" || platform === "ios-other";

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] min-[720px]:p-4"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        className={cn(
          "pointer-events-auto w-full max-w-[28rem] overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-brand-lg",
          "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-300",
        )}
      >
        <div className="flex items-start gap-3 border-b border-line px-4 py-3.5">
          <span className="bg-brand-blue-light text-brand-blue mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[10px]">
            {isIos ? (
              <Share className="size-4" aria-hidden />
            ) : (
              <Download className="size-4" aria-hidden />
            )}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2
              id={titleId}
              className="font-display text-[0.95rem] font-semibold tracking-[-0.015em] text-ink"
            >
              {platform === "chromium"
                ? `Install ${siteConfig.shortName}`
                : platform === "ios-other"
                  ? "Open in Safari to install"
                  : "Add to Home Screen"}
            </h2>
            <p className="text-muted-foreground mt-1 text-[0.78rem] leading-snug">
              {platform === "chromium"
                ? "Home-screen access to the catalogue and RFQ — works offline for pages you’ve already opened."
                : platform === "ios-other"
                  ? "iPhone only installs PWAs from Safari. Open this site in Safari, then use Share → Add to Home Screen."
                  : "Safari doesn’t allow a one-tap install button. Use Share, then Add to Home Screen."}
            </p>
          </div>
          <button
            type="button"
            className="text-text-faint hover:bg-bg-alt hover:text-ink -mr-1 -mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors"
            aria-label="Dismiss"
            onClick={() => close(true)}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        {platform === "chromium" ? (
          <div className="flex flex-wrap items-center justify-end gap-2 px-4 py-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => close(true)}
            >
              Not now
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={installing}
              onClick={() => void onInstallClick()}
            >
              {installing ? "Installing…" : "Install"}
            </Button>
          </div>
        ) : null}

        {platform === "ios-safari" ? (
          <ol className="space-y-2.5 px-4 py-3.5 text-[0.8rem] text-ink">
            <li className="flex gap-2.5">
              <span className="bg-brand-blue-light text-brand-blue flex size-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold">
                1
              </span>
              <span>
                Tap{" "}
                <span className="inline-flex items-center gap-1 font-semibold">
                  Share
                  <Share className="size-3.5 text-brand-blue" aria-hidden />
                </span>{" "}
                in Safari’s toolbar
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="bg-brand-blue-light text-brand-blue flex size-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold">
                2
              </span>
              <span>
                Scroll and choose{" "}
                <span className="font-semibold">Add to Home Screen</span>
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="bg-brand-blue-light text-brand-blue flex size-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold">
                3
              </span>
              <span>
                Confirm <span className="font-semibold">Add</span>
              </span>
            </li>
          </ol>
        ) : null}

        {platform === "ios-other" || platform === "ios-safari" ? (
          <div className="border-t border-line px-4 py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => close(true)}
            >
              Got it
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
