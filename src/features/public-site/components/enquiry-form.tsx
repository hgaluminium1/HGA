"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EnquiryFormProps = {
  locale: string;
  defaultProduct?: string;
  className?: string;
};

/**
 * Industrial RFQ form — alloy / temper / tonnage / destination + contact.
 * Matches CMR / Hindalco-style enquiry density without retail fluff.
 */
export function EnquiryForm({
  locale,
  defaultProduct = "",
  className,
}: EnquiryFormProps) {
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
            alloy: String(data.get("alloy") ?? ""),
            temper: String(data.get("temper") ?? ""),
            monthlyTonnage: String(data.get("monthlyTonnage") ?? ""),
            destination: String(data.get("destination") ?? ""),
            message: String(data.get("message") ?? ""),
            locale,
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

  const field =
    "border-line bg-surface mt-1.5 min-h-11 w-full rounded-[var(--radius-md)] border px-3 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15";
  const label = "block text-[0.8125rem] font-medium text-ink";

  return (
    <form onSubmit={onSubmit} className={cn(className)}>
      <div className="grid gap-4 min-[640px]:grid-cols-2">
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
      </div>

      <p className="text-muted-foreground mt-6 text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
        Programme details
      </p>
      <div className="mt-3 grid gap-4 min-[640px]:grid-cols-2">
        <label className={label}>
          Product line
          <input
            name="productInterest"
            defaultValue={defaultProduct}
            className={field}
            placeholder="Extrusion · billets · ingots"
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
          <input name="temper" className={field} placeholder="e.g. T5, T6, F" />
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
      </div>

      <label className={cn(label, "mt-4")}>
        Notes *
        <textarea
          name="message"
          required
          rows={4}
          className={`${field} min-h-[7rem] py-2`}
          placeholder="Section / die, packing, certificates, delivery window…"
        />
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="submit" className="min-h-11" disabled={pending}>
          {pending ? "Sending…" : "Submit RFQ"}
        </Button>
        {status === "ok" ? (
          <p className="text-sm text-teal-700">
            Received — sales will respond with feasibility and lead time.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}
      </div>
    </form>
  );
}
