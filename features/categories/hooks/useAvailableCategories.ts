import { useQuery } from "@tanstack/react-query"
import type { Category, CategoryTargetType } from "../types/categories.types"
import { getAvailableCategories } from "../services/categories"

type UseAvailableCategoriesProps = {
  locale: string
  targetType: CategoryTargetType
}

/**
 * Custom hook to fetch and manage available categories.
 * @param props - The hook properties.
 * @param targetType - Defines the relationship type (e.g., 'project', 'comments') to target the correct DB column.
 * @returns The query result containing an array of Category objects.
 */
export function useAvailableCategories({ locale, targetType }: UseAvailableCategoriesProps) {
  return useQuery<Category[]>({
    queryKey: ["available-category", {locale, targetType}],
    queryFn: () => getAvailableCategories({ targetType, locale }),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  })
}
