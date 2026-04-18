import { useQuery } from "@tanstack/react-query"
import { getExperiences } from "../services/experiences"

type UseExperiencesParams = {
  locale: string
}

/**
 * Custom hook to fetch professional experiences using TanStack Query.
 * @param props - The hook properties.
 * @param props.locale - The language code (e.g., 'en', 'id') for content translation.
 * @returns The query result containing an array of Experience objects.
 */
export const useExperiences = ({ locale }: UseExperiencesParams) => {
  return useQuery({
    queryKey: ["experiences", locale],
    queryFn: () => getExperiences({ locale }),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false
  })
}
