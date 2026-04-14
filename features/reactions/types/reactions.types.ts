import type { Profile } from "@/features/profile/types/profiles.types"
import type { Cursor } from "@/features/shared/types/index.types"

export type Reaction = {
  id: string
  emoji: string
  user_id: string
  author: Profile
  created_at: string
  updated_at: string | null
}

export type ReactionCount = {
  emoji: string
  count: number
}

export type ReactionTargetType = "project" | "comment" | "achievement" | "testimonial"

export type ReactionSummary = {
  userReaction: Reaction | null
  totalReactions: number
  allReactions: ReactionCount[]
  topReactions: ReactionCount[]
  totalEmojis: number
  remainingEmojis: number
}

export type PaginatedReactions = {
  data: Reaction[]
  nextCursor: Cursor | null
  hasMore: boolean
}
