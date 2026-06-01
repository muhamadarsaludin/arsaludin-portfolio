import type { ImageAsset } from "@/features/images/types/images.types"

/**
 * EXPERIENCE ENTITY
 * Raw data from 'experiences' table.
 */
export type ExperienceEntity = {
  id: string
  company: string
  company_logo: string | null
  company_link: string | null
  start_date: string
  end_date: string | null
  is_show: boolean
  user_id: string | null
  created_at: string | null
  updated_at: string | null
}

/**
 * TRANSLATION ENTITY
 * Raw data from 'experience_translations' table.
 */
export type ExperienceTranslationEntity = {
  id: string
  role: string
  employment_type: string
  location: string
  key_contributions: string[] | null
  user_id: string
  create_at: string
  updated_at: string
  i18n_id: string
  experience_id: string
}

export type Experience = Pick<ExperienceEntity, "id" | "company" | "company_logo" | "company_link" | "start_date" | "end_date" | "is_show">
  & Pick<ExperienceTranslationEntity, "role" | "employment_type" | "location" | "key_contributions">
  & { images: ImageAsset[] | null }
