import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { buttonVariants } from "@/components/ui/button";
import { localePath } from "@/config/nav.config";
import { cn } from "@/lib/utils";

type CmsEmptyStateProps = {
  locale: string;
  title?: string;
};

export function CmsEmptyState({
  locale,
  title = "This page isn’t published yet.",
}: CmsEmptyStateProps) {
  return (
    <Section>
      <Container>
        <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl text-fs-lead">
          Content will appear here once an editor publishes this page in Admin.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={localePath(locale, "")}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to Home
          </Link>
          <Link
            href={localePath(locale, "contact")}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Contact / RFQ
          </Link>
        </div>
      </Container>
    </Section>
  );
}
