import { useQuery } from "@tanstack/react-query"
import { getFeaturedArticles } from "../services/articles"

type UseFeaturedArticlesParams = {
  locale: string
}

/**
 * Custom hook to fetch and manage localized featured articles for the public portfolio.
 * @param props - The hook properties.
 * @param props.locale - The language code (e.g., 'en', 'id') for content translation.
 * @returns The query result containing an array of Article objects.
 */
export function useFeaturedArticles({
  locale,
}: UseFeaturedArticlesParams) {
  return useQuery({
    queryKey: ["featured-articles", locale],
    queryFn: () => getFeaturedArticles({ locale }),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })
}
