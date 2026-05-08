import type { Skill } from "@/features/skills/types/skills.types"

export type ServiceLevel = "expert" | "intermediate" | "beginner"

/**
 * Raw data from 'services' table.
 */
export type ServiceEntity = {
  id: string
  slug: string
  level: ServiceLevel
  order_index: number
  is_show: boolean
  user_id: string
  created_at: string
  updated_at: string
}

/**
 * Raw data from 'service_translations' table.
 */
export type ServiceTranslationEntity = {
  id: string
  name: string
  description: string
  service_id: string
  i18n_id: string
  user_id: string
  created_at: string
  updated_at: string
}

/**
 * Flattened Service object, merging core entity data with localized translations and skills.
 */
export type Service = Pick<ServiceEntity, "id" | "slug" | "level" | "order_index"> 
  & Pick<ServiceTranslationEntity, "name" | "description"> 
  & { skills: Skill[] }
