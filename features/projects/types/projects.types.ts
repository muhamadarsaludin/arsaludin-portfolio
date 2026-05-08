import { Category } from "@/features/categories/types/categories.types"
import type { ReactionSummary } from "@/features/reactions/types/reactions.types"
import { Cursor } from "@/features/shared/types/index.types"
import type { Skill } from "@/features/skills/types/skills.types"

/**
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
 * Flattened Project object, merging core entity data with localized translations, skills, categories, comment count and reaction summary.
 */
export type Project = Pick<
  ProjectEntity,
  "id" | "slug" | "thumbnail" | "url" | "github_url" | "is_show" | "is_featured" | "order_index" | "created_at"> 
  & Pick<ProjectTranslationEntity, "name" | "description" | "content" | "additional_info" | "additional_info_label" > 
  & {
    skills: Skill[]
    categories: Category[]
    comment_count: number
    reaction_summary: ReactionSummary
  }

export type PaginatedProjects = {
  data: Project[]
  nextCursor: Cursor | null
  hasMore: boolean
}