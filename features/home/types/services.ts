import { SkillsSumary } from "@/features/shared/types/skills"

export type Service = {
  id: number
  slug: string
  level: string
  name: string
  description: string
  skill_summary: SkillsSumary
  order_index: number
  created_at: string
  updated_at: string
}
