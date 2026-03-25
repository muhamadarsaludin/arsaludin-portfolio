import { createClient } from "@/lib/supabase/server"
import { routing } from "@/i18n/routing"

export type Service = {
  id: number
  slug: string
  level: string
  order_index: number
  created_at: string
  updated_at: string
  name: string
  description: string
}

type ServiceTranslation = {
  name: string | null
  description: string | null
  i18n: {
    locale: string
  }[]
}

export async function getServices(locale: string = routing.defaultLocale): Promise<Service[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("services")
    .select(`
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
      )
    `)
    .eq("is_show", true)
    .eq("service_translations.i18n.locale", locale)
    .order("order_index", { ascending: true })

  if (error) {
    console.error("Supabase Error get services:", error)
    return []
  }
  if (!data) return []

  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" })

  return data.map((service) => {
    const t = service.service_translations?.[0] as ServiceTranslation | undefined
    return {
      id: service.id,
      slug: service.slug,
      level: service.level as string,
      order_index: service.order_index,
      created_at: dateFormatter.format(new Date(service.created_at)),
      updated_at: dateFormatter.format(new Date(service.updated_at)),
      name: t?.name ?? "",
      description: t?.description ?? "",
    }
  })
}
