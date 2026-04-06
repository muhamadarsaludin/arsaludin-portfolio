import { Profile } from "@/features/profile/types/profiles"
import { Cursor } from "@/features/shared/types"


// ================== INFORMATION =================
// Note: Named 'CommentData' instead of 'Comment' 
// to avoid naming conflicts with the built-in 
// Web DOM 'Comment' interface.

export type CommentData = {
  id: string
  content: string
  user_id: string
  created_at: string
  replies_count: number
  author: Profile
  recipient: Profile | null
  parent_id: string | null
  updated_at: string | null
}

export type CommentTargetType = "project" | "comment" 

export type PaginatedComments = {
  data: CommentData[]
  nextCursor: Cursor | null
  hasMore: boolean
}
