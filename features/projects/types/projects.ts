import { ReactionSummary } from "@/features/shared/types/reactions"
import { SkillsSumary } from "@/features/shared/types/skills"

export type Project = {
  id: string
  name: string
  description: string
  slug: string
  thumbnail: string
  github_url: string | null
  url: string | null
  content: string
  additional_info: {
    label: string
    content: string
  }
  comments_count: number
  reaction_sumary: ReactionSummary
  skill_sumary: SkillsSumary
  order_index: number
  created_at: string
  updated_at: string
}
