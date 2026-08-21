import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import { buttonVariants } from "@/components/ui/button";
import { localePath } from "@/config/nav.config";
import { cn } from "@/lib/utils";

type PageShellProps = {
  locale: string;
  title: string;
  description: string;
  eyebrow?: string;
};

export function PageShell({
  locale,
  title,
  description,
  eyebrow = "Coming soon",
}: PageShellProps) {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <p className="text-muted-foreground max-w-2xl text-fs-lead">
          This page shell is ready for CMS content in Phase 2+. Shared chrome,
          tokens, and navigation already match the Home visual system.
        </p>
        <div className="mt-8">
          <Link
            href={localePath(locale, "contact")}
            className={cn(buttonVariants({ variant: "default", size: "default" }))}
          >
            Contact / RFQ
          </Link>
        </div>
      </Container>
    </Section>
  );
}
