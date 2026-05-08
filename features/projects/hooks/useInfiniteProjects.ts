import { Cursor } from '../../shared/types/index.types';
import { useInfiniteQuery } from "@tanstack/react-query"
import { PROJECTS_PAGE_SIZE } from '../constants/projects.constans';
import { getPaginatedProjects } from '../services/projects';

type UseProjectsParams = {
  locale: string 
  search?: string
  categorySlugs?: string[]
  pageSize?: number
  cursor?: Cursor | undefined
  enabled?: boolean
}

/**
* Custom hook for fetching paginated projects.
* @param locale - Language code for localized content (e.g., 'en', 'id').
* @param search - Optional string to filter projects by title or description.
* @param categorySlugs - Array of category identifiers for filtering.
* @param pageSize - Number of items to fetch per page.
* @param enabled - Toggle to enable or disable the query.
* @returns Infinite query object with project data, loading states, and pagination controls.
*/
export function useInfiniteProjects({
  locale,
  search,
  categorySlugs,
  pageSize = PROJECTS_PAGE_SIZE,
  enabled = true
}: UseProjectsParams) {
  return useInfiniteQuery({
    queryKey: ["projects", { locale, search, categorySlugs, pageSize}],
    queryFn: async ({ pageParam }) => {
      return getPaginatedProjects({
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