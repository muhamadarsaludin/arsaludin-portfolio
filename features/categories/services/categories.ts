"use server"

import { createClient } from "@/lib/supabase/server"
import type { Category, CategoryEntity, CategoryTargetType } from "../types/categories.types"

type GetAvailableCategoriesParams = {
  locale: string
  targetType: CategoryTargetType
}

type GetAvailableCategoriesResponse = Pick<CategoryEntity, "id" | "slug" | "is_show">
  & {
    category_translations: {
      name: string
      i18n: {
        locale: string
      }
    }[]
  }
  & Record<string, { id: string, is_show: boolean}[]>

export async function getAvailableCategories({ 
  locale,
  targetType 
}: GetAvailableCategoriesParams): Promise<Category[]> {
  const supabase = await createClient()
  const relationTable = `${targetType}_categories`
  
  const { data, error } = await supabase
    .from("categories")
    .select<string, GetAvailableCategoriesResponse>(`
      id,
      slug,
      is_show,
      category_translations!inner(
        name,
        i18n!inner(
          locale
        )
      ),
      ${relationTable}!inner(
        id,
        is_show
      )
    `)
    .eq("is_show", true)
    .eq("category_translations.i18n.locale", locale)
    .eq(`${relationTable}.is_show`, true)
    .order("slug", { ascending: true })

  if (error) {
    console.error("[getAvailableCategories] Error:", error)
    throw error
  }

  if (!data) return []

  return data.map((item) => {
    const translation = item.category_translations?.[0]
    return {
      id: item.id,
      slug: item.slug,
      is_show: item.is_show,
      name: translation?.name ?? "",
    }
  })
}