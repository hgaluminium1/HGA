"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";

import { BrandLockup } from "@/components/molecules/brand-lockup";
import { Button } from "@/components/ui/button";
import { CloudinaryPicker } from "@/features/admin-desk/components/cloudinary-picker";
import { DeskBackLink } from "@/features/admin-desk/components/desk-back-link";
import { DeskSaveBar } from "@/features/admin-desk/components/desk-save-bar";
import {
  CorporateField,
  corporateInputClass,
} from "@/features/admin-desk/components/corporate-form-ui";
import {
  ApiClientError,
  fetchCompanyApi,
  updateCompanyApi,
} from "@/features/admin-desk/lib/corporate-api";
import type {
  Address,
  CompanyProfileDTO,
  SocialLinkDTO,
  SocialPlatform,
} from "@/modules/corporate/browser";
import { cn } from "@/lib/utils";

type Draft = {
  legalName: string;
  displayPrimary: string;
  alsoMention: string;
  cin: string;
  gst: string;
  registeredOffice: Address;
  factoryAddress: Address;
  phoneSales: string;
  phoneFactory: string;
  emailSales: string;
  emailExport: string;
  emailPurchase: string;
  emailInvestor: string;
  emailHr: string;
  emailQuality: string;
};

const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X (Twitter)" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "other", label: "Other" },
];

function emptyAddress(): Address {
  return {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  };
}

function fromProfile(p: CompanyProfileDTO): Draft {
  const salesPhone =
    p.phones.find((x) => /sales/i.test(x.label))?.number ??
    p.phones[0]?.number ??
    "";
  const factoryPhone =
    p.phones.find((x) => /factory|plant/i.test(x.label))?.number ??
    p.phones[1]?.number ??
    "";
  return {
    legalName: p.legalName,
    displayPrimary: p.displayNames.primary,
    alsoMention: p.displayNames.alsoMention.join(", "),
    cin: p.cin,
    gst: p.gst,
    registeredOffice: { ...emptyAddress(), ...p.registeredOffice },
    factoryAddress: { ...emptyAddress(), ...p.factoryAddress },
    phoneSales: salesPhone,
    phoneFactory: factoryPhone,
    emailSales: p.emails.sales,
    emailExport: p.emails.export,
    emailPurchase: p.emails.purchase,
    emailInvestor: p.emails.investor,
    emailHr: p.emails.hr,
    emailQuality: p.emails.quality,
  };
}

const emptyDraft = (): Draft => ({
  legalName: "",
  displayPrimary: "",
  alsoMention: "",
  cin: "",
  gst: "",
  registeredOffice: emptyAddress(),
  factoryAddress: emptyAddress(),
  phoneSales: "",
  phoneFactory: "",
  emailSales: "",
  emailExport: "",
  emailPurchase: "",
  emailInvestor: "",
  emailHr: "",
  emailQuality: "",
});

function newSocialLink(order: number): SocialLinkDTO {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `social-${Date.now()}-${order}`,
    platform: "linkedin",
    url: "",
    label: "",
    order,
  };
}

function AddressFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Address;
  onChange: (next: Address) => void;
}) {
  return (
    <fieldset className="col-span-full grid gap-2.5 sm:grid-cols-2">
      <legend className="col-span-full mb-1 text-[11px] font-semibold tracking-tight text-[#86868b]">
        {label}
      </legend>
      <CorporateField label="Line 1" className="sm:col-span-2">
        <input
          className={corporateInputClass}
          value={value.line1}
          onChange={(e) => onChange({ ...value, line1: e.target.value })}
        />
      </CorporateField>
      <CorporateField label="Line 2" className="sm:col-span-2">
        <input
          className={corporateInputClass}
          value={value.line2 ?? ""}
          onChange={(e) => onChange({ ...value, line2: e.target.value })}
        />
      </CorporateField>
      <CorporateField label="City">
        <input
          className={corporateInputClass}
          value={value.city}
          onChange={(e) => onChange({ ...value, city: e.target.value })}
        />
      </CorporateField>
      <CorporateField label="State">
        <input
          className={corporateInputClass}
          value={value.state}
          onChange={(e) => onChange({ ...value, state: e.target.value })}
        />
      </CorporateField>
      <CorporateField label="Postal code">
        <input
          className={corporateInputClass}
          value={value.postalCode}
          onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
        />
      </CorporateField>
      <CorporateField label="Country">
        <input
          className={corporateInputClass}
          value={value.country}
          onChange={(e) => onChange({ ...value, country: e.target.value })}
        />
      </CorporateField>
    </fieldset>
  );
}

