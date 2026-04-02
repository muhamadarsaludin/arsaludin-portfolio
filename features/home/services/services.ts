import { createClient } from "@/lib/supabase/server"
import { routing } from "@/i18n/routing"
import type { Skill } from "@/features/shared/types/skills"
import { Service } from "../types/services"
import { dateFormatter } from "@/utils/date-formater"
import { TOP_SKILLS_AMOUNT } from "@/features/shared/constants/skills"

type ServiceTranslation = {
  name: string | null
  description: string | null
  i18n: {
    locale: string
  }[]
}

type ServiceSkills = {
  skills: Skill
}[]

export async function getServices(
  locale: string = routing.defaultLocale,
  topSkillsAmount: number = TOP_SKILLS_AMOUNT
): Promise<Service[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("services")
    .select(
      `
      id,
      slug,
      level,
      order_index,
      created_at,
      updated_at,
      service_translations!inner (
        name,
        description,
        i18n!inner (
          locale
        )
      ),
      skill_maps (
        skills!inner ( 
          name,
          icon,
          color
        )
      )
    `
    )
    .eq("is_show", true)
    .eq("skill_maps.is_show", true)
    .eq("skill_maps.target_type", "service")
    .eq("service_translations.i18n.locale", locale)
    .order("order_index", { ascending: true })
    .order("order_index", { referencedTable: "skill_maps", ascending: true })

  if (error) {
    console.error("Supabase Error get services:", error)
    return []
  }
  if (!data) return []

  return data.map((service) => {
    const t = service.service_translations?.[0] as ServiceTranslation | undefined
    const skills =
      (service.skill_maps as unknown as ServiceSkills)?.map((s) => s.skills).filter(Boolean) ?? []

    return {
      id: service.id,
      slug: service.slug,
      level: service.level,
      name: t?.name ?? "",
      description: t?.description ?? "",
      skill_summary: {
        hasSkills: skills.length > 0,
        all: skills,
        top: skills.slice(0, topSkillsAmount),
        total: skills.length,
        remaining: skills.length - topSkillsAmount,
      },
      order_index: service.order_index,
      created_at: service.created_at,
      updated_at: service.updated_at
    }
  })
}
