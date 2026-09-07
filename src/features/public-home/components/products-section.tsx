import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import { localePath } from "@/config/nav.config";
import type { HomeContent } from "@/features/public-home/content/home.en";
import { cn } from "@/lib/utils";

type ProductsSectionProps = {
  locale: string;
  content: HomeContent["products"];
};

export function ProductsSection({ locale, content }: ProductsSectionProps) {
  const items = content.items ?? [];
  const cols =
    items.length >= 3
      ? "min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3"
      : items.length === 2
        ? "min-[640px]:grid-cols-2"
        : "";

  return (
    <Section data-block="products" id="products">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={content.eyebrow}
            title={content.title}
            description={
              content.description ||
              (items.length
                ? undefined
                : "Catalogue products will appear here once published in admin.")
            }
          />
        </Reveal>

        {items.length ? (
          <Reveal stagger>
            <div className={cn("grid gap-4 min-[640px]:gap-5", cols)}>
              {items.map((item) => (
                <Link
                  key={item.title}
                  href={localePath(locale, item.href)}
                  className="shadow-brand-sm group relative flex aspect-[5/4] min-h-[14rem] items-end overflow-hidden rounded-[var(--radius-lg)] transition-[box-shadow,transform] duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] focus-within:-translate-y-0.5 focus-within:shadow-[var(--shadow-lg)] min-[640px]:min-h-0"
                >
                  <span className="absolute inset-0">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-[var(--ease)] group-hover:scale-[1.06]"
                    />
                    <span
                      className="absolute inset-0 bg-[linear-gradient(0deg,rgb(0_18_47_/_0.82)_0%,rgb(0_18_47_/_0.15)_55%)]"
                      aria-hidden
                    />
                  </span>
                  <span className="relative z-[1] flex w-full items-end justify-between gap-3 p-4 text-white min-[480px]:p-5">
                    <span className="min-w-0">
                      <span className="block text-[0.68rem] font-bold tracking-[0.12em] text-brand-red uppercase">
                        Product
                      </span>
                      <strong className="font-display mt-1.5 block text-[clamp(1.05rem,0.95rem+0.4vw,1.25rem)] font-semibold leading-snug">
                        {item.title}
                      </strong>
                    </span>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/12 transition-[background,transform] duration-300 group-hover:rotate-45 group-hover:bg-brand-red">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        ) : null}

        <p className="mt-8">
          <Link
            href={localePath(locale, "products")}
            className="text-brand-blue text-sm font-semibold hover:underline"
          >
            View full catalogue →
          </Link>
        </p>
      </Container>
    </Section>
  );
}
