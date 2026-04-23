import { Cursor } from '../../shared/types/index.types';
import { useInfiniteQuery } from "@tanstack/react-query"
import { PROJECTS_PAGE_SIZE } from '../constants/projects.types';
import { getPaginatedProjects } from '../services/projects';

type UseProjectsProps = {
  locale: string 
  search?: string
  categorySlugs?: string[]
  pageSize?: number
  cursor?: Cursor | undefined
  enabled?: boolean
}

export function useInfiniteProjects({
  locale,
  search,
  categorySlugs,
  pageSize = PROJECTS_PAGE_SIZE,
  enabled = true
}: UseProjectsProps) {
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