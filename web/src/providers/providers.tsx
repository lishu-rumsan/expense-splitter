"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import * as React from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function Providers({ children }: QueryProviderProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectKitProvider theme="auto">{children}</ConnectKitProvider>
    </QueryClientProvider>
  );
}
