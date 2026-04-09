import { useQuery } from "@tanstack/react-query"
import { getExperiences } from "../services/experiences"

type UseExperiencesParams = {
  locale: string
  isAdminView?: boolean
}

/**
 * Custom hook to fetch professional experiences using TanStack Query.
 * @param {UseExperiencesParams} params - The locale and view mode.
 * @returns The query result object including data, isLoading, and error.
 */
export const useExperiences = ({ 
  locale, 
  isAdminView = false 
}: UseExperiencesParams) => {
  return useQuery({
    queryKey: ["experiences", locale, { isAdminView }],
    queryFn: () => getExperiences({ locale, isAdminView }),
    staleTime: isAdminView ? 0 : 1000 * 60 * 60,
    refetchOnWindowFocus: isAdminView,
  })
}