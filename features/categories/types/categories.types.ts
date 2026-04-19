
/**
 * CATEGORY ENTITY
 * Raw data from 'categories' table.
 */

export type CategoryEntity = {
  id: string
  name: string
  user_id: string
  created_at: string
  updated_at: string
}

export type Category = Pick<CategoryEntity, "id" | "name">