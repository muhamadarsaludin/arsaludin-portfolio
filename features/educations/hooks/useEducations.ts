import { useQuery } from "@tanstack/react-query"
import { getEducations } from "../services/educations"

type UseEducationsParams = {
  locale: string
  isAdminView?: boolean
}

/**
 * Custom hook to fetch professional experiences using TanStack Query.
 * @param {UseEducationsParams} params - The locale and view mode.
 * @returns The query result object including data, isLoading, and error.
 */
export const useEducations = ({ locale, isAdminView = false }: UseEducationsParams) => {
  return useQuery({
    queryKey: ["educations", locale, { isAdminView }],
    queryFn: () => getEducations({ locale, isAdminView }),
    staleTime: isAdminView ? 0 : 1000 * 60 * 60,
    refetchOnWindowFocus: isAdminView,
  })
}
