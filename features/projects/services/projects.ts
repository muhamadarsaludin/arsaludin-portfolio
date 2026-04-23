"use server"

import { createClient } from "@/lib/supabase/server"
import type { PaginatedProjects, Project, ProjectEntity, ProjectTranslationEntity } from "../types/projects.types"
import { Skill } from "@/features/skills/types/skills.types"
import { Reaction, ReactionCount } from "@/features/reactions/types/reactions.types"
import { Category } from "@/features/categories/types/categories.types"
import { Cursor } from "@/features/shared/types/index.types"
import { PROJECTS_PAGE_SIZE } from "../constants/projects.types"

type ProjectRawResponse = Pick<
  ProjectEntity, 
  "id" | "slug" | "thumbnail" | "url" | "github_url" | "is_show" | "is_featured" | "order_index" | "created_at"
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
  categories: {
    is_show: boolean
    category: Category
  }[]
  comments: { count: number }[]
  reaction_counts: ReactionCount[]
  reactions: Reaction[]
}


type GetFeaturedProjectsParams = {
  locale: string
}

// --- HELPERS ---
const getColumns = (isFilteringCategory: boolean = false) => `
  id,
  slug,
  thumbnail,
  url,
  github_url,
  is_show,
  is_featured,
  order_index,
  created_at,
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
  categories:project_categories${isFilteringCategory ? "!inner" : ""}(
    is_show,
    category:categories!inner(
      id,
      name,
      slug,
      is_show
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

const mapToProject = (project: ProjectRawResponse): Project => {
  const t = project.translations?.[0]
  const skills = project.skills?.map((ps) => ps.skill).filter(Boolean) ?? []
  const categories = project.categories?.map((pc) => pc.category).filter(Boolean) ?? [] 
  const commentCount = project.comments?.[0]?.count ?? 0
  const userReaction = project.reactions?.[0] ?? null
  const allReactions = project.reaction_counts || []

  return {
    ...project,
    url: project.url ?? null,
    github_url: project.github_url ?? null,
    thumbnail: project.thumbnail ?? null,
    name: t?.name ?? "",
    description: t?.description ?? "",
    content: t?.content ?? null,
    additional_info: t?.additional_info ?? null,
    additional_info_label: t?.additional_info_label ?? null,
    skills,
    categories,
    comment_count: commentCount,
    reaction_summary: {
      userReaction,
      allReactions,
      totalReactions: allReactions.reduce((acc, curr) => acc + (curr.count || 0), 0),
      totalEmojis: allReactions.length,
    }
  }
}

// --- MAIN FUNCTION ---
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
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id ?? "00000000-0000-0000-0000-000000000000"

  const { data, error } = await supabase
    .from("projects")
    .select<string, ProjectRawResponse>(getColumns())
    .eq("is_show", true)
    .eq("is_featured", true)
    .eq("project_translations.i18n.locale", locale)
    .eq("project_skills.is_show", true)
    .eq("project_categories.is_show", true)
    .eq("project_categories.categories.is_show", true)
    .eq("reactions.user_id", userId)
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .order("order_index", {
      referencedTable: "project_skills",
      ascending: true,
    })
    .order("count", {
      referencedTable: "project_reaction_counts",
      ascending: false,
    })

  if (error) {
    console.error("Error fetching featured projects:", error)
    throw error
  }

  return (data || []).map(mapToProject)
}

type GetPaginatedProjectsParams = {
  locale: string
  search?: string
  categorySlugs?: string[]
  pageSize?: number
  cursor?: Cursor
}

export async function getPaginatedProjects({
  locale,
  search,
  categorySlugs,
  pageSize = PROJECTS_PAGE_SIZE,
  cursor,
}: GetPaginatedProjectsParams): Promise<PaginatedProjects> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userId = user?.id ?? "00000000-0000-0000-0000-000000000000";
  const isFilteringCategory = !!(categorySlugs && categorySlugs.length > 0)

  let query = supabase
    .from("projects")
    .select<string, ProjectRawResponse>(getColumns(isFilteringCategory))
    .eq("is_show", true)
    .eq("project_translations.i18n.locale", locale)
    .eq("project_skills.is_show", true)
    .eq("project_categories.is_show", true)
    .eq("project_categories.categories.is_show", true)
    .eq("reactions.user_id", userId)
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .order("order_index", {
      referencedTable: "project_skills",
      ascending: true,
    })
    .order("count", {
      referencedTable: "project_reaction_counts",
      ascending: false,
    })
    .limit(pageSize + 1)

  if (search) {
    query = query.ilike("project_translations.name", `%${search}%`)
  }

  if (isFilteringCategory) {
    query = query.in("project_categories.categories.slug", categorySlugs)
  }

  if (cursor && cursor.order_index !== undefined) {
    query = query.or(
      `order_index.gt.${cursor.order_index},` +
      `and(order_index.eq.${cursor.order_index},created_at.lt.${cursor.created_at}),` +
      `and(order_index.eq.${cursor.order_index},created_at.eq.${cursor.created_at},id.lt.${cursor.id})`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error(`[getPaginatedProjects] Error fetching achievements:`, error)
    throw error
  }

  if (!data || data.length === 0) {
    return { 
      data: [], 
      nextCursor: null, 
      hasMore: false 
    }
  }

  const hasMore = data.length > pageSize
  const trimmedData = hasMore ? data.slice(0, pageSize) : data
  const mappedData = trimmedData.map(mapToProject)
  const lastItem = mappedData[mappedData.length - 1]

  return {
    data: mappedData,
    nextCursor: hasMore
      ? {
          created_at: lastItem.created_at,
          id: lastItem.id,
          order_index: lastItem.order_index ?? 0,
        }
      : null,
    hasMore,
  }
}