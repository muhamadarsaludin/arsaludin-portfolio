import type { ReactionSummary } from "@/features/reactions/types/reactions.types"
import type { Skill } from "@/features/skills/types/skills.types"

/**
 * PROJECT ENTITY
 * Raw data from 'projects' table.
 */
export type ProjectEntity = {
  id: string
  slug: string
  thumbnail: string | null
  url: string | null
  github_url: string | null
  is_show: boolean
  is_featured: boolean
  order_index: number
  user_id: string
  created_at: string
  updated_at: string
}

/**
 * TRANSLATION ENTITY
 * Raw data from 'project_translations' table.
 */
export type ProjectTranslationEntity = {
  id: string
  name: string
  description: string
  content: string | null
  additional_info: string | null
  additional_info_label: string | null
  project_id: string
  i18n_id: string
  user_id: string
  created_at: string
  updated_at: string
}

/**
 * PROJECT (Public)
 * Flattened object for UI Portfolio.
 */
export type Project = Pick<
  ProjectEntity,
  "id" | "slug" | "thumbnail" | "url" | "github_url" | "is_show" | "is_featured" | "order_index"> 
  & Pick<ProjectTranslationEntity, "name" | "description" | "content" | "additional_info" | "additional_info_label" > 
  & {
    skills: Skill[]
    comment_count: number
    reaction_summary: ReactionSummary
  }
