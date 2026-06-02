"use server"

import { supabase as supabasePublicClient } from "@/lib/supabase/public"
import type { Reaction, ReactionCount } from "@/features/reactions/types/reactions.types"
import type { Category, CategoryEntity } from "@/features/categories/types/categories.types"
import type { Cursor } from "@/features/shared/types/index.types"
import type {
  Article,
  ArticleEntity,
  ArticleTranslationEntity,
  PaginatedArticles,
} from "../types/articles.types"
import type { Profile } from "@/features/profile/types/profiles.types"
import { ARTICLES_PAGE_SIZE } from "../constants/articles.constans"

type ArticleRawResponse = ArticleEntity & {
  translations: (Pick<ArticleTranslationEntity, "title" | "summary" | "content"> & {
    i18n: { locale: string }
  })[]
  author: Profile
  categories: {
    is_show: boolean
    category: Pick<CategoryEntity, "id" | "slug" | "is_show"> & {
      category_translations: {
        name: string
        i18n: {
          locale: string
        }
      }[]
    }
  }[]
  comments: { count: number }[]
  reaction_counts: ReactionCount[]
  reactions: Reaction[]
}

const getColumns = (isFilteringCategory: boolean = false) => `
  id,
  slug,
  thumbnail,
  status,
  is_show,
  is_featured,
  order_index,
  user_id,
  view_count,
  published_at,
  created_at,
  updated_at,
  translations:article_translations!inner (
    title,
    summary,
    content,
    i18n!inner (
      locale
    )
  ),
  author:user_id (
    id, 
    email, 
    full_name, 
    role, 
    avatar_url
  ),
  categories:article_categories${isFilteringCategory ? "!inner" : ""}(
    is_show,
    category:categories!inner(
      id,
      slug,
      is_show,
      category_translations!inner(
        name,
        i18n!inner(
          locale
        )
      )
    )
  ),
  comments(count),
  reaction_counts:article_reaction_counts(
    emoji,
    count
  )
  `

const mapToArticle = (article: ArticleRawResponse): Article => {
  const t = article.translations?.[0]
  const categories: Category[] =
    article.categories
      ?.map((ac) => {
        const cat = ac.category
        if (!cat) return null
        const translation = cat.category_translations?.[0]

        return {
          id: cat.id,
          slug: cat.slug,
          is_show: cat.is_show,
          name: translation?.name ?? "",
        }
      })
      .filter((cat): cat is Category => cat !== null) ?? []
  const commentCount = article.comments?.[0]?.count ?? 0
  const allReactions = article.reaction_counts || []

  return {
    ...article,
    thumbnail: article.thumbnail ?? null,
    published_at: article.published_at ?? null,
    title: t?.title,
    summary: t?.summary ?? null,
    content: t?.content ?? null,
    author: article.author,
    categories,
    comment_count: commentCount,
    reaction_summary: {
      allReactions,
      totalReactions: allReactions.reduce((acc, curr) => acc + (curr.count || 0), 0),
      totalEmojis: allReactions.length,
    },
  }
}

// --- MAIN FUNCTION ---
export async function getFeaturedArticles({ locale }: { locale: string }): Promise<Article[]> {
  const supabase = supabasePublicClient
  
  const { data, error } = await supabase
    .from("articles")
    .select<string, ArticleRawResponse>(getColumns())
    .eq("is_show", true)
    .eq("is_featured", true)
    .eq("status", "published")
    .not("published_at", "is", null)
    .eq("translations.i18n.locale", locale)
    .eq("categories.is_show", true)
    .eq("categories.category.is_show", true)
    .eq("categories.category.category_translations.i18n.locale", locale)
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("published_at", { ascending: false })
    .order("id", { ascending: false })
    .order("count", {
      referencedTable: "article_reaction_counts",
      ascending: false,
    })
    .limit(4)

  if (error) {
    console.error("Error fetching featured articles:", error)
    throw error
  }

  return (data || []).map(mapToArticle)
}

type GetPaginatedArticlesParams = {
  locale: string
  search?: string
  categorySlugs?: string[]
  pageSize?: number
  cursor?: Cursor
}

export async function getPaginatedArticles({
  locale,
  search,
  categorySlugs,
  pageSize = ARTICLES_PAGE_SIZE,
  cursor,
}: GetPaginatedArticlesParams): Promise<PaginatedArticles> {
  const supabase = supabasePublicClient
  const isFilteringCategory = !!(categorySlugs && categorySlugs.length > 0)

  let query = supabase
    .from("articles")
    .select<string, ArticleRawResponse>(getColumns(isFilteringCategory))
    .eq("is_show", true)
    .eq("status", "published")
    .not("published_at", "is", null)
    .eq("translations.i18n.locale", locale)
    .eq("categories.is_show", true)
    .eq("categories.category.is_show", true)
    .eq("categories.category.category_translations.i18n.locale", locale)
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("published_at", { ascending: false })
    .order("id", { ascending: false })
    .order("count", {
      referencedTable: "article_reaction_counts",
      ascending: false,
    })
    .limit(pageSize + 1)

  if (search) {
    query = query.ilike("article_translations.title", `%${search}%`)
  }

  if (isFilteringCategory) {
    query = query.in("article_categories.categories.slug", categorySlugs)
  }

  if (cursor && cursor.order_index !== undefined) {
    query = query.or(
      `order_index.gt.${cursor.order_index},` +
        `and(order_index.eq.${cursor.order_index},published_at.lt.${cursor.published_at}),` +
        `and(order_index.eq.${cursor.order_index},published_at.eq.${cursor.published_at},id.lt.${cursor.id})`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("[getPaginatedArticles] Error fetching articles:", error)
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
  const mappedData = trimmedData.map(mapToArticle)
  const lastItem = mappedData[mappedData.length - 1]

  return {
    data: mappedData,
    nextCursor: hasMore
      ? {
          id: lastItem.id,
          published_at: lastItem.published_at ?? undefined,
          order_index: lastItem.order_index ?? 0,
        }
      : null,
    hasMore,
  }
}

type GetArticleParams = {
  slug?: string
  id?: string
  locale: string
}
export async function getArticle({ 
  slug, 
  id, 
  locale 
}: GetArticleParams): Promise<Article | null> {
  const supabase = supabasePublicClient

  let query = supabase
    .from("articles")
    .select<string, ArticleRawResponse>(getColumns())
    .eq("translations.i18n.locale", locale)
    .eq("categories.is_show", true)
    .eq("categories.category.is_show", true)
    .eq("categories.category.category_translations.i18n.locale", locale)

  if (id) {
    query = query.eq("id", id)
  } else if (slug) {
    query = query.eq("slug", slug)
  } else {
    return null
  }

  const { data, error } = await query.single()

  if (error) {
    console.error("[getArticle] Error fetching article:", error)
    throw error
  }

  return data ? mapToArticle(data) : null
}

export async function getAllArticlesSlugs() {
  const supabase = supabasePublicClient

  const { data, error } = await supabase
    .from("articles")
    .select("slug, updated_at")
    .eq("is_show", true)
    .eq("status", "published")
    .not("published_at", "is", null)

  if (error) {
    console.error("[getAllArticlesSlugs] Error:", error)
    throw error
  }

  return data ?? []
}
