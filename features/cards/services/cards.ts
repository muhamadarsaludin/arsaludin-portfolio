"use server"

import { supabase } from "@/lib/supabase/public"
import type { Card, CardPriority, CardType, PaginatedCards } from "../types/cards.types"
import type { Profile } from "@/features/profile/types/profiles.types"
import type { CardEntity, CardStatus } from "../types/cards.types"
import type { Reaction, ReactionCount } from "@/features/reactions/types/reactions.types"
import { CARDS_PAGE_SIZE } from "../constants/card.constants"
import { createClient } from "@/lib/supabase/server"
import type { Cursor } from "@/features/shared/types/index.types"
import { generateUniqueSlug } from "@/utils/slug"

type CardRawResponse = CardEntity & {
  author: Profile
  comments: { count: number }[]
  reaction_counts: ReactionCount[]
  reactions: Reaction[]
}

const CARDS_COLUMNS = `
  id,
  slug,
  title,
  description,
  status,
  type,
  priority,
  user_id,
  created_at,
  updated_at,
  author:user_id (
    id, 
    email, 
    full_name, 
    role, 
    avatar_url
  ),
  comments(count),
  reaction_counts:card_reaction_counts(
    emoji,
    count
  )
`

const mapToCard = (card: CardRawResponse): Card => {
  const commentCount = card.comments?.[0]?.count ?? 0
  const allReactions = card.reaction_counts || []

  return {
    ...card,
    description: card.description ?? null,
    author: card.author,
    comment_count: commentCount,
    reaction_summary: {
      allReactions,
      totalReactions: allReactions.reduce((acc, curr) => acc + (curr.count || 0), 0),
      totalEmojis: allReactions.length,
    },
  }
}

type GetPaginatedCardsByStatusParams = {
  status: CardStatus
  search?: string
  types?: CardType[]
  priorities?: CardPriority[]
  pageSize?: number
  cursor?: Cursor
}

export async function getPaginatedCardsByStatus({
  status,
  search,
  types,
  priorities,
  pageSize = CARDS_PAGE_SIZE,
  cursor,
}: GetPaginatedCardsByStatusParams): Promise<PaginatedCards> {
  let query = supabase
    .from("cards")
    .select<string, CardRawResponse>(CARDS_COLUMNS)
    .eq("status", status)
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .order("count", {
      referencedTable: "card_reaction_counts",
      ascending: false,
    })
    .limit(pageSize + 1)

  if (search) {
    query = query.ilike("title", `%${search}%`)
  }

  if (types && types.length > 0) {
    query = query.in("type", types)
  }

  if (priorities && priorities.length > 0) {
    query = query.in("priority", priorities)
  }

  if (cursor && cursor.order_index !== undefined) {
    query = query.or(
      `order_index.gt.${cursor.order_index},` +
        `and(order_index.eq.${cursor.order_index},created_at.lt.${cursor.created_at}),` +
        `and(order_index.eq.${cursor.order_index},created_at.eq.${cursor.created_at},id.lt.${cursor.id})`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("[getPaginatedCardsByStatus] Error fetching cards:", error)
    throw error
  }

  if (!data || data.length === 0) {
    return {
      data: [],
      nextCursor: null,
      hasMore: false,
    }
  }

  const hasMore = data.length > pageSize
  const trimmedData = hasMore ? data.slice(0, pageSize) : data
  const mappedData = trimmedData.map(mapToCard)
  const lastItem = mappedData[mappedData.length - 1]

  return {
    data: mappedData,
    nextCursor: hasMore
      ? {
          created_at: lastItem.created_at,
          id: lastItem.id,
          order_index: lastItem.order_index ?? 0,
        }
      : null,
    hasMore,
  }
}

export async function getCard({ cardId }: { cardId: string }): Promise<Card | null> {
  const { data, error } = await supabase
    .from("cards")
    .select<string, CardRawResponse>(CARDS_COLUMNS)
    .eq("id", cardId)
    .maybeSingle()

  if (error) {
    console.error("[getCard] Error fetching card:", error)
    throw error
  }

  return data ? mapToCard(data) : null
}

export async function createCard(
  payload: Pick<CardEntity, "title" | "description" | "status" | "type" | "priority">
): Promise<Card> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized: User must be authenticated to create card.")

  const slug = generateUniqueSlug(payload.status)

  const { data: lastCard } = await supabase
    .from("cards")
    .select("order_index")
    .eq("status", payload.status)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextOrderIndex = (lastCard?.order_index ?? 0) + 1000

  const { data, error } = await supabase
    .from("cards")
    .insert([{ ...payload, slug: slug, user_id: user.id, order_index: nextOrderIndex }])
    .select<string, CardRawResponse>(CARDS_COLUMNS)
    .single()

  if (error) {
    console.error("[createdCard] Failed to create card:", error)
    throw error
  }
  return mapToCard(data)
}

export async function updateCard({
  cardId,
  payload,
}: {
  cardId: string
  payload: Partial<Pick<CardEntity, "title" | "description" | "status" | "type" | "priority">>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized: User must be authenticated to update card.")

  const [{ data: card, error: cardError }, { data: profile }] = await Promise.all([
    supabase.from("cards").select("user_id").eq("id", cardId).maybeSingle(),
    supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(),
  ])

  if (cardError || !card) {
    console.error(`[updateCard Error]: Card with ID ${cardId} not found.`)
    throw new Error("Card not found")
  }

  const isAdmin = profile?.role === "admin"
  const isOwner = card.user_id === user.id

  if (payload.status && !isAdmin) {
    throw new Error("Forbidden: Only administrators can update the card status.")
  }

  if (!isOwner && !isAdmin) {
    throw new Error("Forbidden: You do not have permission to edit this card.")
  }

  const { data, error } = await supabase
    .from("cards")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cardId)
    .select<string, CardRawResponse>(CARDS_COLUMNS)
    .single()

  if (error) {
    console.error("[updateCard] Failed to update card:", error)
    throw error
  }

  return mapToCard(data)
}

export async function deleteCard({ cardId }: { cardId: string }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized: User must be authenticated to delete card.")

  const [comment, { data: profile }] = await Promise.all([
    getCard({ cardId }),
    supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(),
  ])
  if (!comment) throw new Error("Comment not found")

  const isOwner = comment.user_id === user.id
  const isAdmin = profile?.role === "admin"

  if (!isOwner && !isAdmin) {
    throw new Error("Unauthorized: You don't have permission to delete this card")
  }

  const { error } = await supabase.from("cards").delete().eq("id", cardId)

  if (error) {
    console.error("[deleteCard] Failed to delete card:", error)
    throw error
  }
}
