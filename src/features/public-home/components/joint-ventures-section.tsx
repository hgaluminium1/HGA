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
      <div className="relative min-h-[clamp(26rem,72vw,34rem)] min-[900px]:min-h-[30rem]">
        <Image
          src={content.imageSrc}
          alt={content.imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(105deg,rgb(0_18_47_/_0.94)_0%,rgb(0_18_47_/_0.72)_48%,rgb(0_18_47_/_0.35)_100%)]"
          aria-hidden
        />

        <div className="absolute inset-0 z-[1] flex items-end py-[clamp(2.25rem,5vw,3.75rem)] min-[900px]:items-center">
          <Container>
            <Reveal>
              <div className="grid max-w-[52rem] gap-8 min-[900px]:grid-cols-[1.2fr_1fr] min-[900px]:items-end min-[900px]:gap-12">
                <div>
                  <Eyebrow light>{content.eyebrow}</Eyebrow>
                  <h2 className="font-display mt-2.5 text-[clamp(1.55rem,1.2rem+1.5vw,2.5rem)] font-semibold leading-[1.12] text-balance">
                    {content.title}
                  </h2>
                </div>
                <ul className="flex flex-col gap-4 border-t border-white/20 pt-5 min-[900px]:border-t-0 min-[900px]:border-l min-[900px]:pt-0 min-[900px]:pl-8">
                  {content.items.map((item) => {
                    const Icon = iconMap[item.icon];
                    return (
                      <li key={item.title} className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-white/12 text-white">
                          <Icon className="size-4" />
                        </span>
                        <span>
                          <strong className="block text-[0.9375rem] font-semibold">
                            {item.title}
                          </strong>
                          <small className="mt-0.5 block text-[0.8rem] leading-snug text-white/65">
                            {item.subtitle}
                          </small>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          </Container>
        </div>
      </div>
    </section>
  );
}
