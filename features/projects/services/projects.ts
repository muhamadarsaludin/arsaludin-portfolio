import { createClient } from "@/lib/supabase/server"
import { routing } from "@/i18n/routing"
import type { Project, ProjectTranslation } from "../types/projects"

/**
 * Fetches projects with localized content, associated skills, reactions, and comment counts.
 * * @param locale - The language code for localization (defaults to routing.defaultLocale).
 * @param isFeatured - If `true`, filters the results to only include featured projects.
 * @param isAdminView - If `true`, bypasses visibility filters and includes administrative 
 * metadata (user_id, timestamps).
 * @returns A promise that resolves to an array of formatted Project objects.
 * @throws Will throw an error if the Supabase query fails.
 */
export async function getProjects(
  locale: string = routing.defaultLocale,
  isFeatured: boolean = false,
  isAdminView: boolean = false,
): Promise<Project[]> {
  const supabase = await createClient()

  // Define the selection columns.
  // Using ternary for isAdminView to prevent "false" string injection in the query.
  const columns = `
    id,
    slug,
    thumbnail,
    github_url,
    url,
    is_show,
    is_featured,
    order_index,
    ${isAdminView ? "user_id, created_at, updated_at," : ""}
    project_translations!inner (
      name,
      description,
      content,
      additional_info,
      additional_info_label,
      i18n!inner (
        locale
      )
    ),
    project_skills (
      is_show,
      order_index,
      skills ( 
        name,
        icon,
        link
      )
    ),
    comments(count),
    project_reaction_counts(
      emoji,
      count
    ),
    reactions(
      emoji,
      user_id
    ) 
  `

  let query = supabase
    .from("projects")
    .select(columns)
    .eq("project_translations.i18n.locale", locale)
    .order("order_index", { ascending: true })
    .order("order_index", { referencedTable: "project_skills", ascending: true })

  if (isFeatured) {
    query = query.eq("is_featured", true)
  }

  // Apply visibility filters for non-admin views
  if (!isAdminView) {
    query = query
      .eq("is_show", true)
      .eq("project_skills.is_show", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching projects:", error)
    throw error
  }
  
  if (!data) return []

  /**
   * Map and flatten the database response to match the Project interface.
   * This simplifies the nested structure for easier consumption in UI components.
   */
  return data.map((project: any) => {
    const t = project.project_translations?.[0] as ProjectTranslation | undefined
    const skills = project.project_skills
      ?.map((ps: any) => ps.skills)
      .filter(Boolean) || []

    return {
      id: project.id,
      slug: project.slug,
      name: t?.name ?? "",
      description: t?.description ?? "",
      thumbnail: project.thumbnail,
      is_show: project.is_show,
      is_featured: project.is_featured,
      order_index: project.order_index,

      content: t?.content ?? null,
      github_url: project.github_url ?? null,
      url: project.url ?? null,
      user_id: project.user_id ?? null,
      created_at: project.created_at ?? null,
      updated_at: project.updated_at ?? null,
      
      additional_info: (t?.additional_info || t?.additional_info_label) ? {
        label: t?.additional_info_label ?? null,
        content: t?.additional_info ?? null,
      } : null,
      skills: skills,
      comment_count: project.comments?.[0]?.count ?? 0,

      // Pass through reaction data
      // reaction_counts: project.project_reaction_counts || [],
      // user_reactions: project.reactions || []
    } as Project
  })
}