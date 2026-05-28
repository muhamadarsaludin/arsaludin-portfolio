import { useQuery } from "@tanstack/react-query"
import { getArticle } from "../services/articles"

type UseArticleParams = {
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
export function useProject({ slug, id, locale }: UseArticleParams) {
  return useQuery({
    queryKey: ["article", slug || id, locale],
    queryFn: () => getArticle({ slug, id, locale }),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })
}