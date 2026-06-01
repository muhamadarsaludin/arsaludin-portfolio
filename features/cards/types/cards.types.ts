import type { Profile } from "@/features/profile/types/profiles.types"
import type { ReactionSummary } from "@/features/reactions/types/reactions.types"
import type { Cursor } from "@/features/shared/types/index.types"

export type CardStatus = "ideas" | "planned" | "in-progress" | "released"
export type CardType = "feature" | "bug" | "improvement" | "refactor"
export type CardPriority = "low" | "medium" | "high"

export type CardEntity = {
  id: string
  slug: string
  title: string
  description: string | null
  status: CardStatus
  type: CardType
  priority: CardPriority
  order_index: number
  user_id: string
  created_at: string
  updated_at: string
}

export type Card = CardEntity & {
  author: Profile
  comment_count: number
  reaction_summary: ReactionSummary
}

export type PaginatedCards = {
  data: Card[]
  nextCursor: Cursor | null
  hasMore: boolean
}
