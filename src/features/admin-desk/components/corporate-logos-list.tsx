"use client";

import { useCallback } from "react";

import { CorporateEntityList } from "@/features/admin-desk/components/corporate-entity-list";
import { fetchCustomerLogosApi } from "@/features/admin-desk/lib/corporate-api";
import type { CustomerLogoDTO } from "@/modules/corporate/browser";

export function CorporateLogosList() {
  const fetchItems = useCallback(
    (q?: string) => fetchCustomerLogosApi({ q }),
    [],
  );

  return (
    <CorporateEntityList<CustomerLogoDTO>
      title="Customer logos"
      description="Approved logos for Customers and homepage strips."
      basePath="/admin/corporate/logos"
      newLabel="New logo"
      searchPlaceholder="Search customer name…"
      emptyLabel="No customer logos yet."
      fetchItems={fetchItems}
      getId={(l) => l.id}
      getTitle={(l) => l.name}
      getSubtitle={(l) =>
        l.approvedForWebsite ? "Approved for website" : "Needs approval"
      }
      getStatus={(l) => l.publishStatus}
    />
  );
}
