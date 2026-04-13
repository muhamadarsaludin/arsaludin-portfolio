"use server"

import { createClient } from "@/lib/supabase/server"
import { MAX_TOP_REACTIONS } from "@/features/reactions/constants/reactions.constants"
import { Achievement } from "../types/achievements.types"

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
    user_id, 
    created_at, 
    updated_at,
    achievement_reaction_counts(
      emoji,
      count
    ),
    achievement_categories(
      categories(
        category
      )
    ),
    reactions(
      emoji,
      user_id
    ) 
  `

  let query = supabase
    .from("achievements")
    .select(columns)
    .eq("is_show", true)
    .eq("is_featured", true)
    .eq("reactions.user_id", user?.id ?? "00000000-0000-0000-0000-000000000000")
    .order("order_index", { ascending: true })
    .order("count", {
      referencedTable: "achievement_reaction_counts",
      ascending: false,
    })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching featured achievements:", error)
    throw error
  }

  if (!data) return []

  return data.map((achievement: any) => {
    const allReactions = achievement.achievement_reaction_counts || []
    const userReaction = achievement.reactions?.[0] ?? null
    const totalReactions = allReactions.reduce(
      (acc: number, curr: any) => acc + (curr.count || 0),
      0
    )
    const topReactions = allReactions.slice(0, MAX_TOP_REACTIONS)
    const totalEmojis = allReactions.length
    const remainingEmojis = Math.max(0, totalEmojis - MAX_TOP_REACTIONS)

    const categories = achievement.achievement_categories?.map(
      (ac: any) => ac.categories?.category
    ).filter(Boolean) || []

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
      user_id: achievement.user_id,
      created_at: achievement.created_at,
      updated_at: achievement.updated_at,
      reaction_summary: {
        userReaction,
        totalReactions,
        allReactions,
        topReactions,
        totalEmojis,
        remainingEmojis,
      },
      categories
    } as Achievement
  })
}
