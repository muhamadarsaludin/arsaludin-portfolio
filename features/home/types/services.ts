import { SkillSummary } from "@/features/shared/types/skills"

export type Service = {
  id: number
  slug: string
  level: string
  name: string
  description: string
  skill_summary: SkillSummary
  order_index: number
  created_at: string
  updated_at: string
}
