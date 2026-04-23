"use server"

import { createClient } from "@/lib/supabase/server"
import { Achievement, AchievementEntity, PaginatedAchievements } from "../types/achievements.types"
import { Reaction, ReactionCount } from "@/features/reactions/types/reactions.types"
import { Category } from "@/features/categories/types/categories.types"
import { Cursor } from "@/features/shared/types/index.types"
import { ACHIEVEMENTS_PAGE_SIZE } from "../constants/achievements.types"

type AchievementRawResponse = Pick<
  AchievementEntity, "id" | "name" | "type" | "image" | "issuing_organization" | "organization_logo" | "credential_url" | "credential_id" | "issue_date" | "expiration_date" | "is_show" | "is_featured" | "order_index" | "created_at"
>
  & {
    categories: {
      is_show: boolean;
      category: Category;
    }[];
    reaction_counts: ReactionCount[]
    reactions: Reaction[]
  }

// --- HELPERs ---
const mapToAchievement = (achievement: AchievementRawResponse): Achievement => {
  const categories = achievement.categories?.map((ac) => ac.category).filter(Boolean) ?? []
  const userReaction = achievement.reactions?.[0] ?? null
  const allReactions = achievement.reaction_counts || []
  
  return {
    ...achievement,
    organization_logo: achievement.organization_logo ?? null,
    credential_id: achievement.credential_id ?? null,
    expiration_date: achievement.expiration_date ?? null,
    categories,
    reaction_summary: {
      userReaction,
      allReactions,
      totalReactions: allReactions.reduce((acc, curr) => acc + (curr.count || 0), 0),
      totalEmojis: allReactions.length,
    }
  }
}

const getColumns = (isFilteringCategory: boolean = false) => `
    id,
    name,
    type,
    image,
    issuing_organization,
    organization_logo,
    credential_url,
    credential_id,
    issue_date,
    expiration_date,
    is_show,
    is_featured,
    order_index,
    created_at,
    categories:achievement_categories${isFilteringCategory ? "!inner" : ""}(
      is_show,
      category:categories!inner(
        id,
        name,
        slug,
        is_show
      )
    ),
    reaction_counts:achievement_reaction_counts(
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

// --- MAIN FUNCTION ---
export async function getFeaturedAchievements(): Promise<Achievement[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? "00000000-0000-0000-0000-000000000000";

  const { data, error } = await supabase
    .from("achievements")
    .select<string, AchievementRawResponse>(getColumns())
    .eq("is_show", true)
    .eq("is_featured", true)
    .eq("achievement_categories.is_show", true)
    .eq("achievement_categories.categories.is_show", true)
    .eq("reactions.user_id", userId)
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("issue_date", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .order("count", {
      referencedTable: "achievement_reaction_counts",
      ascending: false,
    })

  if (error) {
    console.error("Error fetching featured achievements:", error)
    throw error
  }

  return (data || []).map(mapToAchievement)
}

type GetPaginatedAchievementsParams = {
  search?: string
  types?: string[]
  categorySlugs?: string[]
  cursor?: Cursor
  pageSize?: number
}

export async function getPaginatedAchievements({
  search,
  types,
  categorySlugs,
  cursor,
  pageSize = ACHIEVEMENTS_PAGE_SIZE,
}: GetPaginatedAchievementsParams): Promise<PaginatedAchievements> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userId = user?.id ?? "00000000-0000-0000-0000-000000000000";
  const isFilteringCategory = !!(categorySlugs && categorySlugs.length > 0)

  let query = supabase
    .from("achievements")
    .select<string, AchievementRawResponse>(getColumns(isFilteringCategory))
    .eq("is_show", true)
    .eq("achievement_categories.is_show", true)
    .eq("achievement_categories.categories.is_show", true)
    .eq("reactions.user_id", userId)
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("issue_date", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .order("count", {
      referencedTable: "achievement_reaction_counts",
      ascending: false,
    })
    .limit(pageSize + 1)

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  if (types && types.length > 0) {
    query = query.in("type", types)
  }

  if (isFilteringCategory) {
    query = query.in("achievement_categories.categories.slug", categorySlugs)
  }

  if (cursor && cursor.order_index !== undefined && cursor.issue_date) {
    query = query.or(
      `order_index.gt.${cursor.order_index},` +
      `and(order_index.eq.${cursor.order_index},issue_date.lt.${cursor.issue_date}),` +
      `and(order_index.eq.${cursor.order_index},issue_date.eq.${cursor.issue_date},created_at.lt.${cursor.created_at}),` +
      `and(order_index.eq.${cursor.order_index},issue_date.eq.${cursor.issue_date},created_at.eq.${cursor.created_at},id.lt.${cursor.id})`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error(`[getPaginatedAchievements] Error fetching achievements:`, error)
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
  
  const mappedData = trimmedData.map(mapToAchievement)
  const lastItem = mappedData[mappedData.length - 1]

  return {
    data: mappedData,
    nextCursor: hasMore
      ? {
          created_at: lastItem.created_at,
          id: lastItem.id,
          order_index: lastItem.order_index ?? 0,
          issue_date: lastItem.issue_date
        }
      : null,
    hasMore,
  }
}
