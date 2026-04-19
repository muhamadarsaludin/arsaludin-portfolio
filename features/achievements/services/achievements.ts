"use server"

import { createClient } from "@/lib/supabase/server"
import { MAX_TOP_REACTIONS } from "@/features/reactions/constants/reactions.constants"
import { Achievement, AchievementEntity } from "../types/achievements.types"
import { Reaction, ReactionCount } from "@/features/reactions/types/reactions.types"
import { Category } from "@/features/categories/types/categories.types"

type GetFeaturedAchievementsResponse = Pick<
  AchievementEntity, "id" | "name" | "type" | "image" | "issuing_organization" | "organization_logo" | "credential_url" | "credential_id" | "issue_date" | "expiration_date" | "is_show" | "is_featured" | "order_index" 
>
  & {
    categories: {
      is_show: boolean;
      category: Category;
    }[];
    reaction_counts: ReactionCount[]
    reactions: Reaction[]
  }

export async function getFeaturedAchievements(): Promise<Achievement[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const columns = `
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
    categories:achievement_categories(
      is_show,
      category:categories!inner(
        id,
        name
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

  const { data, error } = await supabase
    .from("achievements")
    .select<string, GetFeaturedAchievementsResponse>(columns)
    .eq("is_show", true)
    .eq("is_featured", true)
    .eq("achievement_categories.is_show", true)
    .eq("reactions.user_id", user?.id ?? "00000000-0000-0000-0000-000000000000")
    .order("order_index", { ascending: true })
    .order("count", {
      referencedTable: "achievement_reaction_counts",
      ascending: false,
    })

  if (error) {
    console.error("Error fetching featured achievements:", error)
    throw error
  }

  if (!data) return []

  return data.map((achievement) => {
    const categories = achievement.categories?.map((ac) => ac.category).filter(Boolean) ?? []
    const userReaction = achievement.reactions?.[0] ?? null
    const allReactions = achievement.reaction_counts || []
    const totalEmojis = allReactions.length
    const totalReactions = allReactions.reduce(
      (acc, curr) => acc + (curr.count || 0), 
      0
    )

    return {
      id: achievement.id,
      name: achievement.name,
      type: achievement.type,
      image: achievement.image,
      issuing_organization: achievement.issuing_organization,
      organization_logo: achievement.organization_logo ?? null,
      credential_url: achievement.credential_url,
      credential_id: achievement.credential_id ?? null,
      issue_date: achievement.issue_date,
      expiration_date: achievement.expiration_date ?? null,
      is_show: achievement.is_show,
      is_featured: achievement.is_featured,
      order_index: achievement.order_index,
      categories,
      reaction_summary: {
        userReaction,
        allReactions,
        totalReactions,
        totalEmojis,
      }
    }
  })
}
