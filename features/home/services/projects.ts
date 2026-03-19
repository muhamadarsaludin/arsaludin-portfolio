// /services/project.service.ts
import { createClient } from "@/lib/supabase/server"
import {routing} from "@/i18n/routing"

// 🔹 Type: Categories (nested array dari Supabase)
type ProjectCategory = {
  categories: {
    category: string
  }[]
}

// 🔹 Type: Translation (i18n juga array)
type ProjectTranslation = {
  title: string | null
  description: string | null
  content: string | null
  additional_info: string | null
  additional_info_label: string | null
  i18n: {
    locale: string
  }[]
}

export async function getFeaturedProjects(locale: string = routing.defaultLocale) {
  const supabase = await createClient()
  const {data, error} = await supabase
  .from("projects")
  .select(`
    id,
    name,
    slug,
    thumbnail,
    github_url,
    url,
    created_at,
    order_index,
    project_translations!inner (
      description,
      content,
      additional_info,
      additional_info_label,
      i18n!inner (
        locale
      )
    ),
    project_categories (
      categories(category)
    )
  `)
  .eq("is_featured", true)
  .eq("project_translations.i18n.locale", locale)
  .order("order_index", { ascending: true })
  .limit(3)

  if (error) {
    console.error("Supabase Error:", error)
    throw error
  }

  if (!data) return []

  return data.map((project) => {
    const t = project.project_translations?.[0] as ProjectTranslation | undefined

    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      thumbnail: project.thumbnail,
      github_url: project.github_url,
      url: project.url,
      order_index: project.order_index,

      // 🔹 translation (sudah ke-filter by locale di DB)
      description: t?.description ?? "",
      content: t?.content ?? "",
      additional_info: t?.additional_info ?? "",
      additional_info_label: t?.additional_info_label ?? "",

      // 🔹 categories (flatten dari nested array)
      categories:
        (project.project_categories as ProjectCategory[])
          ?.flatMap((c) => c.categories)
          .map((cat) => cat.category)
          .filter(Boolean) ?? [],
    }
  })
}