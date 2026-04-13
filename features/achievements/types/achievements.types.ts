import type { ReactionSummary } from "@/features/reactions/types/reactions.types"

export type Achievement = {
  id: string
  name: string
  type: string
  image: string
  issuing_organization: string
  organization_logo: string | null
  credential_url: string
  credential_id: string | null
  issue_date: string
  expiration_date: string | null
  is_show: boolean
  is_featured: boolean
  order_index: number
  user_id: string
  created_at: string
  updated_at: string
  reaction_summary: ReactionSummary
  categories: string[]
}
