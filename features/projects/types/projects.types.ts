import type { ReactionSummary } from "@/features/reactions/types/reactions.types"
import type { Skill } from "@/features/skills/types/skills.types"

export type Project = {
  id: string
  slug: string
  name: string
  description: string
  thumbnail: string
  is_show: boolean
  is_featured: boolean
  order_index: number

  content: string | null
  github_url: string | null
  url: string | null
  user_id: string | null
  created_at: string | null
  updated_at: string | null
  additional_info: {
    label: string | null
    content: string | null
  } | null
  skills: Skill[]
  comment_count: number
  reaction_summary: ReactionSummary
}

export type ProjectTranslation = {
  name: string
  description: string
  content: string | null
  additional_info: string | null
  additional_info_label: string | null
  i18n: {
    locale: string
  }
}
