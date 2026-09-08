"use client";

import { useCallback } from "react";

import { CorporateEntityList } from "@/features/admin-desk/components/corporate-entity-list";
import { fetchTestimonialsApi } from "@/features/admin-desk/lib/corporate-api";
import type { TestimonialDTO } from "@/modules/corporate/browser";

export function CorporateTestimonialsList() {
  const fetchItems = useCallback(
    (q?: string) => fetchTestimonialsApi({ q }),
    [],
  );

  return (
    <CorporateEntityList<TestimonialDTO>
      title="Testimonials"
      description="Quotes for Customers and homepage testimonial bands."
      basePath="/admin/corporate/testimonials"
      newLabel="New testimonial"
      searchPlaceholder="Search author, company…"
      emptyLabel="No testimonials yet."
      fetchItems={fetchItems}
      getId={(t) => t.id}
      getTitle={(t) => t.authorName}
      getSubtitle={(t) =>
        `${t.company || "—"}${t.authorTitle ? ` · ${t.authorTitle}` : ""}`
      }
      getStatus={(t) => t.publishStatus}
    />
  );
}
