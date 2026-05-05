import { CardPriority, CardStatus, CardType } from "../types/cards.types"

export const CARDS_PAGE_SIZE = 10

export const CARD_TYPES: CardType[] = [
  "feature",
  "bug",
  "improvement",
  "refactor"
] as const

export const CARD_PRIORITIES: CardPriority[] = [
  "low",
  "medium",
  "high"
] as const

export const CARD_STATUS: CardStatus[] = [
  "ideas",
  "planned",
  "in-progress",
  "released"
] as const