import type { Skill } from "@/features/skills/types/skills.types"

/**
 * CORE ENTITY
 * Raw data from 'services' table.
 */
export type ServiceEntity = {
  id: string
  slug: string
  level: string | null
  order_index: number
  is_show: boolean
  user_id: string
  created_at: string
  updated_at: string
}

/**
 * TRANSLATION ENTITY
 * Raw data from 'service_translations' table.
 */
export type ServiceTranslationEntity = {
  id: string
  name: string
  description: string
  service_id: string
  locale_id: string
  user_id: string
  created_at: string
  updated_at: string
}

/**
 * SERVICE (Public)
 * Flattened object for UI Portfolio (Merged Core + Translation + Skills).
 */
export type Service = Pick<ServiceEntity, "id" | "slug" | "level" | "order_index"> 
  & Pick<ServiceTranslationEntity, "name" | "description"> 
  & { skills: Skill[] }

/**
 * SERVICE INPUT
 * Combined data for the Dashboard Form.
 */
export type ServiceInput = Pick<
  ServiceEntity,
  "slug" | "level" | "order_index" | "is_show"
> & 
  Pick<ServiceTranslationEntity, "name" | "description" | "locale_id">
