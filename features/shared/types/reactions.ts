export type Reaction = {
  emoji: string
  count: number
}

export type ReactionSummary = {
  all: Reaction[]
  top: Reaction[]
  remaining: number
  total: number
  isLimit: boolean;
}