"use server"

import { createClient } from "@/lib/supabase/server"
import type { Experience, ExperienceTranslation } from "../types/experiences.types"

type GetExperiencesParams = {
  locale: string
  isAdminView?: boolean
}

/**
 * Fetches professional experience data from Supabase with internationalization (i18n) support.
 * * This function performs a complex join between the 'experience' table and its
 * corresponding translation and i18n tables. It ensures that only the relevant
 * translation for the requested locale is retrieved.
 *
 * @param {GetExperiencesParams} params - The configuration object for the fetch request.
 * @returns {Promise<Experience[]>} A promise that resolves to an array of mapped Experience objects.
 * @throws Will throw an error if the Supabase query fails.
 */
export async function getExperiences({
  locale,
  isAdminView = false,
}: GetExperiencesParams): Promise<Experience[]> {
  const supabase = await createClient()

  /**
   * Define columns to be fetched.
   * Includes conditional fetching for administrative fields to minimize payload size.
   */
  const columns = `
    id,
    company,
    company_logo,
    company_link,
    start_date,
    end_date,
    is_show,
    ${isAdminView ? "user_id, created_at, updated_at," : ""}
    experience_translations!inner (
      role,
      employment_type,
      location,
      key_contributions,
      i18n!inner (
        locale
      )
    )
  `

  let query = supabase
    .from("experiences")
    .select(columns)
    .eq("experience_translations.i18n.locale", locale)
    .order("start_date", { ascending: false })

  // Apply visibility filters for public-facing views
  if (!isAdminView) {
    query = query.eq("is_show", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching experience data:", error)
    throw error
  }

  if (!data) return []

  /**
   * Map the raw Supabase response to the Experience type.
   * Handles the extraction of nested translation data and ensures null-safety.
   */
  return data.map((experience: any) => {
    // Extract the primary translation based on the locale filter
    const t = experience.experience_translations?.[0] as ExperienceTranslation | undefined

    return {
      id: experience.id,
      role: t?.role ?? "",
      company: experience.company,
      company_logo: experience.company_logo ?? null,
      company_link: experience.company_link ?? null,
      start_date: experience.start_date,
      end_date: experience.end_date ?? null,
      is_show: experience.is_show,
      employment_type: t?.employment_type ?? "",
      location: t?.location ?? "",
      key_contributions: t?.key_contributions ?? null,
      user_id: experience.user_id ?? null,
      create_at: experience.created_at ?? null,
      updated_at: experience.updated_at ?? null,
    } as Experience
  })
}
