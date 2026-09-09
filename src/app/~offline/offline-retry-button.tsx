"use client";

export function OfflineRetryButton() {
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dce3ef] bg-white px-5 text-sm font-semibold text-[#00122f]"
      onClick={() => window.location.reload()}
    >
      Retry
    </button>
  );
}
