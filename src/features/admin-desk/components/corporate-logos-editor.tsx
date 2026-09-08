"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { DeskBackLink } from "@/features/admin-desk/components/desk-back-link";
import { DeskSaveBar } from "@/features/admin-desk/components/desk-save-bar";
import {
  CheckRow,
  CorporateField,
  corporateInputClass,
} from "@/features/admin-desk/components/corporate-form-ui";
import {
  ApiClientError,
  createCustomerLogoApi,
  deleteCustomerLogoApi,
  fetchCustomerLogoApi,
  updateCustomerLogoApi,
} from "@/features/admin-desk/lib/corporate-api";
import type { CustomerLogoDTO } from "@/modules/corporate/browser";

type Draft = {
  name: string;
  logoId: string;
  approvedForWebsite: boolean;
  permissionNote: string;
  sortOrder: number;
};

function fromLogo(l: CustomerLogoDTO): Draft {
  return {
    name: l.name,
    logoId: l.logoId ?? "",
    approvedForWebsite: l.approvedForWebsite,
    permissionNote: l.permissionNote,
    sortOrder: l.sortOrder,
  };
}

const emptyDraft = (): Draft => ({
  name: "",
  logoId: "",
  approvedForWebsite: false,
  permissionNote: "",
  sortOrder: 0,
});

export function CorporateLogosEditor({ logoId }: { logoId: string | "new" }) {
  const router = useRouter();
  const isNew = logoId === "new";
  const [id, setId] = useState<string | null>(isNew ? null : logoId);
  const [version, setVersion] = useState(1);
  const [publishStatus, setPublishStatus] = useState<"draft" | "published">(
    "draft",
  );
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [baseline, setBaseline] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== baseline,
    [draft, baseline],
  );
  const canPublish = Boolean(draft.name.trim());
  const patch = (partial: Partial<Draft>) =>
    setDraft((d) => ({ ...d, ...partial }));

  const load = useCallback(async () => {
    if (isNew) {
      setBaseline(JSON.stringify(emptyDraft()));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const l = await fetchCustomerLogoApi(logoId);
      const d = fromLogo(l);
      setDraft(d);
      setBaseline(JSON.stringify(d));
      setVersion(l.version);
      setPublishStatus(l.publishStatus);
      setId(l.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load logo");
    } finally {
      setLoading(false);
    }
  }, [isNew, logoId]);

  useEffect(() => {
    void load();
  }, [load]);

  function payload(nextPublish?: "draft" | "published") {
    return {
      name: draft.name.trim(),
      logoId: draft.logoId.trim() || null,
      approvedForWebsite: draft.approvedForWebsite,
      permissionNote: draft.permissionNote.trim(),
      sortOrder: draft.sortOrder,
      ...(nextPublish ? { publishStatus: nextPublish } : {}),
    };
  }

  async function persist(publish?: "draft" | "published") {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      if (!id) {
        const created = await createCustomerLogoApi(
          payload(publish ?? "draft"),
        );
        setId(created.id);
        setVersion(created.version);
        setPublishStatus(created.publishStatus);
        const d = fromLogo(created);
        setDraft(d);
        setBaseline(JSON.stringify(d));
        router.replace(`/admin/corporate/logos/${created.id}`);
        setMessage(publish === "published" ? "Published." : "Logo created.");
        return;
      }
      let currentVersion = version;
      if (dirty) {
        const updated = await updateCustomerLogoApi(id, {
          ...payload(),
          version: currentVersion,
        });
        currentVersion = updated.version;
      }
      if (publish === "published") {
        const published = await updateCustomerLogoApi(id, {
          publishStatus: "published",
          version: currentVersion,
        });
        setVersion(published.version);
        setPublishStatus(published.publishStatus);
        const d = fromLogo(published);
        setDraft(d);
        setBaseline(JSON.stringify(d));
        setMessage("Published.");
      } else {
        const updated = await updateCustomerLogoApi(id, {
          ...payload(),
          version: currentVersion,
        });
        setVersion(updated.version);
        setPublishStatus(updated.publishStatus);
        const d = fromLogo(updated);
        setDraft(d);
        setBaseline(JSON.stringify(d));
        setMessage("Draft saved.");
      }
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
    return <p className="text-muted-foreground text-sm">Loading logo…</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[52rem] flex-col pb-2">
      <header className="mb-4 flex flex-col gap-2">
        <DeskBackLink href="/admin/corporate/logos" label="Back to logos" />
        <h1 className="font-display text-xl font-semibold tracking-tight">
          {isNew && !id ? "New customer logo" : draft.name || "Logo"}
        </h1>
      </header>

      <div className="overflow-hidden rounded-[10px] border border-[#d2d2d7] bg-white">
        <div className="grid gap-2.5 p-3 sm:grid-cols-2">
          <CorporateField label="Customer name" className="sm:col-span-2">
            <input
              className={corporateInputClass}
              value={draft.name}
              onChange={(e) => patch({ name: e.target.value })}
            />
          </CorporateField>
          <CorporateField label="Logo media ID" className="sm:col-span-2">
            <input
              className={corporateInputClass}
              value={draft.logoId}
              onChange={(e) => patch({ logoId: e.target.value })}
            />
          </CorporateField>
          <CorporateField label="Sort order">
            <input
              type="number"
              className={corporateInputClass}
              value={draft.sortOrder}
              onChange={(e) =>
                patch({ sortOrder: Number(e.target.value) || 0 })
              }
            />
          </CorporateField>
          <CorporateField label="Permission note" className="sm:col-span-2">
            <input
              className={corporateInputClass}
              value={draft.permissionNote}
              onChange={(e) => patch({ permissionNote: e.target.value })}
            />
          </CorporateField>
          <div className="sm:col-span-2">
            <CheckRow
              label="Approved for website"
              checked={draft.approvedForWebsite}
              onChange={(v) => patch({ approvedForWebsite: v })}
            />
          </div>
        </div>
      </div>

      {id ? (
        <div className="mt-3">
          <Button
            type="button"
            variant="outline"
            className="h-8 text-[12px] text-[#ff3b30]"
            disabled={saving}
            onClick={async () => {
              if (!confirm("Move this logo to trash?")) return;
              try {
                await deleteCustomerLogoApi(id);
                router.push("/admin/corporate/logos");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Delete failed");
              }
            }}
          >
            Trash
          </Button>
        </div>
      ) : null}

      <DeskSaveBar
        saving={saving}
        dirty={dirty || !id}
        canPublish={canPublish}
        publishBlockedReason={
          canPublish ? undefined : "Add a customer name before publish."
        }
        statusLabel={publishStatus}
        onSave={() => void persist()}
        onPublish={() => void persist("published")}
        message={message}
        error={error}
      />
    </div>
  );
}