export function CorporateCompanyEditor() {
  const [version, setVersion] = useState(1);
  const [locations, setLocations] = useState<CompanyProfileDTO["locations"]>(
    [],
  );
  const [socialLinks, setSocialLinks] = useState<SocialLinkDTO[]>([]);
  const [logo, setLogo] = useState<CompanyProfileDTO["logo"]>({});
  const [logoDisplayHeightPx, setLogoDisplayHeightPx] = useState(40);
  const [brandColors, setBrandColors] = useState<
    CompanyProfileDTO["brandColors"]
  >({});
  const [locale, setLocale] = useState("en");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [baseline, setBaseline] = useState("");
  const [logoBaseline, setLogoBaseline] = useState("");
  const [socialBaseline, setSocialBaseline] = useState("[]");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty = useMemo(() => {
    const logoSnap = JSON.stringify({ logo, logoDisplayHeightPx });
    return (
      JSON.stringify(draft) !== baseline ||
      logoSnap !== logoBaseline ||
      JSON.stringify(socialLinks) !== socialBaseline
    );
  }, [
    draft,
    baseline,
    logo,
    logoDisplayHeightPx,
    logoBaseline,
    socialLinks,
    socialBaseline,
  ]);

  const canPublish =
    Boolean(draft.legalName.trim()) && Boolean(draft.displayPrimary.trim());

  const patch = (partial: Partial<Draft>) =>
    setDraft((d) => ({ ...d, ...partial }));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await fetchCompanyApi();
      if (!profile) {
        const d = emptyDraft();
        setDraft(d);
        setBaseline(JSON.stringify(d));
        setSocialLinks([]);
        setSocialBaseline("[]");
        setVersion(1);
        return;
      }
      const d = fromProfile(profile);
      setDraft(d);
      setBaseline(JSON.stringify(d));
      setVersion(profile.version);
      setLocations(profile.locations ?? []);
      const nextSocial = profile.socialLinks ?? [];
      setSocialLinks(nextSocial);
      setSocialBaseline(JSON.stringify(nextSocial));
      const nextLogo = profile.logo ?? {};
      const nextH = profile.logoDisplayHeightPx ?? 40;
      setLogo(nextLogo);
      setLogoDisplayHeightPx(nextH);
      setLogoBaseline(
        JSON.stringify({ logo: nextLogo, logoDisplayHeightPx: nextH }),
      );
      setBrandColors(profile.brandColors ?? {});
      setLocale(profile.locale || "en");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load company profile",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function updateSocial(id: string, partial: Partial<SocialLinkDTO>) {
    setSocialLinks((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...partial } : row)),
    );
  }

  function moveSocial(index: number, dir: -1 | 1) {
    setSocialLinks((rows) => {
      const next = [...rows];
      const j = index + dir;
      if (j < 0 || j >= next.length) return rows;
      const tmp = next[index]!;
      next[index] = next[j]!;
      next[j] = tmp;
      return next.map((row, order) => ({ ...row, order }));
    });
  }

  async function onSave() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const phones = [
        ...(draft.phoneSales.trim()
          ? [{ label: "Sales", number: draft.phoneSales.trim() }]
          : []),
        ...(draft.phoneFactory.trim()
          ? [{ label: "Factory", number: draft.phoneFactory.trim() }]
          : []),
      ];
      const payloadSocial = socialLinks
        .filter((l) => l.url.trim())
        .map((l, order) => ({
          id: l.id,
          platform: l.platform,
          url: l.url.trim(),
          ...(l.platform === "other" || l.label?.trim()
            ? { label: (l.label ?? "").trim() }
            : {}),
          order,
        }));
      const updated = await updateCompanyApi({
        legalName: draft.legalName.trim(),
        displayNames: {
          primary: draft.displayPrimary.trim(),
          alsoMention: draft.alsoMention
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        cin: draft.cin.trim(),
        gst: draft.gst.trim(),
        registeredOffice: draft.registeredOffice,
        factoryAddress: draft.factoryAddress,
        phones,
        emails: {
          sales: draft.emailSales.trim(),
          export: draft.emailExport.trim(),
          purchase: draft.emailPurchase.trim(),
          investor: draft.emailInvestor.trim(),
          hr: draft.emailHr.trim(),
          quality: draft.emailQuality.trim(),
        },
        logo,
        logoDisplayHeightPx,
        brandColors,
        locations,
        socialLinks: payloadSocial,
        locale,
        version,
      });
      const d = fromProfile(updated);
      setDraft(d);
      setBaseline(JSON.stringify(d));
      setVersion(updated.version);
      setLocations(updated.locations ?? []);
      const nextSocial = updated.socialLinks ?? [];
      setSocialLinks(nextSocial);
      setSocialBaseline(JSON.stringify(nextSocial));
      setLogo(updated.logo ?? {});
      setLogoDisplayHeightPx(updated.logoDisplayHeightPx ?? 40);
      setLogoBaseline(
        JSON.stringify({
          logo: updated.logo ?? {},
          logoDisplayHeightPx: updated.logoDisplayHeightPx ?? 40,
        }),
      );
      setMessage("Company profile saved.");
    } catch (err) {
      if (err instanceof ApiClientError && err.code === "CONFLICT") {
        setError("Someone else saved first. Reload and try again.");
      } else {
        setError(err instanceof Error ? err.message : "Save failed");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground text-sm">Loading company…</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[52rem] flex-col pb-2">
      <header className="mb-4 flex flex-col gap-2">
        <DeskBackLink href="/admin/pages" label="Back to pages" />
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Company profile
        </h1>
        <p className="text-muted-foreground text-[0.8125rem]">
          Legal name, contacts, social links and addresses used sitewide.
        </p>
      </header>

      <div className="overflow-hidden rounded-[10px] border border-[#d2d2d7] bg-white">
        <div className="grid gap-2.5 p-3 sm:grid-cols-2">
          <CorporateField label="Legal name" className="sm:col-span-2">
            <input
              className={corporateInputClass}
              value={draft.legalName}
              onChange={(e) => patch({ legalName: e.target.value })}
            />
          </CorporateField>
          <CorporateField label="Display name">
            <input
              className={corporateInputClass}
              value={draft.displayPrimary}
              onChange={(e) => patch({ displayPrimary: e.target.value })}
            />
          </CorporateField>
          <CorporateField label="Also known as (comma-separated)">
            <input
              className={corporateInputClass}
              value={draft.alsoMention}
              onChange={(e) => patch({ alsoMention: e.target.value })}
            />
          </CorporateField>
          <CorporateField label="CIN">
            <input
              className={corporateInputClass}
              value={draft.cin}
              onChange={(e) => patch({ cin: e.target.value })}
            />
          </CorporateField>
          <CorporateField label="GST">
            <input
              className={corporateInputClass}
              value={draft.gst}
              onChange={(e) => patch({ gst: e.target.value })}
            />
          </CorporateField>
          <AddressFields
            label="Registered office"
            value={draft.registeredOffice}
            onChange={(registeredOffice) => patch({ registeredOffice })}
          />
          <AddressFields
            label="Factory address"
            value={draft.factoryAddress}
            onChange={(factoryAddress) => patch({ factoryAddress })}
          />
          <CorporateField label="Sales phone">
            <input
              className={corporateInputClass}
              value={draft.phoneSales}
              onChange={(e) => patch({ phoneSales: e.target.value })}
            />
          </CorporateField>
          <CorporateField label="Factory phone">
            <input
              className={corporateInputClass}
              value={draft.phoneFactory}
              onChange={(e) => patch({ phoneFactory: e.target.value })}
            />
          </CorporateField>
          <CorporateField label="Sales email">
            <input
              className={corporateInputClass}
              value={draft.emailSales}
              onChange={(e) => patch({ emailSales: e.target.value })}
            />
          </CorporateField>
          <CorporateField label="Export email">
            <input
              className={corporateInputClass}
              value={draft.emailExport}
              onChange={(e) => patch({ emailExport: e.target.value })}
            />
          </CorporateField>
          <CorporateField label="Purchase email">
            <input
              className={corporateInputClass}
              value={draft.emailPurchase}
              onChange={(e) => patch({ emailPurchase: e.target.value })}
            />
          </CorporateField>
          <CorporateField label="Investor email">
            <input
              className={corporateInputClass}
              value={draft.emailInvestor}
              onChange={(e) => patch({ emailInvestor: e.target.value })}
            />
          </CorporateField>
          <CorporateField label="HR email">
            <input
              className={corporateInputClass}
              value={draft.emailHr}
              onChange={(e) => patch({ emailHr: e.target.value })}
            />
          </CorporateField>
          <CorporateField label="Quality email">
            <input
              className={corporateInputClass}
              value={draft.emailQuality}
              onChange={(e) => patch({ emailQuality: e.target.value })}
            />
          </CorporateField>

          <div className="col-span-full mt-2 border-t border-[#e8e8ed] pt-3">
            <p className="mb-1 text-[11px] font-semibold tracking-tight text-[#86868b]">
              Social links
            </p>
            <p className="text-muted-foreground mb-3 text-[0.75rem]">
              Shown in the site footer, mobile menu, and contact page. Use
              https:// URLs only. Empty rows are ignored on save.
            </p>
            <div className="flex flex-col gap-2">
              {socialLinks.map((link, i) => (
                <div
                  key={link.id}
                  className="rounded-[8px] border border-[#e8e8ed] bg-[#fafafa] p-2.5"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold tracking-wide text-[#aeaeb2] uppercase">
                      Link {i + 1}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        className="inline-flex size-6 items-center justify-center rounded text-[#86868b] hover:bg-black/5 disabled:opacity-30"
                        aria-label="Move up"
                        disabled={i === 0}
                        onClick={() => moveSocial(i, -1)}
                      >
                        <ChevronUp className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex size-6 items-center justify-center rounded text-[#86868b] hover:bg-black/5 disabled:opacity-30"
                        aria-label="Move down"
                        disabled={i === socialLinks.length - 1}
                        onClick={() => moveSocial(i, 1)}
                      >
                        <ChevronDown className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex size-6 items-center justify-center rounded text-[#ff3b30] hover:bg-[#ff3b30]/10"
                        aria-label="Remove social link"
                        onClick={() =>
                          setSocialLinks((rows) =>
                            rows
                              .filter((r) => r.id !== link.id)
                              .map((r, order) => ({ ...r, order })),
                          )
                        }
                      >
                        <X className="size-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <CorporateField label="Platform">
                      <select
                        className={corporateInputClass}
                        value={link.platform}
                        onChange={(e) =>
                          updateSocial(link.id, {
                            platform: e.target.value as SocialPlatform,
                          })
                        }
                      >
                        {SOCIAL_PLATFORMS.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </CorporateField>
                    <CorporateField label="URL (https://)">
                      <input
                        className={corporateInputClass}
                        type="url"
                        placeholder="https://"
                        value={link.url}
                        onChange={(e) =>
                          updateSocial(link.id, { url: e.target.value })
                        }
                      />
                    </CorporateField>
                    {link.platform === "other" ? (
                      <CorporateField label="Label" className="sm:col-span-2">
                        <input
                          className={corporateInputClass}
                          placeholder="e.g. Industry association"
                          value={link.label ?? ""}
                          onChange={(e) =>
                            updateSocial(link.id, { label: e.target.value })
                          }
                        />
                      </CorporateField>
                    ) : null}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                className="h-8 justify-start px-2 text-[12px] font-medium text-[#0071e3] hover:bg-[#0071e3]/08 hover:text-[#0071e3]"
                onClick={() =>
                  setSocialLinks((rows) => [
                    ...rows,
                    newSocialLink(rows.length),
                  ])
                }
              >
                <Plus className="size-3.5" />
                Add social link
              </Button>
            </div>
          </div>

          <div className="col-span-full mt-2 border-t border-[#e8e8ed] pt-3">
            <p className="mb-2 text-[11px] font-semibold tracking-tight text-[#86868b]">
              Brand logo
            </p>
            <p className="text-muted-foreground mb-3 text-[0.75rem]">
              Used in the site header and footer. Upload anytime; height adjusts
              the public lockup (28–64px).
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <CloudinaryPicker
                kind="image"
                label="Logo image"
                help="PNG or SVG preferred. Transparent backgrounds work best."
                valueUrl={logo.png ?? ""}
                onChange={({ url }) =>
                  setLogo((prev) => ({ ...prev, png: url || null }))
                }
              />
              <div className="flex flex-col gap-3">
                <CorporateField
                  label={`Display height (${logoDisplayHeightPx}px)`}
                >
                  <input
                    type="range"
                    min={28}
                    max={64}
                    step={1}
                    className="w-full accent-[#0342ab]"
                    value={logoDisplayHeightPx}
                    onChange={(e) =>
                      setLogoDisplayHeightPx(Number(e.target.value) || 40)
                    }
                  />
                </CorporateField>
                <div
                  className={cn(
                    "flex items-center justify-center rounded-lg border border-dashed border-[#d2d2d7] bg-[#f5f5f7] p-4",
                  )}
                >
                  <BrandLockup
                    href="#"
                    src={logo.png}
                    heightPx={logoDisplayHeightPx}
                    className="pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeskSaveBar
        saving={saving}
        dirty={dirty}
        canPublish={canPublish}
        publishBlockedReason={
          canPublish
            ? undefined
            : "Add legal name and display name before saving."
        }
        statusLabel="company"
        onSave={() => void onSave()}
        onPublish={() => void onSave()}
        message={message}
        error={error}
      />
    </div>
  );
}
