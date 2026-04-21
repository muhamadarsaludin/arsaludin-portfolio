import { Category } from "@/features/categories/types/categories.types"
import type { ReactionSummary } from "@/features/reactions/types/reactions.types"
import { Cursor } from "@/features/shared/types/index.types"

/**
 * ACHIEVEMENT ENTITY
 * Raw data from 'achievements' table.
 */

export type AchievementEntity = {
  id: string
  name: string
  type: string
  image: string
  issuing_organization: string
  organization_logo: string | null
  credential_url: string
  credential_id: string | null
  issue_date: string
  expiration_date: string | null
  is_show: boolean
  is_featured: boolean
  order_index: number
  user_id: string
  created_at: string
  updated_at: string
}

/**
 * ACHIEVEMENT CATEGORY ENTITY
 * Raw data from 'achievement_categories' table.
 */
export type AchievementCategoryEntity = {
  id: string
  Achievement_id: string
  category_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export type Achievement = Pick<
  AchievementEntity,
  "id" | "name" | "type" | "image" | "issuing_organization" | "organization_logo" | "credential_url" | "credential_id" | "issue_date" | "expiration_date" | "is_show" | "is_featured" | "order_index" | "created_at">
  & { 
    categories: Category[]
    reaction_summary: ReactionSummary
  }

export type PaginatedAchievements = {
  data: Achievement[]
  nextCursor: Cursor | null
  hasMore: boolean
}