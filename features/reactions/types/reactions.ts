export type Reaction = {
  id: string
  emoji: string
  user_id: string
  created_at: string | null
  updated_at: string | null
}

export type ReactionCount = {
  emoji: string
  count: number
}

export type ReactionTargetType = "project" | "comment"

export type ReactionSummary = {
  userReaction: Reaction | null
  totalReactions: number
  topReactions: ReactionCount[]
  totalEmojis: number
  remainingEmojis: number
}
