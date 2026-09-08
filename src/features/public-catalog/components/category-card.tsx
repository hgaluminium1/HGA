import Image from "next/image";
import Link from "next/link";

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
        "border-line bg-surface group relative flex h-full min-h-11 flex-col overflow-hidden rounded-[var(--radius-lg)] border transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-[var(--shadow-md)]",
        className,
      )}
    >
      <span className="relative block aspect-[16/10] overflow-hidden bg-bg-alt">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1440px) 20rem, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      <span className="flex flex-1 flex-col p-4 min-[480px]:p-5">
        <span className="font-display text-[clamp(1.05rem,0.98rem+0.3vw,1.25rem)] font-semibold text-ink">
          {title}
        </span>
        {description ? (
          <span className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
            {description}
          </span>
        ) : null}
        <span className="text-brand-blue mt-4 text-sm font-semibold">
          View products →
        </span>
      </span>
    </Link>
  );
}
