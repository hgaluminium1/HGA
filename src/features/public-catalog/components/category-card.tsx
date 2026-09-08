import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { localePath } from "@/config/nav.config";
import { CATALOGUE_PLACEHOLDER } from "@/lib/media/resolve-media-url";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  locale: string;
  href: string;
  title: string;
  description?: string;
  imageSrc?: string | null;
  className?: string;
};

export function CategoryCard({
  locale,
  href,
  title,
  description,
  imageSrc,
  className,
}: CategoryCardProps) {
  const image = imageSrc?.trim() || CATALOGUE_PLACEHOLDER;

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
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1440px) 18rem, (min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 ease-[var(--ease)] group-hover:scale-[1.04]"
        />
      </span>
      <span className="flex flex-1 flex-col pt-3.5 min-[480px]:pt-4">
        <span className="font-display text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] font-semibold leading-snug text-ink text-balance">
          {title}
        </span>
        {description ? (
          <span className="text-muted-foreground mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed">
            {description}
          </span>
        ) : (
          <span className="flex-1" aria-hidden />
        )}
        <span className="text-brand-blue mt-3 inline-flex items-center gap-1 text-[0.8125rem] font-semibold tracking-tight">
          View products
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </span>
    </Link>
  );
}
