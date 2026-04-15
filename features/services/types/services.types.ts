import type { Skill } from "@/features/skills/types/skills.types"

/**
 * SERVICE ENTITY
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
 * Flattened object for UI Portfolio.
 */
export type Service = Pick<ServiceEntity, "id" | "slug" | "level" | "order_index"> 
  & Pick<ServiceTranslationEntity, "name" | "description"> 
  & { skills: Skill[] }
