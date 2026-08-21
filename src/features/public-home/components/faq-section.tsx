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
          <div className="mx-auto max-w-[820px]">
            <Accordion defaultValue={["item-0"]} className="gap-3">
              {content.items.map((item, i) => (
                <AccordionItem
                  key={item.question}
                  value={`item-${i}`}
                  className="border-line bg-surface overflow-hidden rounded-[var(--radius-md)] border px-3 not-last:border-b-0"
                >
                  <AccordionTrigger className="py-[1.15rem] text-[0.98rem] font-semibold hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground max-w-[68ch] pb-4 text-[0.94rem]">
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
