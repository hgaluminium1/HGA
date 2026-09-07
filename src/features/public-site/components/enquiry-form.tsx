"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

type EnquiryFormProps = {
  locale: string;
  defaultProduct?: string;
  className?: string;
};

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
    "border-line bg-surface mt-1.5 min-h-11 w-full rounded-[var(--radius-md)] border px-3 text-sm outline-none focus:border-brand-blue";

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="grid gap-4 min-[640px]:grid-cols-2">
        <label className="block text-sm font-medium">
          Name *
          <input name="name" required className={field} autoComplete="name" />
        </label>
        <label className="block text-sm font-medium">
          Company
          <input name="company" className={field} autoComplete="organization" />
        </label>
        <label className="block text-sm font-medium">
          Email *
          <input
            name="email"
            type="email"
            required
            className={field}
            autoComplete="email"
          />
        </label>
        <label className="block text-sm font-medium">
          Phone
          <input name="phone" className={field} autoComplete="tel" />
        </label>
      </div>
      <label className="mt-4 block text-sm font-medium">
        Product interest
        <input
          name="productInterest"
          defaultValue={defaultProduct}
          className={field}
          placeholder="Extrusion profiles, billets, ingots…"
        />
      </label>
      <label className="mt-4 block text-sm font-medium">
        Message *
        <textarea
          name="message"
          required
          rows={5}
          className={`${field} min-h-[8rem] py-2`}
          placeholder="Alloy, temper, quantity, destination…"
        />
      </label>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="submit" className="min-h-11" disabled={pending}>
          {pending ? "Sending…" : "Send enquiry"}
        </Button>
        {status === "ok" ? (
          <p className="text-sm text-teal-600">
            Thank you — our team will respond shortly.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}
      </div>
    </form>
  );
}
