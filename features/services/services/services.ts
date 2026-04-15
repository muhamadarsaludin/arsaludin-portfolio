"use server"

import { Skill } from "@/features/skills/types/skills.types"
import type { Service, ServiceEntity, ServiceTranslationEntity } from "../types/services.types"
import { createClient } from "@/lib/supabase/server"

type GetServicesParams = {
  locale: string
}

type GetServiceResponse = Pick<
  ServiceEntity, 
  "id" | "slug" | "level" | "order_index" | "is_show"
> & {
  translations: (Pick<
    ServiceTranslationEntity, "name" | "description"
  > & {
    i18n: { locale: string }
  })[]
  service_skills: {
    is_show: boolean
    order_index: number
    skill: Skill
  }[]
}

/**
 * Fetches services from the database with localized content.
 * @param locale - The language code to filter translations (e.g., 'en', 'id'). Defaults to the application's default locale.
 * @returns A promise that resolves to an array of formatted Service objects.
 * @throws Will throw an error if the Supabase query fails.
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
    service_skills (
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
    .select<string, GetServiceResponse>(columns)
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

  return data.map((service): Service => {
    const t = service.translations?.[0]
    const skills = service.service_skills?.map((ss) => ss.skill).filter(Boolean) ?? []

    return {
      id: service.id,
      slug: service.slug,
      level: service.level ?? null,
      order_index: service.order_index,
      name: t?.name ?? "",
      description: t?.description ?? "",
      skills
    }
  })
}
