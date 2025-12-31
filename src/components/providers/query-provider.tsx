"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Phase 5 Optimization: Aggressive caching for better performance
            staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
            gcTime: 1000 * 60 * 30, // 30 minutes - keep in memory
            refetchOnWindowFocus: false, // Don't refetch on window focus
            refetchOnMount: false, // Don't refetch on component mount if data exists
            refetchOnReconnect: true, // Refetch on network reconnect is good
            retry: 1, // Only retry once on failure
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
            networkMode: 'online', // Enable query deduplication
          },
          mutations: {
            retry: 0, // Don't retry mutations automatically
            networkMode: 'online',
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
