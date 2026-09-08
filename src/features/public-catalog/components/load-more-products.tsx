"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/public-catalog/components/product-card";
import type { ProductDTO } from "@/modules/catalog";

type LoadMoreProductsProps = {
  locale: string;
  initialItems: ProductDTO[];
  initialCursor: string | null;
  categoryId?: string;
  pageSize?: number;
};

export function LoadMoreProducts({
  locale,
  initialItems,
  initialCursor,
  categoryId,
  pageSize = 24,
}: LoadMoreProductsProps) {
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function loadMore() {
    if (!cursor) return;
    startTransition(async () => {
      setError(null);
      try {
        const params = new URLSearchParams({
          cursor,
          limit: String(pageSize),
          upcoming: "false",
        });
        if (categoryId) params.set("categoryId", categoryId);
        const res = await fetch(`/api/v1/public/products?${params}`);
        if (!res.ok) throw new Error("Could not load more products");
        const json = (await res.json()) as {
          success: boolean;
          data?: { items: ProductDTO[]; nextCursor: string | null };
        };
        if (!json.success || !json.data) throw new Error("Invalid response");
        setItems((prev) => [...prev, ...json.data!.items]);
        setCursor(json.data.nextCursor);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <div>
      <ul className="mx-auto grid max-w-[90rem] gap-4 min-[640px]:grid-cols-2 min-[640px]:gap-5 min-[1024px]:grid-cols-3 min-[1440px]:grid-cols-4">
        {items.map((product) => (
          <li key={product.id}>
            <ProductCard locale={locale} product={product} />
          </li>
        ))}
      </ul>
      {cursor ? (
        <div className="mt-8 flex flex-col items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            disabled={pending}
            onClick={loadMore}
          >
            {pending ? "Loading…" : "Load more"}
          </Button>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
