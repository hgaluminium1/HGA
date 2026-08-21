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
  return (
    <Section data-block="products" id="products">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </Reveal>

        <Reveal stagger>
          <div className="grid gap-5 min-[720px]:grid-cols-2">
            {content.items.map((item) => (
              <Link
                key={item.title}
                href={localePath(locale, item.href)}
                className={cn(
                  "shadow-brand-sm group relative flex min-h-[300px] items-end overflow-hidden rounded-[var(--radius-lg)] transition-[box-shadow,transform] duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] focus-within:-translate-y-1 focus-within:shadow-[var(--shadow-lg)]",
                  item.wide &&
                    "min-[720px]:col-span-2 min-[720px]:min-h-[220px]",
                )}
              >
                <span className="absolute inset-0">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes={
                      item.wide
                        ? "(min-width: 720px) 80rem, 100vw"
                        : "(min-width: 720px) 40rem, 100vw"
                    }
                    className="object-cover transition-transform duration-500 ease-[var(--ease)] group-hover:scale-[1.08]"
                  />
                  <span
                    className="absolute inset-0 bg-[linear-gradient(0deg,rgba(15,8,30,0.75)_0%,rgba(15,8,30,0)_55%)]"
                    aria-hidden
                  />
                </span>
                <span className="relative z-[1] flex w-full items-end justify-between gap-3 p-5 text-white">
                  <span>
                    <span className="block text-[0.72rem] font-bold tracking-[0.1em] text-gold uppercase">
                      Our Product
                    </span>
                    <strong className="font-display mt-1.5 block text-[1.18rem] font-semibold">
                      {item.title}
                    </strong>
                  </span>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/15 transition-[background,transform] duration-300 ease-[var(--ease)] group-hover:rotate-45 group-hover:bg-brand-accent">
                    <ArrowUpRight className="size-4 text-white" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
