"use server"

import { nanoid } from 'nanoid';
import { Card, CardPriority, CardType, PaginatedCards } from '../types/cards.types';
import { Profile } from "@/features/profile/types/profiles.types"
import { CardEntity, CardStatus } from "../types/cards.types"
import { Reaction, ReactionCount } from "@/features/reactions/types/reactions.types"
import { CARDS_PAGE_SIZE } from '../constants/card.constants';
import { createClient } from '@/lib/supabase/server';
import { Cursor } from '@/features/shared/types/index.types';
import { generateUniqueSlug } from '@/utils/slug';
import { revalidatePath } from 'next/cache';

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
  ),
  reactions(
    id,
    emoji,
    user_id,
    created_at,
    updated_at,
    author:profiles(
      id,
      full_name,
      email,
      role,
      avatar_url
    )
  )
`

const mapToCard = (card: CardRawResponse): Card => {
  const commentCount = card.comments?.[0]?.count ?? 0
  const userReaction = card.reactions?.[0] ?? null
  const allReactions = card.reaction_counts || []

  return {
    ...card,
    description: card.description ?? null,
    author: card.author,
    comment_count: commentCount,
    reaction_summary: {
      userReaction,
      allReactions,
      totalReactions: allReactions.reduce((acc, curr) => acc + (curr.count || 0), 0),
      totalEmojis: allReactions.length,
    }
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
  console.log("SERVER FILTER:", { status, types, priorities });
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userId = user?.id ?? "00000000-0000-0000-0000-000000000000";

  let query = supabase
    .from("cards")
    .select<string, CardRawResponse>(CARDS_COLUMNS)
    .eq("status", status)
    .eq("reactions.user_id", userId)
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
    console.error(`[getPaginatedCardsByStatus] Error fetching cards:`, error)
    throw error
  }

  if (!data || data.length === 0) {
    return { 
      data: [], 
      nextCursor: null, 
      hasMore: false 
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

export async function getCard({cardId}: { cardId: string }): Promise<Card> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id ?? "00000000-0000-0000-0000-000000000000"

  const { data, error } = await supabase
    .from("cards")
    .select<string, CardRawResponse>(CARDS_COLUMNS)
    .eq("id", cardId)
    .eq("reactions.user_id", userId)
    .single()

  if (error) throw error
  return mapToCard(data)
}

export async function createCard(
  payload: Pick<CardEntity, 'title' | 'description' | 'status' | 'type' | 'priority'>
): Promise<Card> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const slug = generateUniqueSlug(payload.status)

  const { data: lastCard } = await supabase
    .from("cards")
    .select("order_index")
    .eq("status", payload.status)
    .order("order_index", { ascending: false })
    .limit(1)
    .single()

  const nextOrderIndex = (lastCard?.order_index ?? 0) + 1000;

  const { data, error } = await supabase
    .from("cards")
    .insert([{ ...payload, slug: slug, user_id: user.id, order_index: nextOrderIndex }])
    .select<string, CardRawResponse>(CARDS_COLUMNS)
    .single();

  if (error) throw error

  revalidatePath("/roadmap", "layout")
  return mapToCard(data)
}

export async function updateCard({
  cardId,
  payload,
}: {
  cardId: string;
  payload: Partial<Pick<CardEntity, "title" | "description" | "status" | "type" | "priority">>;
}) {
  const supabase = await createClient();

  // 1. Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized: Please log in to continue.");

  // 2. Fetch card ownership and user role in parallel for performance
  const [{ data: card }, { data: profile }] = await Promise.all([
    supabase.from("cards").select("user_id").eq("id", cardId).single(),
    supabase.from("profiles").select("role").eq("id", user.id).single(),
  ]);

  const isAdmin = profile?.role === "admin";
  const isOwner = card?.user_id === user.id;

  // 3. Status Change Protection: Only admins can move cards between columns
  if (payload.status && !isAdmin) {
    throw new Error("Forbidden: Only administrators can update the card status.");
  }

  // 4. Content Protection: Only the author or an admin can edit card details
  if (!isOwner && !isAdmin) {
    throw new Error("Forbidden: You do not have permission to edit this card.");
  }

  // 5. Execute the update
  const { data, error } = await supabase
    .from("cards")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cardId)
    .select<string, CardRawResponse>(CARDS_COLUMNS)
    .single();

  if (error) {
    console.error("[updateCard] Database error:", error);
    throw new Error("Internal Server Error: Failed to update the card.");
  }

  // 6. Refresh the UI data
  revalidatePath("/roadmap", "layout");

  return mapToCard(data);
}

export async function deleteCard({ cardId }: { cardId: string }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const [comment, { data: profile }] = await Promise.all([
    getCard({ cardId }),
    supabase.from("profiles").select("role").eq("id", user.id).single(),
  ])
  if (!comment) throw new Error("Comment not found")

  const isOwner = comment.user_id === user.id
  const isAdmin = profile?.role === "admin"

  if (!isOwner && !isAdmin) {
    throw new Error("Unauthorized: You don't have permission to delete this")
  }

  const { error } = await supabase.from("cards").delete().eq("id", cardId)

  if (error) throw error
  revalidatePath("/roadmap", "layout")
}