// /services/project.service.ts
import { createClient } from "@/lib/supabase/server"
import {routing} from "@/i18n/routing"
import { SkillItem } from "@/features/shared/types/skills"

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

type ProjectSkill = {
  skills: SkillItem | null
}[]

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
    updated_at,
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
    skill_maps!inner (
      skills ( 
        name,
        icon,
        color
      )
    )
  `)
  .eq("is_featured", true)
  .eq("project_translations.i18n.locale", locale)
  .order("order_index", { ascending: true })
  .limit(3)
  .eq("skill_maps.is_show", true)
  .eq("skill_maps.target_type", "project")
  .order("order_index", { referencedTable: "skill_maps", ascending: true })

  if (error) {
    console.error("Supabase Error:", error)
    throw error
  }

  if (!data) return []

  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" })

  return data.map((project) => {
    const t = project.project_translations?.[0] as ProjectTranslation | undefined
    const skills =
        (project.skill_maps as unknown as ProjectSkill)
          ?.map((s) => s.skills)
          .filter((skill) => skill !== null) as SkillItem[] ?? []

    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      thumbnail: project.thumbnail,
      github_url: project.github_url,
      url: project.url,
      description: t?.description ?? "",
      content: t?.content ?? "",
      additional_info: t?.additional_info ?? "",
      additional_info_label: t?.additional_info_label ?? "",
      skills,
      created_at: dateFormatter.format(new Date(project.created_at)),
      update_at: dateFormatter.format(new Date(project.updated_at)),
      order_index: project.order_index
    }
  })
}