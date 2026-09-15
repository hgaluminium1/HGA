"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { EnquiryForm } from "@/features/public-site/components/enquiry-form";
import { cn } from "@/lib/utils";

type ProductRfqDialogProps = {
  locale: string;
  productName: string;
  productSlug: string;
  label: string;
  className?: string;
};

/**
 * FAANG / Linear-style conversion for desktop + mobile:
 * one primary CTA → modal form. Never a sticky sidebar rail.
 */
export function ProductRfqDialog({
  locale,
  productName,
  productSlug,
  label,
  className,
}: ProductRfqDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          buttonVariants({ size: "default" }),
          "min-h-10 px-5",
          className,
        )}
      >
        {label}
      </DialogTrigger>
      <DialogContent
        className="max-h-[min(90dvh,42rem)] w-[min(100%,28rem)] gap-3 overflow-y-auto sm:max-w-md"
        showCloseButton
      >
        <DialogHeader className="gap-1 pr-8 text-left">
          <DialogTitle className="font-display text-base font-semibold text-ink">
            {label}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-[0.8125rem] leading-snug">
            {productName} — alloy, tonnage, destination. Sales confirms lead
            time.
          </DialogDescription>
        </DialogHeader>
        <EnquiryForm
          locale={locale}
          defaultProduct={productName}
          productSlug={productSlug}
          source="product"
          density="compact"
          className="@container"
        />
      </DialogContent>
    </Dialog>
  );
}
