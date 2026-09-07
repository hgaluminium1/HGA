import Image from "next/image";
import { Factory, Handshake, Leaf } from "lucide-react";

import { Container } from "@/components/atoms/container";
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
      <div className="relative min-h-[clamp(26rem,70vw,32rem)] min-[768px]:min-h-[28rem]">
        <Image
          src={content.imageSrc}
          alt={content.imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(110deg,rgb(0_18_47_/_0.92)_8%,rgb(0_18_47_/_0.55)_70%)]"
          aria-hidden
        />

        <div className="absolute inset-0 z-[1] flex items-end py-[clamp(2rem,5vw,3.5rem)] min-[768px]:items-center">
          <Container>
            <Reveal>
              <Eyebrow light>{content.eyebrow}</Eyebrow>
              <h2 className="font-display mt-2.5 max-w-[18ch] text-[clamp(1.55rem,1.2rem+1.5vw,2.5rem)] font-semibold leading-[1.12] text-balance">
                {content.title}
              </h2>
              <ul className="mt-6 grid max-w-[40rem] gap-3 rounded-[var(--radius-lg)] bg-white p-4 text-ink shadow-[var(--shadow-lg)] min-[560px]:grid-cols-3 min-[560px]:gap-2 min-[560px]:p-5">
                {content.items.map((item) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <li
                      key={item.title}
                      className="flex items-start gap-3 rounded-[var(--radius-sm)] p-2 min-[560px]:flex-col min-[560px]:items-start"
                    >
                      <span className="bg-brand-blue-light text-brand-blue flex size-10 shrink-0 items-center justify-center rounded-[10px]">
                        <Icon className="size-5" />
                      </span>
                      <span>
                        <strong className="block text-[0.92rem] font-semibold">
                          {item.title}
                        </strong>
                        <small className="text-muted-foreground mt-0.5 block text-[0.78rem] leading-snug">
                          {item.subtitle}
                        </small>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </Container>
        </div>
      </div>
    </section>
  );
}
