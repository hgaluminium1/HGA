"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  fetchCompany,
  upsertCompanyApi,
} from "@/features/admin-corporate/lib/api";

const emptyAddress = {
  line1: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export function CompanyProfileForm() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["corporate-company"],
    queryFn: fetchCompany,
  });

  const [legalName, setLegalName] = useState("");
  const [displayPrimary, setDisplayPrimary] = useState("");
  const [cin, setCin] = useState("");
  const [gst, setGst] = useState("");
  const [salesEmail, setSalesEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const p = query.data;
    if (!p) {
      setLegalName("");
      setDisplayPrimary("");
      setCin("");
      setGst("");
      setSalesEmail("");
      return;
    }
    setLegalName(p.legalName);
    setDisplayPrimary(p.displayNames.primary);
    setCin(p.cin);
    setGst(p.gst);
    setSalesEmail(p.emails.sales);
  }, [query.data]);

  const saveMut = useMutation({
    mutationFn: () => {
      const existing = query.data;
      return upsertCompanyApi({
        legalName: legalName.trim(),
        displayNames: {
          primary: displayPrimary.trim(),
          alsoMention: existing?.displayNames.alsoMention ?? [],
        },
        cin: cin.trim(),
        gst: gst.trim(),
        registeredOffice: existing?.registeredOffice ?? emptyAddress,
        factoryAddress: existing?.factoryAddress ?? emptyAddress,
        phones: existing?.phones ?? [],
        emails: {
          sales: salesEmail.trim(),
          export: existing?.emails.export ?? "",
          purchase: existing?.emails.purchase ?? "",
          investor: existing?.emails.investor ?? "",
          hr: existing?.emails.hr ?? "",
          quality: existing?.emails.quality ?? "",
        },
        logo: existing?.logo,
        brandColors: existing?.brandColors,
        locale: existing?.locale ?? "en",
        version: existing?.version ?? 0,
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["corporate-company"] });
      setMsg("Saved.");
    },
    onError: (err: Error) => setMsg(err.message),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Company profile
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Legal identity and sales contact for public corporate surfaces.
      </p>

      {query.isLoading ? (
        <p className="text-muted-foreground mt-8 text-sm">Loading…</p>
      ) : null}
      {query.isError ? (
        <p className="mt-8 text-sm text-destructive">
          {(query.error as Error).message}
        </p>
      ) : null}

      {!query.isLoading && !query.isError ? (
        <form
          className="border-line bg-surface mt-6 max-w-xl space-y-3 rounded-[var(--radius-lg)] border p-4"
          onSubmit={(e) => {
            e.preventDefault();
            setMsg(null);
            saveMut.mutate();
          }}
        >
          <label className="block text-sm">
            Legal name
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm">
            Display name
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={displayPrimary}
              onChange={(e) => setDisplayPrimary(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm">
            CIN
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={cin}
              onChange={(e) => setCin(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            GST
            <input
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Sales email
            <input
              type="email"
              className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
              value={salesEmail}
              onChange={(e) => setSalesEmail(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              type="submit"
              className="min-h-11"
              disabled={
                !legalName.trim() ||
                !displayPrimary.trim() ||
                saveMut.isPending
              }
            >
              {saveMut.isPending ? "Saving…" : "Save"}
            </Button>
            {query.data ? (
              <span className="text-muted-foreground text-xs">
                v{query.data.version}
              </span>
            ) : (
              <span className="text-muted-foreground text-xs">
                New profile
              </span>
            )}
          </div>
          {msg ? (
            <p className="text-muted-foreground text-sm" role="status">
              {msg}
            </p>
          ) : null}
          {saveMut.isError ? (
            <p className="text-sm text-destructive">
              {(saveMut.error as Error).message}
            </p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
