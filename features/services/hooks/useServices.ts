import { useQuery } from "@tanstack/react-query"
import { getServices } from "../services/services"
import { Service } from "../types/services.types"

type UseServicesProps = {
  locale: string
}

/**
 * Custom hook to fetch and manage localized services.
 * @param props - The hook properties.
 * @param locale - The language code (e.g., 'en', 'id') for content translation.
 * @returns The query result containing an array of Service objects.
 */
export function useServices({ locale }: UseServicesProps) {
  return useQuery<Service[]>({
    queryKey: ["services", locale],
    queryFn: () => getServices({ locale }),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  })
}
