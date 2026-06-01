"use server"

import type { Skill } from "@/features/skills/types/skills.types"
import type { Service, ServiceEntity, ServiceTranslationEntity } from "../types/services.types"
import { createClient } from "@/lib/supabase/server"

type GetServicesParams = {
  locale: string
}

type ServicesResponse = Pick<ServiceEntity, "id" | "slug" | "level" | "order_index" | "is_show"> 
  & { translations: (Pick<ServiceTranslationEntity, "name" | "description"> 
  & {
    i18n: { locale: string }
  })[]
  skills: {
    is_show: boolean
    order_index: number
    skill: Skill
  }[]
}

/**
 * Fetches services from Supabase with localized content.
 * @param locale - The language code to filter translations (e.g., 'en', 'id').
 * @returns A promise that resolves to an array of formatted Service objects.
 * @throws Will throw an error if Supabase query fails.
 */
export async function getServices({
  locale,
}: GetServicesParams): Promise<Service[]> {
  const supabase = await createClient()

  const columns = `
    id,
    slug,
    level,
    order_index,
    is_show,
    translations:service_translations!inner (
      name,
      description,
      i18n!inner (
        locale
      )
    ),
    skills:service_skills (
      is_show,
      order_index,
      skill:skills!inner (
        id,
        name,
        icon,
        link
      )
    )
  `

  const { data, error } = await supabase
    .from("services")
    .select<string, ServicesResponse>(columns)
    .eq("is_show", true)
    .eq("service_skills.is_show", true)
    .eq("service_translations.i18n.locale", locale)
    .order("order_index", { ascending: true })
    .order("order_index", {
      referencedTable: "service_skills",
      ascending: true,
    })

  if (error) {
    console.error("Error fetching services:", error)
    throw error
  }

  if (!data) return []

  return data.map((service: ServicesResponse): Service => {
    const t = service.translations?.[0]
    const skills = service.skills?.map((ss) => ss.skill).filter(Boolean) ?? []

    return {
      ...service,
      name: t?.name ?? "",
      description: t?.description ?? "",
      skills
    }
  })
}
