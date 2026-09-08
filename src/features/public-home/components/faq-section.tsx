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
        <div className="grid gap-8 min-[900px]:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] min-[900px]:gap-14">
          <Reveal>
            <SectionHeader
              eyebrow={content.eyebrow}
              title={content.title}
              className="mb-0 max-w-none"
            />
          </Reveal>

          <Reveal>
            <Accordion
              defaultValue={["item-0"]}
              className="divide-y divide-black/[0.08] border-y border-black/[0.08]"
            >
              {content.items.map((item, i) => (
                <AccordionItem
                  key={item.question}
                  value={`item-${i}`}
                  className="border-0 px-0 not-last:border-b-0"
                >
                  <AccordionTrigger className="min-h-12 py-4 text-left text-[clamp(0.95rem,0.9rem+0.2vw,1.05rem)] font-semibold hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground max-w-[68ch] pb-5 text-[0.9375rem] leading-relaxed">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
