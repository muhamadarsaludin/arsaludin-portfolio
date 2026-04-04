import { routing } from "@/i18n/routing";
import { Service, ServiceTranslation } from "../types/service";
import { createClient } from "@/lib/supabase/server";

type getServicesParams = {
  locale: string;
  isAdminView?: boolean;
};

/**
 * Fetches services from the database with localized content.
 * @param locale - The language code to filter translations (e.g., 'en', 'id'). Defaults to the application's default locale.
 * @param isAdminView - If `true`, bypasses visibility filters and includes additional metadata such as user_id and timestamps.
 * @returns A promise that resolves to an array of formatted Service objects.
 * @throws Will throw an error if the Supabase query fails.
 */
export async function getServices({
  locale,
  isAdminView = false,
}: getServicesParams): Promise<Service[]> {
  const supabase = await createClient();

  const columns = `
    id,
    slug,
    level,
    order_index,
    is_show,
    ${isAdminView ? "user_id, created_at, updated_at," : ""}
    service_translations!inner (
      name,
      description,
      i18n!inner (
        locale
      )
    ),
    service_skills (
      is_show,
      order_index,
      skills (
        id,
        name,
        icon,
        link
      )
    )`;

  let query = supabase
    .from("services")
    .select(columns)
    .eq("service_translations.i18n.locale", locale)
    .order("order_index", { ascending: true })
    .order("order_index", { referencedTable: "service_skills", ascending: true });

  // Apply visibility filter for public-facing pages (Landing Page)
  if (!isAdminView) {
    query = query
      .eq("is_show", true)
      .eq("service_skills.is_show", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching services:", error)
    throw error
  }
  if (!data) return []

  /**
   * Map and flatten the database response to match the Service type.
   * This simplifies the data structure for easier consumption in UI components.
   */
  return data.map((service: any) => {
    const t = service.service_translations?.[0] as ServiceTranslation | undefined;
    
    const skills = service.service_skills
      ?.map((ss: any) => ss.skills)
      .filter(Boolean) || [];

    return {
      id: service.id,
      slug: service.slug,
      is_show: service.is_show,
      order_index: service.order_index,
      name: t?.name ?? "",
      description: t?.description ?? "",
      level: service.level ?? null,
      user_id: service.user_id ?? null,
      created_at: service.created_at ?? null,
      updated_at: service.updated_at ?? null,
      skills: skills,
    } as Service;
  });
}