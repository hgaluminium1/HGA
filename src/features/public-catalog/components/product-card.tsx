import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { localePath } from "@/config/nav.config";
import { productImageUrl } from "@/features/public-catalog/lib/product-media";
import type { ProductDTO } from "@/modules/catalog";
import { cn } from "@/lib/utils";

/** Catalogue index grid — 1 → 2 → 3 → 4 (Apple Store / Shopify density). */
export const PRODUCT_GRID_CLASS =
  "grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 min-[480px]:gap-4 min-[1024px]:grid-cols-3 min-[1440px]:grid-cols-4";

/**
 * Home / upcoming bands: snap strip on phones, 2–3 col grid from tablet up.
 * Pair with PRODUCT_BAND_ITEM_CLASS on each <li>.
 */
export const PRODUCT_BAND_LIST_CLASS = cn(
  "-mx-[var(--pad-inline)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--pad-inline)] pb-1",
  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  "min-[640px]:mx-0 min-[640px]:grid min-[640px]:grid-cols-2 min-[640px]:gap-4 min-[640px]:overflow-visible min-[640px]:px-0 min-[640px]:pb-0 min-[640px]:snap-none",
  "min-[1024px]:grid-cols-3",
);

export const PRODUCT_BAND_ITEM_CLASS =
  "w-[min(78vw,17.5rem)] shrink-0 snap-start min-[640px]:w-auto min-[640px]:min-w-0 min-[640px]:shrink";

type ProductCardProps = {
  locale: string;
  product: ProductDTO;
  className?: string;
  /** Emphasize pipeline cards on upcoming strips. */
  tone?: "default" | "pipeline";
};

/**
 * Catalogue card — media-first, minimal chrome (Apple / Stripe / Linear pattern).
 * Whole card is the hit target; no nested buttons.
 */
export function ProductCard({
  locale,
  product,
  className,
  tone = "default",
}: ProductCardProps) {
  const upcoming = Boolean(product.isUpcoming) || tone === "pipeline";
  const image = productImageUrl(product);
  const blurb = (product.description ?? "").trim();

  return (
    <Link
      href={localePath(locale, `products/${product.slug}`)}
      className={cn(
        "group flex h-full flex-col outline-none",
        "rounded-[var(--radius-lg)] focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2",
        className,
      )}
    >
      <span
        className={cn(
          "relative isolate block aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-bg-alt",
          "ring-1 ring-black/[0.06] transition-[box-shadow,transform] duration-300 ease-[var(--ease)]",
          "group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-md)] group-hover:ring-brand-blue/25",
          "group-focus-visible:-translate-y-0.5 group-focus-visible:shadow-[var(--shadow-md)]",
          upcoming && "bg-[linear-gradient(160deg,var(--bg-alt)_0%,rgb(3_66_171_/_0.06)_100%)]",
        )}
      >
        <Image
          src={image}
          alt={product.name.en}
          fill
          sizes="(min-width: 1440px) 18rem, (min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
          className={cn(
            "object-cover transition-transform duration-500 ease-[var(--ease)] group-hover:scale-[1.04]",
            upcoming && "opacity-90 saturate-[0.85]",
          )}
        />
        {upcoming ? (
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent px-3.5 pt-10 pb-3">
            <span className="text-[0.65rem] font-semibold tracking-[0.14em] text-white/90 uppercase">
              Coming soon
            </span>
          </span>
        ) : null}
      </span>

      <span className="flex flex-1 flex-col pt-3.5 min-[480px]:pt-4">
        <span className="font-display text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] font-semibold leading-snug text-ink text-balance">
          {product.name.en}
        </span>
        {blurb ? (
          <span className="text-muted-foreground mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed">
            {blurb}
          </span>
        ) : (
          <span className="flex-1" aria-hidden />
        )}
        <span className="text-brand-blue mt-3 inline-flex items-center gap-1 text-[0.8125rem] font-semibold tracking-tight">
          {upcoming ? "Register interest" : "View product"}
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </span>
    </Link>
  );
}

/** Lightweight home-band tile when only CMS item fields exist (fallback). */
export function ProductBandTile({
  locale,
  title,
  href,
  imageSrc,
  imageAlt,
  className,
}: {
  locale: string;
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}) {
  return (
    <Link
      href={localePath(locale, href)}
      className={cn(
        "group flex h-full flex-col outline-none",
        "rounded-[var(--radius-lg)] focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2",
        className,
      )}
    >
      <span className="relative isolate block aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-bg-alt ring-1 ring-black/[0.06] transition-[box-shadow,transform] duration-300 ease-[var(--ease)] group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-md)] group-hover:ring-brand-blue/25">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 85vw"
          className="object-cover transition-transform duration-500 ease-[var(--ease)] group-hover:scale-[1.04]"
        />
      </span>
      <span className="pt-3.5 min-[480px]:pt-4">
        <span className="font-display text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] font-semibold leading-snug text-ink">
          {title}
        </span>
        <span className="text-brand-blue mt-3 inline-flex items-center gap-1 text-[0.8125rem] font-semibold">
          View specs
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </span>
    </Link>
  );
}
