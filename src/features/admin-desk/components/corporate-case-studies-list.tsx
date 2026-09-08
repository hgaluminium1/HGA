"use client";

import { useCallback } from "react";

import { CorporateEntityList } from "@/features/admin-desk/components/corporate-entity-list";
import { fetchCaseStudiesApi } from "@/features/admin-desk/lib/corporate-api";
import type { CaseStudyDTO } from "@/modules/corporate/browser";

export function CorporateCaseStudiesList() {
  const fetchItems = useCallback(
    (q?: string) => fetchCaseStudiesApi({ q }),
    [],
  );

  return (
    <CorporateEntityList<CaseStudyDTO>
      title="Case studies"
      description="Customer stories for Customers and marketing pages."
      basePath="/admin/corporate/case-studies"
      newLabel="New case study"
      searchPlaceholder="Search title, industry, slug…"
      emptyLabel="No case studies yet."
      fetchItems={fetchItems}
      getId={(c) => c.id}
      getTitle={(c) => c.title.en}
      getSubtitle={(c) =>
        `/${c.slug}${c.industry ? ` · ${c.industry}` : ""}${c.region ? ` · ${c.region}` : ""}`
      }
      getStatus={(c) => c.publishStatus}
    />
  );
}
