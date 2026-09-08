"use client";

import { useCallback } from "react";

import { CorporateEntityList } from "@/features/admin-desk/components/corporate-entity-list";
import { fetchPeopleApi } from "@/features/admin-desk/lib/corporate-api";
import type { PersonDTO } from "@/modules/corporate/browser";

const ROLE_LABEL: Record<PersonDTO["role"], string> = {
  director: "Director",
  chairman: "Chairman",
  md: "Managing Director",
  company_secretary: "Company Secretary",
  executive: "Executive",
};

export function CorporatePeopleList() {
  const fetchItems = useCallback(
    (q?: string) => fetchPeopleApi({ q }),
    [],
  );

  return (
    <CorporateEntityList<PersonDTO>
      title="People"
      description="Leadership, board and chairman profiles for About and Chairman’s Message."
      basePath="/admin/corporate/people"
      newLabel="New person"
      searchPlaceholder="Search name, role, slug…"
      emptyLabel="No people yet. Add the first profile."
      fetchItems={fetchItems}
      getId={(p) => p.id}
      getTitle={(p) => p.name.en}
      getSubtitle={(p) =>
        `${ROLE_LABEL[p.role]}${p.boardDesignation ? ` · ${p.boardDesignation}` : ""} · /${p.slug}`
      }
      getStatus={(p) => p.status}
    />
  );
}
