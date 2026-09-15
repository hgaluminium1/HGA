"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EnquiryForm } from "@/features/public-site/components/enquiry-form";
import { cn } from "@/lib/utils";

type ProductQuoteSheetProps = {
  locale: string;
  productName: string;
  productSlug: string;
  label: string;
  className?: string;
};

/**
 * Controlled quote sheet — form exists only while open.
 * Never mounts inline in the page flow (no sticky rail).
 */
export function ProductQuoteSheet({
  locale,
  productName,
  productSlug,
  label,
  className,
}: ProductQuoteSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        size="default"
        className={cn("min-h-10 px-5", className)}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
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
    </>
  );
}
