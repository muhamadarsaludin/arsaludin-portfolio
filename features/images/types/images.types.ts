/**
 * IMAGE ENTITY
 * Raw data from 'images' table.
 */

export type ImageEntity = {
  id: string
  image_url: string
  alt: string
  user_id: string
  created_at: string
  updated_at: string
  order_index: number
  // Nullabel FK
  experience_id: string | null
}

/**
 * IMAGE DATA (Public)
 * Flattened object for UI Portfolio.
 */
export type ImageAsset = Pick<ImageEntity, "id" | "image_url" | "alt" | "order_index">
