import type { Profile } from "@/features/profile/types/profiles.types"
import type { ReactionSummary } from "@/features/reactions/types/reactions.types"
import type { Cursor } from "@/features/shared/types/index.types"

/**
 * Valid entity types that can receive comments within the portfolio system.
 */
export type CommentTargetType = "project" | "comment" | "card" | "article"

/**
 * COMMENT ENTITY
 * Raw data from 'comments' table.
 * Implements a Multiple Nullable Foreign Key pattern for polymorphic relations.
 */
export type CommentEntity = {
  id: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
  // Reply (Nullable FK)
  parent_id: string | null
  recipient_id: string | null
  reply_to_id: string | null
  // Nullable FK
  project_id: string | null
  card_id: string | null
}


// ================== INFORMATION =================
// Note: Named 'CommentData' instead of 'Comment'
// to avoid naming conflicts with the built-in
// Web DOM 'Comment' interface.

/**
 * COMMENT DATA (Public)
 * Flattened object for UI Portfolio.
 */
export type CommentData = Pick<CommentEntity, "id" | "content" | "user_id" | "created_at" | "updated_at" | "parent_id" | "recipient_id" | "reply_to_id">
  & {
    author: Profile
    recipient: Profile | null
    reply_count: number
    reaction_summary: ReactionSummary
  }

/**
 * Paginated list of comments.
 */
export type PaginatedComments = {
  data: CommentData[]
  nextCursor: Cursor | null
  hasMore: boolean
}
