"use server"

import { createClient } from "@/lib/supabase/server"
import type { Education, EducationTranslation } from "../types/educations.types"

type GetEducationsParams = {
  locale: string
  isAdminView?: boolean
}

/**
 * Fetches education data from Supabase with internationalization (i18n) support.
 * * This function performs a complex join between the 'education' table and its
 * corresponding translation and i18n tables. It ensures that only the relevant
 * translation for the requested locale is retrieved.
 *
 * @param {GetEducationParams} params - The configuration object for the fetch request.
 * @returns {Promise<Education[]>} A promise that resolves to an array of mapped Education objects.
 * @throws Will throw an error if the Supabase query fails.
 */
export async function getEducations({
  locale,
  isAdminView = false,
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
    ${isAdminView ? "user_id, created_at, updated_at," : ""}
    education_translations!inner (
      degree,
      field,
      location,
      description,
      i18n!inner (
        locale
      )
    )
  `

  let query = supabase
    .from("educations")
    .select(columns)
    .eq("education_translations.i18n.locale", locale)
    .order("start_date", { ascending: false })

  // Apply visibility filters for public-facing views
  if (!isAdminView) {
    query = query.eq("is_show", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching education data:", error)
    throw error
  }

  if (!data) return []

  /**
   * Map the raw Supabase response to the Education type.
   * Handles the extraction of nested translation data and ensures null-safety.
   */
  return data.map((education: any) => {
    // Extract the primary translation based on the locale filter
    const t = education.education_translations?.[0] as EducationTranslation | undefined

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
      user_id: education.user_id ?? null,
      create_at: education.created_at ?? null,
      updated_at: education.updated_at ?? null,
    } as Education
  })
}
