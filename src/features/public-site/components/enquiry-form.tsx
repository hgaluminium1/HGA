"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EnquiryFormProps = {
  locale: string;
  defaultProduct?: string;
  productSlug?: string;
  source?: "contact" | "product" | "header";
  className?: string;
  /** Dense sidebar RFQ — fewer fields, tighter spacing (PDP pattern). */
  density?: "default" | "compact";
};

/**
 * Industrial RFQ form — alloy / temper / tonnage / destination + contact.
 * Persists to Admin → Leads and notifies sales via Resend.
 */
export function EnquiryForm({
  locale,
  defaultProduct = "",
  productSlug,
  source = "contact",
  className,
  density = "default",
}: EnquiryFormProps) {
  const compact = density === "compact";
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("idle");
    setError("");
    startTransition(async () => {
      try {
        const res = await fetch("/api/v1/enquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: String(data.get("name") ?? ""),
            company: String(data.get("company") ?? ""),
            email: String(data.get("email") ?? ""),
            phone: String(data.get("phone") ?? ""),
            productInterest: String(data.get("productInterest") ?? ""),
            productSlug: productSlug ?? null,
            alloy: String(data.get("alloy") ?? ""),
            temper: String(data.get("temper") ?? ""),
            monthlyTonnage: String(data.get("monthlyTonnage") ?? ""),
            destination: String(data.get("destination") ?? ""),
            message: String(data.get("message") ?? ""),
            locale,
            source: productSlug ? "product" : source,
            website: String(data.get("website") ?? ""),
          }),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as {
            error?: { message?: string };
          } | null;
          throw new Error(body?.error?.message || "Could not send enquiry");
        }
        setStatus("ok");
        form.reset();
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  const field = cn(
    "border-line bg-surface mt-1 w-full rounded-[var(--radius-md)] border px-2.5 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15",
    compact ? "min-h-9" : "mt-1.5 min-h-11 px-3",
  );
  const label = cn(
    "block font-medium text-ink",
    compact ? "text-[0.75rem]" : "text-[0.8125rem]",
  );

  return (
    <form onSubmit={onSubmit} className={cn("relative", className)}>
      <div
        className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
        aria-hidden
      >
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <input type="hidden" name="productInterest" value={defaultProduct} />

      <div
        className={cn(
          "grid",
          compact ? "gap-2.5" : "gap-4 min-[640px]:grid-cols-2",
        )}
      >
        <label className={label}>
          Name *
          <input name="name" required className={field} autoComplete="name" />
        </label>
        <label className={label}>
          Company
          <input name="company" className={field} autoComplete="organization" />
        </label>
        <label className={label}>
          Email *
          <input
            name="email"
            type="email"
            required
            className={field}
            autoComplete="email"
          />
        </label>
        <label className={label}>
          Phone
          <input name="phone" className={field} autoComplete="tel" />
        </label>

        {!compact ? (
          <>
            <label className={label}>
              Product line
              <input
                name="productInterestVisible"
                defaultValue={defaultProduct}
                className={field}
                placeholder="Extrusion · billets · ingots"
                onChange={(e) => {
                  const hidden = e.currentTarget.form?.elements.namedItem(
                    "productInterest",
                  ) as HTMLInputElement | null;
                  if (hidden) hidden.value = e.target.value;
                }}
              />
            </label>
            <label className={label}>
              Alloy grade
              <input
                name="alloy"
                className={field}
                placeholder="e.g. 6063, ADC12"
              />
            </label>
            <label className={label}>
              Temper
              <input
                name="temper"
                className={field}
                placeholder="e.g. T5, T6, F"
              />
            </label>
            <label className={label}>
              Monthly tonnage
              <input
                name="monthlyTonnage"
                className={field}
                placeholder="e.g. 40 MT / month"
              />
            </label>
            <label className={cn(label, "min-[640px]:col-span-2")}>
              Destination / plant
              <input
                name="destination"
                className={field}
                placeholder="City, state or export port"
              />
            </label>
          </>
        ) : (
          <>
            <label className={label}>
              Alloy / temper
              <input
                name="alloy"
                className={field}
                placeholder="e.g. 6063 · T6"
              />
            </label>
            <input type="hidden" name="temper" value="" />
            <label className={label}>
              Monthly tonnage
              <input
                name="monthlyTonnage"
                className={field}
                placeholder="e.g. 40 MT / month"
              />
            </label>
            <label className={label}>
              Destination
              <input
                name="destination"
                className={field}
                placeholder="City or export port"
              />
            </label>
          </>
        )}
      </div>

      <label className={cn(label, compact ? "mt-2.5" : "mt-4")}>
        Notes *
        <textarea
          name="message"
          required
          rows={compact ? 3 : 4}
          className={cn(field, compact ? "min-h-[4.5rem] py-2" : "min-h-[7rem] py-2")}
          placeholder={
            compact
              ? "Quantity, packing, certificates…"
              : "Section / die, packing, certificates, delivery window…"
          }
        />
      </label>

      <div
        className={cn(
          "flex flex-wrap items-center gap-2",
          compact ? "mt-3" : "mt-6 gap-3",
        )}
      >
        <Button
          type="submit"
          size={compact ? "sm" : "default"}
          className={compact ? "w-full min-h-9" : "min-h-11"}
          disabled={pending}
        >
          {pending ? "Sending…" : compact ? "Send RFQ" : "Submit RFQ"}
        </Button>
        {status === "ok" ? (
          <p className="text-xs text-teal-700 sm:text-sm">
            Received — sales will follow up.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-xs text-destructive sm:text-sm">{error}</p>
        ) : null}
      </div>
    </form>
  );
}
