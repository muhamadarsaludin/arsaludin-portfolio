import type { Category } from "@/features/categories/types/categories.types"
import type { Profile } from "@/features/profile/types/profiles.types"
import type { ReactionSummary } from "@/features/reactions/types/reactions.types"
import type { Cursor } from "@/features/shared/types/index.types"

export type ArticleStatus = "draft" | "published" | "archived"

/**
 * ARTICLE ENTITY
 * Raw data from 'projects' table.
 */
export type ArticleEntity = {
  id: string
  slug: string
  thumbnail: string | null
  status: ArticleStatus
  is_show: boolean
  is_featured: boolean
  order_index: number
  user_id: string
  view_count: number
  published_at: string | null
  created_at: string
  updated_at: string
}

/**
 * TRANSLATION ENTITY
 * Raw data from 'article_translations' table.
 */
export type ArticleTranslationEntity = {
  id: string
  title: string
  summary: string | null
  content: string | null
  article_id: string
  i18n_id: string
  user_id: string
  created_at: string
  updated_at: string
}

/**
 * ARTICLE (Public)
 * Flattened object for UI Portfolio.
 */
export type Article = ArticleEntity &
  Pick<ArticleTranslationEntity, "title" | "summary" | "content"> & {
    author: Profile
    categories: Category[]
    comment_count: number
    reaction_summary: ReactionSummary
  }

export type PaginatedArticles = {
  data: Article[]
  nextCursor: Cursor | null
  hasMore: boolean
}
