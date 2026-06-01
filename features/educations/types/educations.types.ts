import type { ImageAsset } from "@/features/images/types/images.types"

/**
 * EDUCATION ENTITY
 * Raw data from 'educations' table.
 */
export type EducationEntity = {
  id: string
  school: string
  logo: string | null
  start_date: string
  end_date: string | null
  grade: string | null
  is_show: boolean
  user_id: string | null
  created_at: string | null
  updated_at: string | null
}

/**
 * TRANSLATION ENTITY
 * Raw data from 'education_translations' table.
 */
export type EducationTranslationEntity = {
  id: string
  degree: string
  field: string
  location: string
  description: string[] | null
  user_id: string
  create_at: string
  updated_at: string
  i18n_id: string
  education_id: string
}

export type Education = Pick<EducationEntity, "id" | "school" | "logo" | "start_date" | "end_date" | "is_show" | "grade">
  & Pick<EducationTranslationEntity, "degree" | "field" | "location" | "description">
  & { images: ImageAsset[] | null }