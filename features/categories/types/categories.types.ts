/**
 * CATEGORY ENTITY
 * Raw data from 'categories' table.
 */

export type CategoryEntity = {
  id: string
  slug: string
  is_show: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export type CategoryTranslationEntity = {
  id: string
  name: string
  category_id: string
  i18n_id: string
  user_id: string
  created_at: string
  updated_at: string
}

/**
 * CATEGORY DATA (Public)
 * Flattened object for UI Portfolio.
 */
export type Category = Pick<CategoryEntity, "id" | "slug" | "is_show"> &
  Pick<CategoryTranslationEntity, "name">

/**
 * Valid entity types that can receive category within the portfolio system.
 */
export type CategoryTargetType = "achievement" | "project" | "article"
