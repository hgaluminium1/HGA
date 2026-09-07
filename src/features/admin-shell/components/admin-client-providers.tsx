"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

import { AdminProviders } from "@/features/admin-shell/components/admin-providers";

export function AdminClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1 },
        },
      }),
  );

  return (
    <AdminProviders>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </AdminProviders>
  );
}
