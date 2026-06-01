"use server"

import { createClient } from "@/lib/supabase/server"
import type { Education, EducationEntity, EducationTranslationEntity } from "../types/educations.types"
import type { ImageAsset } from "@/features/images/types/images.types"

type GetEducationsParams = {
  locale: string
}

type GetEducationsResponse = Pick<EducationEntity, "id" | "school" | "logo" | "grade" | "start_date" | "end_date" | "is_show">
  & {translations: (Pick<
    EducationTranslationEntity, "degree" | "field" | "location" | "description"
    > & { 
      i18n: { locale: string } 
    })[]
    images: ImageAsset[]
  }



/**
 * Fetches education history from the database.
 * @param locale - The language code to filter translations (e.g., 'en', 'id').
 * @returns A promise that resolves to an array of formatted Education objects.
 * @throws Will throw an error if the Supabase query fails.
 */
export async function getEducations({
  locale
}: GetEducationsParams): Promise<Education[]> {
  const supabase = await createClient()

  /**
   * Define columns to be fetched.
   * Includes conditional fetching for administrative fields to minimize payload size.
   */
  const columns = `
    id,
    school,
    logo,
    grade,
    start_date,
    end_date,
    is_show,
    translations:education_translations!inner (
      degree,
      field,
      location,
      description,
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
    .from("educations")
    .select<string, GetEducationsResponse>(columns)
    .eq("is_show", true)
    .eq("education_translations.i18n.locale", locale)
    .order("start_date", { ascending: false })
    .order("order_index", { referencedTable: "images", ascending: true })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching education data:", error)
    throw error
  }

  if (!data) return []

  return data.map((education) => {
    const t = education.translations?.[0]

    return {
      id: education.id,
      school: education.school,
      logo: education.logo ?? null,
      grade: education.grade ?? null,
      start_date: education.start_date,
      end_date: education.end_date ?? null,
      is_show: education.is_show,
      degree: t?.degree ?? "",
      field: t?.field ?? "",
      location: t?.location ?? "",
      description: t?.description ?? null,
      images: education.images ?? null
    }
  })
}
