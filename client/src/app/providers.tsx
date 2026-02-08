"use client";

import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastProvider } from "@heroui/toast";
import React, { useState } from "react";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: false,
                    },
                },
            })
    );

    const isBrowser = typeof window !== "undefined";

    if (!isBrowser) {
        // SSR fallback — still provide QueryClient
        return (
            <QueryClientProvider client={queryClient}>
                <HeroUIProvider>
                    <ToastProvider />
                    {children}
                </HeroUIProvider>
            </QueryClientProvider>
        );
    }

    const persister = createSyncStoragePersister({
        storage: window.localStorage,
    });

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister,
                maxAge: 24 * 60 * 60 * 1000,
                dehydrateOptions: {
                    shouldDehydrateQuery: (query) =>
                        query.queryKey[0] === "user",
                },
            }}
        >
            <HeroUIProvider>
                <ToastProvider />
                {children}
            </HeroUIProvider>

            <ReactQueryDevtools initialIsOpen={false} />
        </PersistQueryClientProvider>
    );
}