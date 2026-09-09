import Link from "next/link";
import type { Metadata } from "next";

import { OfflineRetryButton } from "@/app/~offline/offline-retry-button";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: "You’re offline",
  robots: { index: false, follow: false },
};

/**
 * Precached offline fallback (architecture §29).
 * Shown for navigations when the network is unavailable.
 */
export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#f5f7fb] px-6 text-center">
      <p className="text-[0.7rem] font-bold tracking-[0.16em] text-[#0342ab] uppercase">
        {siteConfig.shortName}
      </p>
      <h1 className="mt-3 max-w-[20ch] text-[1.75rem] font-semibold tracking-[-0.02em] text-[#00122f]">
        You’re offline
      </h1>
      <p className="mt-3 max-w-[36ch] text-[0.95rem] leading-relaxed text-[#5b657a]">
        This page isn’t available without a connection. Pages you’ve already
        opened may still work — reconnect and try again.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/en"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#e80115] px-5 text-sm font-semibold text-white"
        >
          Go to home
        </Link>
        <OfflineRetryButton />
      </div>
    </main>
  );
}
