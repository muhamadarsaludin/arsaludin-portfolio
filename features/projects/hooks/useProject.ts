import { useQuery } from "@tanstack/react-query"
import { getProject } from "../services/projects"

type UseProjectParams = {
  slug?: string
  id?: string
  locale: string
}

/**
 * Custom hook to fetch a single project by its slug or ID.
 * @param locale - The language code (e.g., 'en', 'id') for content translation.
 * @param slug - The unique human-readable identifier for the project.
 * @param id - The unique UUID for the project (alternative to slug).
 * @returns The query result containing the formatted Project object or null.
 */
export function useProject({ slug, id, locale }: UseProjectParams) {
  return useQuery({
    queryKey: ["project", slug || id, locale],
    queryFn: () => getProject({ slug, id, locale }),
    staleTime: 1000 * 60 * 30
  })
}
