"use client";

import { useCallback } from "react";

import { CorporateEntityList } from "@/features/admin-desk/components/corporate-entity-list";
import { fetchSustainabilityMetricsApi } from "@/features/admin-desk/lib/corporate-api";
import type { SustainabilityMetricDTO } from "@/modules/corporate/browser";

export function CorporateSustainabilityList() {
  const fetchItems = useCallback(
    (q?: string) => fetchSustainabilityMetricsApi({ q }),
    [],
  );

  return (
    <CorporateEntityList<SustainabilityMetricDTO>
      title="Sustainability"
      description="ESG metrics and initiatives for the Sustainability page."
      basePath="/admin/corporate/sustainability"
      newLabel="New metric"
      searchPlaceholder="Search key, label…"
      emptyLabel="No sustainability metrics yet."
      fetchItems={fetchItems}
      getId={(m) => m.id}
      getTitle={(m) => m.label.en}
      getSubtitle={(m) =>
        `${m.key} · ${m.disclosureTier}${m.value ? ` · ${m.value}` : ""}`
      }
      getStatus={(m) => m.publishStatus}
    />
  );
}
