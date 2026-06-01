import type { ReactionSummary } from "@/features/reactions/types/reactions.types"

/**
 * TESTIMONIAL ENTITY
 * Raw data from 'testimonials' table.
 */
export type TestimonialEntity = {
  id: string
  name: string
  company: string
  avatar_url: string | null
  linkedin: string | null
  relationship: string
  is_show: boolean
  is_featured: boolean
  order_index: number
  user_id: string
  created_at: string
  updated_at: string
}

/**
 * TRANSLATION ENTITY
 * Raw data from 'testimonial_translations' table.
 */
export type TestimonialTranslationEntity = {
  id: string
  role: string
  content: string
  additional_info: string | null
  testimonial_id: string
  i18n_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export type Testimonial = Pick<
  TestimonialEntity,
  | "id"
  | "name"
  | "company"
  | "avatar_url"
  | "linkedin"
  | "relationship"
  | "is_show"
  | "is_featured"
  | "order_index"
> &
  Pick<TestimonialTranslationEntity, "role" | "content" | "additional_info"> & {
    reaction_summary: ReactionSummary
  }
