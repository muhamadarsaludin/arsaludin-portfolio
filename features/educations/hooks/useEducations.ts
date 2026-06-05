import { useQuery } from "@tanstack/react-query"
import { getEducations } from "../services/educations"

type UseEducationsParams = {
  locale: string
}

/**
 * Custom hook to fetch education history using TanStack Query.
 * @param props - The hook properties.
 * @param props.locale - The language code (e.g., 'en', 'id') for content translation.
 * @returns The query result containing an array of Education objects.
 */
export const useEducations = ({ locale }: UseEducationsParams) => {
  return useQuery({
    queryKey: ["educations", locale],
    queryFn: () => getEducations({ locale }),
    staleTime: 1000 * 60 * 30,
  })
}
