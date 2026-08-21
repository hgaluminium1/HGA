import Image from "next/image";
import { Factory, Handshake, Leaf } from "lucide-react";

import { Eyebrow } from "@/components/atoms/eyebrow";
import { Reveal } from "@/components/atoms/reveal";
import type { HomeContent } from "@/features/public-home/content/home.en";

type JointVenturesSectionProps = {
  content: HomeContent["jointVentures"];
};

const iconMap = {
  handshake: Handshake,
  factory: Factory,
  leaf: Leaf,
} as const;

export function JointVenturesSection({ content }: JointVenturesSectionProps) {
  return (
    <section
      data-block="joint-ventures"
      id="infrastructure"
      className="relative text-white"
    >
      <div className="relative min-h-[420px]">
        <Image
          src={content.imageSrc}
          alt={content.imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(100deg,rgba(20,11,40,0.9)_10%,rgba(20,11,40,0.55)_60%)]"
          aria-hidden
        />

        <div className="absolute inset-0 z-[1] flex items-center px-[var(--pad-inline)]">
          <div className="mx-auto w-full max-w-[var(--container)]">
            <Reveal>
              <Eyebrow light>{content.eyebrow}</Eyebrow>
              <h2 className="text-fs-h2 mt-2.5">{content.title}</h2>
              <div className="shadow-brand-lg mt-7 grid max-w-[620px] gap-4 rounded-[var(--radius-lg)] bg-[rgb(255_255_255_/_0.96)] p-6 text-ink min-[640px]:grid-cols-3">
                {content.items.map((item) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-3.5 rounded-[var(--radius-sm)] p-2.5"
                    >
                      <span className="bg-brand-accent-light text-brand-accent-dark flex size-11 shrink-0 items-center justify-center rounded-[10px]">
                        <Icon className="size-5" />
                      </span>
                      <span>
                        <strong className="block text-[0.95rem] font-semibold">
                          {item.title}
                        </strong>
                        <small className="text-muted-foreground text-[0.8rem]">
                          {item.subtitle}
                        </small>
                      </span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
