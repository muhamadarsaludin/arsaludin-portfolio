export type Reaction = {
  emoji: string
  count: number
}

export type ReactionSummary = {
  hasReactions: boolean
  all: Reaction[]
  top: Reaction[]
  total: number
  remaining: number
  isTruncated: boolean
}
