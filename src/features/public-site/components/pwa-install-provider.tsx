"use client";

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
  bumpSessionPageViews,
  detectPwaPlatform,
  dismissInstallPrompt,
  hasScrollEngagement,
  isPwaStandalone,
  PWA_CARD_DELAY_MS,
  PWA_ENGAGE_MS,
  wasInstallDismissed,
  type BeforeInstallPromptEvent,
  type PwaPlatform,
} from "@/features/public-site/lib/pwa-install";

type PwaInstallContextValue = {
  platform: PwaPlatform;
  /** Chromium BIP captured — show header Install immediately. */
  chromiumReady: boolean;
  /** Bottom card visible after light engagement. */
  cardOpen: boolean;
  installing: boolean;
  promptInstall: () => Promise<void>;
  dismissCard: (persist: boolean) => void;
  /** Hide header install after dismiss/install. */
  showHeaderInstall: boolean;
};

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

export function usePwaInstall() {
  return useContext(PwaInstallContext);
}

export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<PwaPlatform>("unsupported");
  const [engaged, setEngaged] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [chromiumReady, setChromiumReady] = useState(false);
  const [suppressed, setSuppressed] = useState(false);

  const markEngaged = useCallback(() => setEngaged(true), []);

  useEffect(() => {
    if (isPwaStandalone() || wasInstallDismissed()) {
      setSuppressed(true);
      return;
    }

    setPlatform(detectPwaPlatform());
    bumpSessionPageViews();

    const engageTimer = window.setTimeout(markEngaged, PWA_ENGAGE_MS);

    const onScroll = () => {
      if (hasScrollEngagement()) markEngaged();
    };

    const onInteract = (e: Event) => {
      const t = e.target;
      if (t instanceof Element && t.closest("[data-pwa-install-ui]")) return;
      markEngaged();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onInteract, { passive: true });
    window.addEventListener("keydown", onInteract);
    onScroll();

    const onBip = (e: Event) => {
      e.preventDefault();
      deferred.current = e as BeforeInstallPromptEvent;
      setChromiumReady(true);
    };
    const onInstalled = () => {
      deferred.current = null;
      setChromiumReady(false);
      setCardOpen(false);
      setSuppressed(true);
      dismissInstallPrompt();
    };

    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.clearTimeout(engageTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [markEngaged]);

  useEffect(() => {
    if (suppressed || !engaged || isPwaStandalone() || wasInstallDismissed()) {
      return;
    }

    const eligible =
      (platform === "chromium" && chromiumReady) ||
      platform === "ios-safari" ||
      platform === "ios-other";
    if (!eligible) return;

    const t = window.setTimeout(() => setCardOpen(true), PWA_CARD_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [engaged, platform, chromiumReady, suppressed]);

  const dismissCard = useCallback((persist: boolean) => {
    setCardOpen(false);
    if (persist) {
      dismissInstallPrompt();
      setSuppressed(true);
      setChromiumReady(false);
      deferred.current = null;
    }
  }, []);

  const promptInstall = useCallback(async () => {
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
      setCardOpen(false);
      dismissInstallPrompt();
      setSuppressed(true);
    }
  }, []);

  const value = useMemo<PwaInstallContextValue>(
    () => ({
      platform,
      chromiumReady: chromiumReady && !suppressed,
      cardOpen: cardOpen && !suppressed,
      installing,
      promptInstall,
      dismissCard,
      showHeaderInstall:
        !suppressed &&
        platform === "chromium" &&
        chromiumReady &&
        !isPwaStandalone(),
    }),
    [
      platform,
      chromiumReady,
      cardOpen,
      installing,
      promptInstall,
      dismissCard,
      suppressed,
    ],
  );

  return (
    <PwaInstallContext.Provider value={value}>
      {children}
    </PwaInstallContext.Provider>
  );
}
