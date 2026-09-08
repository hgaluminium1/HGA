"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  fetchCompany,
  upsertCompanyApi,
} from "@/features/admin-corporate/lib/api";
import type { CompanyLocationDTO } from "@/modules/corporate";

const emptyAddress = {
  line1: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

function mapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function mapsEmbedUrl(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
}

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
  const [locations, setLocations] = useState<CompanyLocationDTO[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const p = query.data;
    if (!p) {
      setLegalName("");
      setDisplayPrimary("");
      setCin("");
      setGst("");
      setSalesEmail("");
      setLocations([]);
      return;
    }
    setLegalName(p.legalName);
    setDisplayPrimary(p.displayNames.primary);
    setCin(p.cin);
    setGst(p.gst);
    setSalesEmail(p.emails.sales);
    setLocations(p.locations ?? []);
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
        locations: locations.map((l, order) => ({ ...l, order })),
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

  function addLocation() {
    const id = `loc-${crypto.randomUUID().slice(0, 8)}`;
    setLocations((prev) => [
      ...prev,
      {
        id,
        label: "Office",
        address: "",
        mapsUrl: "",
        embedUrl: "",
        order: prev.length,
      },
    ]);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Company profile
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Legal identity, sales contact, and N map locations for the Contact page.
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
          className="border-line bg-surface mt-6 max-w-2xl space-y-4 rounded-[var(--radius-lg)] border p-4"
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

          <div className="border-line space-y-3 border-t pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold">Map locations (Contact)</h2>
              <Button
                type="button"
                variant="outline"
                className="ml-auto min-h-11"
                onClick={addLocation}
              >
                Add location
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Paste a Google Maps link or type an address — embed is filled
              automatically when address is set.
            </p>
            {locations.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No locations yet. Add at least one for the Contact map.
              </p>
            ) : null}
            {locations.map((loc, index) => (
              <div
                key={loc.id}
                className="border-line space-y-2 rounded-[var(--radius-md)] border p-3"
              >
                <label className="block text-sm">
                  Label
                  <input
                    className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
                    value={loc.label}
                    onChange={(e) =>
                      setLocations((prev) =>
                        prev.map((l, i) =>
                          i === index ? { ...l, label: e.target.value } : l,
                        ),
                      )
                    }
                  />
                </label>
                <label className="block text-sm">
                  Address
                  <textarea
                    className="border-line mt-1 min-h-20 w-full rounded-[var(--radius-md)] border px-3 py-2"
                    value={loc.address}
                    onChange={(e) => {
                      const address = e.target.value;
                      setLocations((prev) =>
                        prev.map((l, i) =>
                          i === index
                            ? {
                                ...l,
                                address,
                                mapsUrl: address.trim()
                                  ? mapsSearchUrl(address)
                                  : l.mapsUrl,
                                embedUrl: address.trim()
                                  ? mapsEmbedUrl(address)
                                  : l.embedUrl,
                              }
                            : l,
                        ),
                      );
                    }}
                  />
                </label>
                <label className="block text-sm">
                  Open in Maps URL
                  <input
                    className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
                    value={loc.mapsUrl}
                    onChange={(e) =>
                      setLocations((prev) =>
                        prev.map((l, i) =>
                          i === index ? { ...l, mapsUrl: e.target.value } : l,
                        ),
                      )
                    }
                  />
                </label>
                <label className="block text-sm">
                  Embed URL (iframe src)
                  <input
                    className="border-line mt-1 min-h-11 w-full rounded-[var(--radius-md)] border px-3"
                    value={loc.embedUrl}
                    onChange={(e) =>
                      setLocations((prev) =>
                        prev.map((l, i) =>
                          i === index ? { ...l, embedUrl: e.target.value } : l,
                        ),
                      )
                    }
                  />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  className="min-h-11"
                  onClick={() =>
                    setLocations((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

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
              <span className="text-muted-foreground text-xs">New profile</span>
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
