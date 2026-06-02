import type { Profile } from "@/features/profile/types/profiles.types"
import type { Cursor } from "@/features/shared/types/index.types"

/**
 * Valid entity types that can receive reactions within the portfolio system.
 */
export type ReactionTargetType =
  | "project"
  | "comment"
  | "achievement"
  | "testimonial"
  | "message"
  | "card"
  | "article"

/**
 * REACTION ENTITY
 * Raw data from 'reactions' table.
 * Implements a Multiple Nullable Foreign Key pattern for polymorphic relations.
 */
export type ReactionEntity = {
  id: string
  emoji: string
  user_id: string
  created_at: string
  updated_at: string | null
  // Nullable FK
  comment_id: string | null
  project_id: string | null
  achievement_id: string | null
  testimonial_id: string | null
  message_id: string | null
  card_id: string | null
}

/**
 * REACTION (Public)
 * Flattened object for UI Portfolio.
 */
export type Reaction = Pick<
  ReactionEntity,
  "id" | "emoji" | "user_id" | "created_at" | "updated_at"
> & {
  author: Profile
}

/**
 * REACTION COUNT (Public)
 * Aggregated reaction data from `${target}_reaction_counts` view table
 */
export type ReactionCount = {
  emoji: string
  count: number
}

/**
 * Comprehensive summary of reactions for a specific target, used in reaction pickers and previews.
 */
export type ReactionSummary = {
  allReactions: ReactionCount[]
  totalReactions: number
  totalEmojis: number
}

/**
 * Paginated list of reactions for "Who reacted" features.
 */
export type PaginatedReactions = {
  data: Reaction[]
  nextCursor: Cursor | null
  hasMore: boolean
}
