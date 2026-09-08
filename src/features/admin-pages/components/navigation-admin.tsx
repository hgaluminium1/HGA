"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  footerCompanyAllowlist,
  footerUtilityAllowlist,
  productNavAllowlist,
} from "@/config/nav.config";
import type { NavMenuDTO, NavMenuKey } from "@/modules/navigation";

const MENUS: { key: NavMenuKey; title: string; defaults: { label: string; href: string }[] }[] =
  [
    {
      key: "footer-products",
      title: "Footer — Products",
      defaults: [
        ...productNavAllowlist.map(({ label, href }) => ({ label, href })),
        { label: "View full catalogue", href: "products" },
      ],
    },
    {
      key: "footer-company",
      title: "Footer — Company",
      defaults: footerCompanyAllowlist.map(({ label, href }) => ({
        label,
        href,
      })),
    },
    {
      key: "footer-support",
      title: "Footer — Support",
      defaults: footerUtilityAllowlist.map(({ label, href }) => ({
        label,
        href,
      })),
    },
    {
      key: "primary",
      title: "Header — Primary links",
      defaults: [
        { label: "Industries", href: "industries" },
        { label: "Contact Us", href: "contact" },
      ],
    },
  ];

type Item = { label: string; href: string; description?: string; order: number };

async function fetchMenus(): Promise<NavMenuDTO[]> {
  const res = await fetch("/api/v1/navigation");
  if (!res.ok) throw new Error("Failed to load navigation");
  const json = (await res.json()) as {
    success: boolean;
    data: { items: NavMenuDTO[] };
  };
  return json.data.items;
}

async function saveMenu(body: {
  key: NavMenuKey;
  title: string;
  items: Item[];
  status: "published" | "draft";
  version?: number;
}) {
  const res = await fetch("/api/v1/navigation", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, locale: "en" }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    throw new Error(err?.error?.message || "Save failed");
  }
  return ((await res.json()) as { data: NavMenuDTO }).data;
}

function MenuEditor({
  meta,
  existing,
}: {
  meta: (typeof MENUS)[number];
  existing?: NavMenuDTO;
}) {
  const qc = useQueryClient();
  const [items, setItems] = useState<Item[]>(
    existing?.items?.length
      ? existing.items
      : meta.defaults.map((d, i) => ({ ...d, order: i })),
  );
  const [version, setVersion] = useState(existing?.version);

  useEffect(() => {
    if (existing?.items?.length) {
      setItems(existing.items);
      setVersion(existing.version);
    }
  }, [existing]);

  const saveMut = useMutation({
    mutationFn: (status: "published" | "draft") =>
      saveMenu({
        key: meta.key,
        title: meta.title,
        items: items.map((it, i) => ({ ...it, order: i })),
        status,
        version,
      }),
    onSuccess: (menu) => {
      setVersion(menu.version);
      void qc.invalidateQueries({ queryKey: ["nav-menus"] });
    },
    onError: (err) => alert(err instanceof Error ? err.message : "Error"),
  });

  return (
    <div className="border-line bg-surface rounded-[var(--radius-lg)] border p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-semibold text-ink">{meta.title}</h2>
          <p className="text-muted-foreground text-xs">
            Status: {existing?.status ?? "not saved"} · Links are
            locale-relative (e.g. products, about)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setItems((prev) => [
                ...prev,
                { label: "New link", href: "", order: prev.length },
              ])
            }
          >
            <Plus className="size-4" /> Add link
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={saveMut.isPending}
            onClick={() => saveMut.mutate("draft")}
          >
            Save draft
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={saveMut.isPending}
            onClick={() => saveMut.mutate("published")}
          >
            Publish
          </Button>
        </div>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="grid gap-2 min-[640px]:grid-cols-[1fr_1fr_auto]"
          >
            <input
              className="border-line min-h-11 rounded-[var(--radius-md)] border px-3 text-sm"
              value={item.label}
              placeholder="Label"
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, label: e.target.value };
                setItems(next);
              }}
            />
            <input
              className="border-line min-h-11 rounded-[var(--radius-md)] border px-3 text-sm"
              value={item.href}
              placeholder="href"
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, href: e.target.value };
                setItems(next);
              }}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setItems(items.filter((_, j) => j !== i))}
            >
              <Trash2 className="size-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NavigationAdmin() {
  const query = useQuery({
    queryKey: ["nav-menus"],
    queryFn: fetchMenus,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Header & footer
        </h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-relaxed">
          Edit primary and footer menus with forms — no JSON. Publish to override
          defaults on the live site. Maps live on Contact, not in the footer.
        </p>
      </div>
      {query.isLoading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : null}
      {MENUS.map((meta) => (
        <MenuEditor
          key={meta.key}
          meta={meta}
          existing={query.data?.find((m) => m.key === meta.key)}
        />
      ))}
    </div>
  );
}
