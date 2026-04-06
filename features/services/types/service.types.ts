import type { Skill } from "@/features/skills/types/skills.types"

export type Service = {
  id: string
  slug: string
  name: string
  description: string
  is_show: boolean
  order_index: number
  level: string | null
  user_id: string | null
  created_at: string | null
  updated_at: string | null
  skills: Skill[]
}

export type ServiceTranslation = {
  name: string
  description: string
  i18n: {
    locale: string
  }
}
