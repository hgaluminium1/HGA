"use client";

import { useCallback } from "react";

import { CorporateEntityList } from "@/features/admin-desk/components/corporate-entity-list";
import { fetchCapacityMetricsApi } from "@/features/admin-desk/lib/corporate-api";
import type { CapacityMetricDTO } from "@/modules/corporate/browser";

export function CorporateCapacityList() {
  const fetchItems = useCallback(
    (q?: string) => fetchCapacityMetricsApi({ q }),
    [],
  );

  return (
    <CorporateEntityList<CapacityMetricDTO>
      title="Capacity"
      description="Plant metrics for About, Manufacturing and Capacity pages."
      basePath="/admin/corporate/capacity"
      newLabel="New metric"
      searchPlaceholder="Search key, label, category…"
      emptyLabel="No capacity metrics yet."
      fetchItems={fetchItems}
      getId={(m) => m.id}
      getTitle={(m) => m.label.en}
      getSubtitle={(m) =>
        `${m.key} · ${m.category} · ${m.value}${m.unit ? ` ${m.unit}` : ""}`
      }
      getStatus={(m) => m.publishStatus}
    />
  );
}
