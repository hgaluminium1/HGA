"use client";

import { useCallback } from "react";

import { CorporateEntityList } from "@/features/admin-desk/components/corporate-entity-list";
import { fetchExpansionProjectsApi } from "@/features/admin-desk/lib/corporate-api";
import type { ExpansionProjectDTO } from "@/modules/corporate/browser";

export function CorporateExpansionList() {
  const fetchItems = useCallback(
    (q?: string) => fetchExpansionProjectsApi({ q }),
    [],
  );

  return (
    <CorporateEntityList<ExpansionProjectDTO>
      title="Expansion"
      description="Confirmed and planned projects for the Expansion roadmap."
      basePath="/admin/corporate/expansion"
      newLabel="New project"
      searchPlaceholder="Search title, slug, status…"
      emptyLabel="No expansion projects yet."
      fetchItems={fetchItems}
      getId={(p) => p.id}
      getTitle={(p) => p.title.en}
      getSubtitle={(p) =>
        `/${p.slug} · ${p.status}${p.locationNote ? ` · ${p.locationNote}` : ""}`
      }
      getStatus={(p) => p.publishStatus}
    />
  );
}
