import { useQuery } from "@tanstack/react-query"
import { getFeaturedProjects } from "../services/projects"

type UseFeaturedProjectsParams = {
  locale: string
}

/**
 * Custom hook to fetch featured projects.
 * @param locale - The language code (e.g., 'en', 'id') for content translation.
 * @returns The query result containing an array of Project objects.
 */
export function useFeaturedProjects({ locale }: UseFeaturedProjectsParams) {
  return useQuery({
    queryKey: ["featured-projects", locale],
    queryFn: () => getFeaturedProjects({ locale }),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })
}
