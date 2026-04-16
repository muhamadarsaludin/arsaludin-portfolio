"use server"

import { createClient } from "@/lib/supabase/server"
import type { Project, ProjectEntity, ProjectTranslationEntity } from "../types/projects.types"
import { MAX_TOP_REACTIONS } from "@/features/reactions/constants/reactions.constants"
import { Skill } from "@/features/skills/types/skills.types"
import { Reaction, ReactionCount } from "@/features/reactions/types/reactions.types"

type GetFeaturedProjectsParams = {
  locale: string
}

type GetFeaturedProjectsResponse = Pick<
  ProjectEntity, 
  "id" | "slug" | "thumbnail" | "url" | "github_url" | "is_show" | "is_featured" | "order_index"
> & {
  translations: (Pick<
    ProjectTranslationEntity, "name" | "description" | "content" | "additional_info" | "additional_info_label"
  > & {
    i18n: { locale: string }
  })[]
  skills: {
    is_show: boolean
    order_index: number
    skill: Skill
  }[]
  comments: { count: number }[]
  reaction_counts: ReactionCount[]
  reactions: Reaction[]
}

/**
 * Fetches featured projects with localized content, associated skills, reactions, and comment counts.
 * @param locale - The language code to filter translations (e.g., 'en', 'id'). Defaults to the application's default locale.
 * @returns A promise that resolves to an array of formatted Project objects.
 * @throws Will throw an error if the Supabase query fails.
 */
export async function getFeaturedProjects({
  locale
}: GetFeaturedProjectsParams): Promise<Project[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const columns = `
    id,
    slug,
    thumbnail,
    url,
    github_url,
    is_show,
    is_featured,
    order_index,
    translations:project_translations!inner (
      name,
      description,
      content,
      additional_info,
      additional_info_label,
      i18n!inner (
        locale
      )
    ),
    skills:project_skills (
      is_show,
      order_index,
      skill:skills!inner (
        id,
        name,
        icon,
        link
      )
    ),
    comments(count),
    reaction_counts:project_reaction_counts(
      emoji,
      count
    ),
    reactions(
      id,
      emoji,
      user_id,
      created_at,
      updated_at,
      author:profiles(
        id,
        full_name,
        email,
        role,
        avatar_url
      )
    ) 
  `

  const { data, error } = await supabase
    .from("projects")
    .select<string, GetFeaturedProjectsResponse>(columns)
    .eq("is_show", true)
    .eq("is_featured", true)
    .eq("project_translations.i18n.locale", locale)
    .eq("project_skills.is_show", true)
    .eq("reactions.user_id", user?.id ?? "00000000-0000-0000-0000-000000000000")
    .order("order_index", { ascending: true })
    .order("order_index", {
      referencedTable: "project_skills",
      ascending: true,
    })
    .order("count", {
      referencedTable: "project_reaction_counts",
      ascending: false,
    })


  if (error) {
    console.error("Error fetching projects:", error)
    throw error
  }

  if (!data) return []

  return data.map((project: GetFeaturedProjectsResponse): Project => {
    const t = project.translations?.[0]
    const skills = project.skills?.map((ps) => ps.skill).filter(Boolean) ?? []
    const commentCount = project.comments?.[0]?.count ?? 0
    const userReaction = project.reactions?.[0] ?? null
    const allReactions = project.reaction_counts || []
    const totalEmojis = allReactions.length
    const totalReactions = allReactions.reduce(
      (acc, curr) => acc + (curr.count || 0), 
      0
    )

    return {
      id: project.id,
      slug: project.slug,
      thumbnail: project.thumbnail,
      url: project.url ?? null,
      github_url: project.github_url ?? null,
      is_show: project.is_show,
      is_featured: project.is_featured,
      order_index: project.order_index,
      name: t?.name ?? "",
      description: t?.description ?? "",
      content: t?.content ?? null,
      additional_info: t?.additional_info ?? null,
      additional_info_label: t?.additional_info_label ?? null,
      skills,
      comment_count: commentCount,
      reaction_summary: {
        userReaction,
        allReactions,
        totalReactions,
        totalEmojis,
      }
    }
  })
}
