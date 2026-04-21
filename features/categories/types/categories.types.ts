
/**
 * CATEGORY ENTITY
 * Raw data from 'categories' table.
 */

export type CategoryEntity = {
  id: string
  name: string
  slug: string
  is_show: boolean
  user_id: string
  created_at: string
  updated_at: string
}

/**
 * CATEGORY DATA (Public)
 * Flattened object for UI Portfolio.
 */
export type Category = Pick<CategoryEntity, "id" | "name" | "slug" | "is_show">

/**
 * Valid entity types that can receive category within the portfolio system.
 */
export type CategoryTargetType = "achievement" | "project" | "blog"