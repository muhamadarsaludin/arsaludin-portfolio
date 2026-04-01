export type Reaction = {
  emoji: string
  user_id: string
}

export type ReactionCount = {
  emoji: string
  count: number
}

export type ReactionSummary = {
  hasReactions: boolean
  userReaction: Reaction | null
  totalReactions: number
  all: ReactionCount[]
  top: ReactionCount[]
  total: number
  remaining: number
}
