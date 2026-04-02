import { Profile } from "./profiles"

// ================== INFORMATION =================
// Note: Named 'CommentData' instead of 'Comment' 
// to avoid naming conflicts with the built-in 
// Web DOM 'Comment' interface.

export type CommentData = {
  id: number
  content: string
  user_id: string
  target_id: number
  target_type: string
  parent_id: number | null
  created_at: string
  author: Profile
  reply_profile: Profile | null
}