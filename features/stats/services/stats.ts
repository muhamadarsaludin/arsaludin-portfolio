"use server"

import { createClient } from "@/lib/supabase/server"
import type { Stats } from "../types/stats.types"

/**
 * Fetches and calculates professional metrics and achievement stats from Supabase.
 */
export async function getStats(): Promise<Stats> {
  const supabase = await createClient()

  const [firstExperience, lastExperience, services, projects, achievements, articles] =
    await Promise.all([
      supabase
        .from("experiences")
        .select("start_date")
        .order("start_date", { ascending: true })
        .limit(1)
        .single(),
      supabase
        .from("experiences")
        .select("end_date")
        .order("end_date", { ascending: false })
        .limit(1)
        .single(),
      supabase.from("services").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("achievements").select("*", { count: "exact", head: true }),
      supabase.from("articles").select("*", { count: "exact", head: true }),
    ])

  const calculateExperience = (startDate: string | null, endDate: string | null) => {
    if (!startDate) return 0
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    let years = end.getFullYear() - start.getFullYear()
    const m = end.getMonth() - start.getMonth()
    if (m < 0 || (m === 0 && end.getDate() < start.getDate())) {
      years--
    }
    return years < 0 ? 0 : years
  }

  return {
    experience: calculateExperience(
      firstExperience.data?.start_date,
      lastExperience.data?.end_date
    ),
    services: services.count || 0,
    projects: projects.count || 0,
    achievements: achievements.count || 0,
    articles: articles.count || 0,
  }
}
