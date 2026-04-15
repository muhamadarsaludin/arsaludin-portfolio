import { useQuery } from "@tanstack/react-query"
import { getFeaturedProjects } from "../services/projects"

type UseFeaturedProjectsProps = {
  locale: string
}

/**
 * Custom hook to fetch and manage localized featured projects for the public portfolio.
 * @param props - The hook properties.
 * @param props.locale - The language code (e.g., 'en', 'id') for content translation.
 * @returns The query result containing an array of Project objects.
 */
export function useFeaturedProjects({
  locale,
}: UseFeaturedProjectsProps) {
  return useQuery({
    queryKey: ["featured-projects", locale],
    queryFn: () => getFeaturedProjects({ locale }),
    refetchOnWindowFocus: false,
  })
}
