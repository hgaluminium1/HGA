"use client";

import Link from "next/link";

export function EntityHydratedPanel({
  title,
  help,
}: {
  title: string;
  help: string;
}) {
  return (
    <div className="border-line bg-surface rounded-lg border border-dashed p-4">
      <p className="text-[0.9375rem] font-semibold">{title}</p>
      <p className="text-muted-foreground mt-1.5 max-w-prose text-[0.8125rem] leading-snug">
        {help}
      </p>
      <p className="text-muted-foreground mt-3 text-[0.8125rem] leading-snug">
        This block is filled automatically from company or catalogue data. You
        can still publish the page so layout changes go live. Editing those
        records comes in a later tools wave.
      </p>
      <p className="mt-3 text-[0.8125rem]">
        <Link
          href="/admin/catalogue/products"
          className="font-semibold underline"
        >
          Catalogue
        </Link>{" "}
        stubs are ready for that work.
      </p>
    </div>
  );
}
