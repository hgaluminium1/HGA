"use client";

import { useId } from "react";
import { Download, Share, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";
import { usePwaInstall } from "@/features/public-site/components/pwa-install-provider";
import { cn } from "@/lib/utils";

/** Compact header Install — shown as soon as Chromium BIP is ready. */
export function PwaHeaderInstallButton({
  className,
}: {
  className?: string;
}) {
  const ctx = usePwaInstall();
  if (!ctx?.showHeaderInstall) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      data-pwa-install-ui
      className={cn(
        "text-brand-blue hidden h-9 gap-1.5 px-2.5 text-[0.8125rem] font-semibold min-[560px]:inline-flex",
        className,
      )}
      disabled={ctx.installing}
      onClick={() => void ctx.promptInstall()}
    >
      <Download className="size-3.5" aria-hidden />
      {ctx.installing ? "Installing…" : "Install"}
    </Button>
  );
}

/**
 * Bottom card after light engagement (3.5s / 80px scroll / interaction).
 * Chromium: install CTA. iOS: A2HS instructions.
 */
export function PwaInstallPrompt() {
  const titleId = useId();
  const ctx = usePwaInstall();
  if (!ctx?.cardOpen) return null;

  const { platform, installing, promptInstall, dismissCard } = ctx;
  const isIos = platform === "ios-safari" || platform === "ios-other";

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] min-[720px]:p-4"
      role="presentation"
      data-pwa-install-ui
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
            onClick={() => dismissCard(true)}
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
              onClick={() => dismissCard(true)}
            >
              Not now
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={installing}
              onClick={() => void promptInstall()}
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
              onClick={() => dismissCard(true)}
            >
              Got it
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
