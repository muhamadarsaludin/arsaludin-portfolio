"use client"

import { useQuery } from "@tanstack/react-query"
import { getStats } from "../services/stats"

/**
 * Custom hook to fetch stats.
 * @returns The query result containing an Stats objects.
 */
export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => getStats(),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })
}
