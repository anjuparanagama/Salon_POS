import { QueryClient } from "@tanstack/react-query";

/**
 * Global QueryClient instance configured for snappy UX with 2-minute stale-time caching.
 * Navigating between tabs or views will return cached data instantly (0.00s latency)
 * while background updates or mutation invalidations keep the data fresh.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data remains fresh for 2 minutes before a background refetch is triggered
      staleTime: 1000 * 60 * 2, // 2 minutes
      // Garbage collection / cache retention for 10 minutes in memory
      gcTime: 1000 * 60 * 10, // 10 minutes
      // Do not refetch merely on window/tab refocus to avoid unnecessary network pressure
      refetchOnWindowFocus: false,
      // Refetch when browser regains network connectivity
      refetchOnReconnect: true,
      // Retry once on failure
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

