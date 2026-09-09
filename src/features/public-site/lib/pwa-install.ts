/**
 * Client-only PWA install helpers.
 * Android/Chromium: beforeinstallprompt. iOS Safari: manual A2HS only.
 */

export const PWA_DISMISS_KEY = "hg.pwa.install.dismissedAt";
export const PWA_SESSION_PAGES_KEY = "hg.pwa.session.pages";
/** Don’t resurface for 30 days after dismiss. */
export const PWA_DISMISS_MS = 30 * 24 * 60 * 60 * 1000;
/** Wait for real engagement before any install surface. */
export const PWA_ENGAGE_MS = 16_000;
export const PWA_ENGAGE_SCROLL = 0.32;

export type PwaPlatform = "chromium" | "ios-safari" | "ios-other" | "unsupported";

export type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt: () => Promise<void>;
};

export function isPwaStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    nav.standalone === true
  );
}

export function detectPwaPlatform(): PwaPlatform {
  if (typeof window === "undefined") return "unsupported";
  const ua = window.navigator.userAgent;
  const isIos =
    /iphone|ipad|ipod/i.test(ua) ||
    (window.navigator.platform === "MacIntel" &&
      window.navigator.maxTouchPoints > 1);

  if (isIos) {
    // Chrome/Firefox/Edge on iOS cannot install PWAs — Safari only.
    if (/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua)) return "ios-other";
    return "ios-safari";
  }

  // Chromium family (Android + desktop Chrome/Edge) can fire beforeinstallprompt.
  if (/Chrome|Chromium|Edg|SamsungBrowser/i.test(ua) && !/OPR\//i.test(ua)) {
    return "chromium";
  }

  return "unsupported";
}

export function wasInstallDismissed(now = Date.now()): boolean {
  try {
    const raw = window.localStorage.getItem(PWA_DISMISS_KEY);
    if (!raw) return false;
    const at = Number(raw);
    if (!Number.isFinite(at)) return false;
    return now - at < PWA_DISMISS_MS;
  } catch {
    return false;
  }
}

export function dismissInstallPrompt(now = Date.now()) {
  try {
    window.localStorage.setItem(PWA_DISMISS_KEY, String(now));
  } catch {
    /* private mode */
  }
}

export function bumpSessionPageViews(): number {
  try {
    const next = Number(sessionStorage.getItem(PWA_SESSION_PAGES_KEY) ?? "0") + 1;
    sessionStorage.setItem(PWA_SESSION_PAGES_KEY, String(next));
    return next;
  } catch {
    return 1;
  }
}

export function scrollEngagementRatio(): number {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 1;
  return window.scrollY / scrollable;
}
