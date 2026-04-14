import { ReactionSummary } from "@/features/reactions/types/reactions.types"

export type Testimonial = {
  id: string
  name: string
  company: string
  avatar_url: string | null
  linkedin: string | null
  relationship: string
  is_show: boolean
  is_featured: boolean
  role: string
  content: string
  additional_info: string | null
  user_id: string
  created_at: string
  updated_at: string
  reaction_summary: ReactionSummary
}

export type TestimonialTranslation = {
  role: string
  content: string
  additional_info: string | null
  i18n: {
    locale: string
  }
}