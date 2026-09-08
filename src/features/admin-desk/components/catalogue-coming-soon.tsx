"use client";

/**
 * Catalogue Products / Categories CRUD is deferred.
 * Existing APIs: /api/v1/products, /api/v1/categories — reintroduce a dedicated
 * desk module after landing page sections ship.
 */
export function CatalogueComingSoon({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <h1 className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-muted-foreground max-w-prose text-sm leading-relaxed">
        {body}
      </p>
      <p className="border-line bg-surface rounded-[var(--radius-lg)] border border-dashed p-5 text-sm">
        Coming next — deep catalogue research and FAANG-grade product / category
        editors (separate from page sections).
      </p>
    </div>
  );
}
