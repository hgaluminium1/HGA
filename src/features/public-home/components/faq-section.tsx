"use client";

import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { HomeContent } from "@/features/public-home/content/home.en";

type FaqSectionProps = {
  content: HomeContent["faq"];
};

export function FaqSection({ content }: FaqSectionProps) {
  return (
    <Section data-block="faq" alt>
      <Container>
        <Reveal>
          <SectionHeader
            center
            eyebrow={content.eyebrow}
            title={content.title}
          />
        </Reveal>

        <Reveal>
          <div className="mx-auto max-w-[46rem]">
            <Accordion defaultValue={["item-0"]} className="gap-2.5">
              {content.items.map((item, i) => (
                <AccordionItem
                  key={item.question}
                  value={`item-${i}`}
                  className="border-line bg-surface overflow-hidden rounded-[var(--radius-md)] border px-3 not-last:border-b min-[480px]:px-4"
                >
                  <AccordionTrigger className="min-h-12 py-3.5 text-left text-[clamp(0.92rem,0.88rem+0.2vw,1rem)] font-semibold hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground max-w-[68ch] pb-4 text-[0.94rem] leading-relaxed">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
