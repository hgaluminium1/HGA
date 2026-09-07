import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { localePath } from "@/config/nav.config";
import { productImageUrl } from "@/features/public-catalog/lib/product-media";
import type { ProductDTO } from "@/modules/catalog";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  locale: string;
  product: ProductDTO;
  className?: string;
};

export function ProductCard({ locale, product, className }: ProductCardProps) {
  const upcoming = Boolean(product.isUpcoming);
  const image = productImageUrl(product);
  const alloyPreview = product.alloyGrades.slice(0, 3).join(" · ");

  return (
    <Link
      href={localePath(locale, `products/${product.slug}`)}
      className={cn(
        "border-line bg-surface group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-[var(--shadow-md)]",
        className,
      )}
    >
      <span className="relative block aspect-[16/10] overflow-hidden bg-bg-alt">
        <Image
          src={image}
          alt={product.name.en}
          fill
          sizes="(min-width: 1024px) 25rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {upcoming ? (
          <span className="absolute top-3 left-3 rounded-full bg-ink/90 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-brand-red uppercase">
            Coming soon
          </span>
        ) : (
          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-brand-blue uppercase shadow-sm">
            Catalogue
          </span>
        )}
      </span>
      <span className="flex flex-1 flex-col p-4 min-[480px]:p-5">
        <span className="font-display text-[clamp(1.05rem,0.98rem+0.3vw,1.2rem)] font-semibold text-ink">
          {product.name.en}
        </span>
        <span className="text-muted-foreground mt-1 block text-sm">
          {product.sku}
        </span>
        {alloyPreview ? (
          <span className="text-brand-blue mt-2 block text-xs font-semibold tracking-wide">
            {alloyPreview}
            {product.alloyGrades.length > 3 ? " +" : ""}
          </span>
        ) : null}
        {product.description ? (
          <span className="text-muted-foreground mt-2 line-clamp-2 flex-1 text-sm leading-relaxed">
            {product.description}
          </span>
        ) : (
          <span className="flex-1" />
        )}
        <span
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "mt-4 inline-flex w-fit",
          )}
        >
          {upcoming ? "Register interest" : "View specs"}
        </span>
      </span>
    </Link>
  );
}
