"use server"

import { supabase } from "@/lib/supabase/public"
import type {
  Experience,
  ExperienceEntity,
  ExperienceTranslationEntity,
} from "../types/experiences.types"
import type { ImageAsset } from "@/features/images/types/images.types"

type GetExperiencesParams = {
  locale: string
}

type GetExperiencesResponse = Pick<
  ExperienceEntity,
  "id" | "company" | "company_logo" | "company_link" | "start_date" | "end_date" | "is_show"
> & {
  translations: (Pick<
    ExperienceTranslationEntity,
    "role" | "employment_type" | "location" | "key_contributions"
  > & {
    i18n: { locale: string }
  })[]
  images: ImageAsset[]
}

/**
 * Fetches professional experience history from the database.
 * @param locale - The language code to filter translations (e.g., 'en', 'id').
 * @returns A promise that resolves to an array of formatted Experience objects.
 * @throws Will throw an error if the Supabase query fails.
 */
export async function getExperiences({ locale }: GetExperiencesParams): Promise<Experience[]> {

  const columns = `
    id,
    company,
    company_logo,
    company_link,
    start_date,
    end_date,
    is_show,
    translations:experience_translations!inner (
      role,
      employment_type,
      location,
      key_contributions,
      i18n!inner (
        locale
      )
    ),
    images(
      id,
      image_url,
      alt,
      order_index
    )  
  `

  const query = supabase
    .from("experiences")
    .select<string, GetExperiencesResponse>(columns)
    .eq("is_show", true)
    .eq("experience_translations.i18n.locale", locale)
    .order("start_date", { ascending: false })
    .order("order_index", { referencedTable: "images", ascending: true })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching experience data:", error)
    throw error
  }

  if (!data) return []

  return data.map((experience) => {
    const t = experience.translations?.[0]

    return {
      id: experience.id,
      company: experience.company,
      company_logo: experience.company_logo ?? null,
      company_link: experience.company_link ?? null,
      start_date: experience.start_date,
      end_date: experience.end_date ?? null,
      is_show: experience.is_show,
      role: t?.role ?? "",
      employment_type: t?.employment_type ?? "",
      location: t?.location ?? "",
      key_contributions: t?.key_contributions ?? null,
      images: experience.images ?? null,
    }
  })
}
