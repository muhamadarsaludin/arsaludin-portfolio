import { createClient } from "@/lib/supabase/server"
import { routing } from "@/i18n/routing"
import { Skill } from "@/features/shared/types/skills"
import type { Project } from "../types/projects"
import { TOP_SKILLS_AMOUNT } from "@/features/shared/constants/skills"
import { TOP_REACTIONS_AMOUNT } from "@/features/shared/constants/reactions"
import { dateFormatter } from "@/utils/date-formater"
import { Reaction, ReactionCount } from "@/features/shared/types/reactions"

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

type ProjectSkills = {
  skills: Skill
}[]

export async function getProjects(
  locale: string = routing.defaultLocale,
  isFeatured: boolean = false,
  limit: number = 12,
  page: number = 1,
  topSkillsAmount: number = TOP_SKILLS_AMOUNT,
  topReactionsAmount: number = TOP_REACTIONS_AMOUNT
): Promise<Project[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from("projects")
    .select(
      `
      id,
      name,
      slug,
      thumbnail,
      github_url,
      url,
      order_index,
      created_at,
      updated_at,
      project_translations!inner (
        description,
        content,
        additional_info,
        additional_info_label,
        i18n!inner (
          locale
        )
      ),
      skill_maps (
        skills ( 
          name,
          icon,
          color
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
    )
    .eq("project_translations.i18n.locale", locale)
    .eq("skill_maps.is_show", true)
    .eq("skill_maps.target_type", "project")
    .eq("comments.target_type", "project")
    .eq("reactions.target_type", "project")
    .order("order_index", { ascending: true })
    .order("order_index", { referencedTable: "skill_maps", ascending: true })

  if (isFeatured) {
    query.eq("is_featured", true)
  }
  query = query.range(from, to)

  const { data, error } = await query

  if (error) {
    console.error("Supabase Error:", error)
    throw error
  }
  if (!data) return []

  return data.map((project) => {
    const t = project.project_translations?.[0] as ProjectTranslation | undefined
    const commentsCount = (project.comments as any)?.[0]?.count ?? 0
    const skills =
      (project.skill_maps as unknown as ProjectSkills)?.map((p) => p.skills).filter(Boolean) ?? []
    const userReaction = user
      ? ((project.reactions as Reaction[])?.find((r) => r.user_id === user.id) ?? null)
      : null
    const reactionCounts = (project.project_reaction_counts as ReactionCount[]) ?? []
    const sortedReactionCounts = [...reactionCounts].sort((a, b) => b.count - a.count)

    return {
      id: project.id,
      name: project.name,
      description: t?.description ?? "",
      slug: project.slug,
      thumbnail: project.thumbnail,
      github_url: project.github_url,
      url: project.url,
      content: t?.content ?? "",
      additional_info: {
        label: t?.additional_info ?? "",
        content: t?.additional_info ?? "",
      },
      comments_count: commentsCount,
      skill_summary: {
        hasSkills: skills.length > 0,
        all: skills,
        top: skills.slice(0, topSkillsAmount),
        total: skills.length,
        remaining: skills.length - topSkillsAmount,
      },
      reaction_summary: {
        hasReactions: reactionCounts.length > 0,
        userReaction: userReaction,
        totalReactions: sortedReactionCounts.reduce((sum, r) => sum + r.count, 0),
        all: sortedReactionCounts,
        top: sortedReactionCounts.slice(0, topReactionsAmount),
        total: reactionCounts.length,
        remaining: reactionCounts.length - topReactionsAmount,
      },
      order_index: project.order_index,
      created_at: project.created_at,
      updated_at: project.updated_at,
    }
  })
}
