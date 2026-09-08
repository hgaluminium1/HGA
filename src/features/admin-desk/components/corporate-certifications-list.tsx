"use client";

import { useCallback } from "react";

import { CorporateEntityList } from "@/features/admin-desk/components/corporate-entity-list";
import { fetchCertificationsApi } from "@/features/admin-desk/lib/corporate-api";
import type { CertificationDTO } from "@/modules/corporate/browser";

export function CorporateCertificationsList() {
  const fetchItems = useCallback(
    (q?: string) => fetchCertificationsApi({ q }),
    [],
  );

  return (
    <CorporateEntityList<CertificationDTO>
      title="Certifications"
      description="ISO and quality documents for Quality, Resources and About."
      basePath="/admin/corporate/certifications"
      newLabel="New certification"
      searchPlaceholder="Search name, issuer, type…"
      emptyLabel="No certifications yet."
      fetchItems={fetchItems}
      getId={(c) => c.id}
      getTitle={(c) => c.name}
      getSubtitle={(c) =>
        `${c.type}${c.issuer ? ` · ${c.issuer}` : ""}`
      }
      getStatus={(c) => c.publishStatus}
    />
  );
}
