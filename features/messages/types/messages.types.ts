import type { Profile } from "@/features/profile/types/profiles.types"
import type { ReactionSummary } from "@/features/reactions/types/reactions.types"
import type { Cursor } from "@/features/shared/types/index.types"

export type MessageType = "personal" | "group"

export type MessageEntity = {
  id: string
  type: MessageType
  content: string
  user_id: string
  recipient_id: string | null
  reply_to_id: string | null
  created_at: string
  updated_at: string
}

export type Message = MessageEntity & {
  author: Profile
  recipient: Profile | null
  replied_message: {
    id: string
    content: string
  } | null
  reaction_summary: ReactionSummary
}

export type PaginatedMessages = {
  data: Message[]
  nextCursor: Cursor | null
  hasMore: boolean
}
