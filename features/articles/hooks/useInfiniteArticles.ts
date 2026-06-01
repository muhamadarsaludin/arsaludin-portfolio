import type { Cursor } from "../../shared/types/index.types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { ARTICLES_PAGE_SIZE } from "../constants/articles.constans"
import { getPaginatedArticles } from "../services/articles"

type UseArticlesParams = {
  locale: string
  search?: string
  categorySlugs?: string[]
  pageSize?: number
  cursor?: Cursor | undefined
  enabled?: boolean
}

export function useInfiniteArticles({
  locale,
  search,
  categorySlugs,
  pageSize = ARTICLES_PAGE_SIZE,
  enabled = true,
}: UseArticlesParams) {
  return useInfiniteQuery({
    queryKey: ["articles", { locale, search, categorySlugs, pageSize }],
    queryFn: async ({ pageParam }) => {
      return getPaginatedArticles({
        locale,
        search,
        categorySlugs,
        pageSize,
        cursor: pageParam as Cursor | undefined,
      })
    },
    enabled: enabled,
    initialPageParam: undefined as Cursor | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },
    staleTime: 1000 * 60 * 30,
  })
}
