"use server"

import { createClient } from "@/lib/supabase/server"
import { MAX_TOP_REACTIONS } from "@/features/reactions/constants/reactions.constants"
import { Testimonial, TestimonialTranslation } from "../types/testimonials.types"

export async function getFeaturedTestimonials({ locale } : { locale: string }): Promise<Testimonial[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const columns = `
    id,
    name,
    company,
    avatar_url,
    linkedin,
    relationship,
    is_show,
    is_featured,
    order_index,
    user_id, 
    created_at, 
    updated_at,
    testimonial_translations!inner (
      role,
      content,
      additional_info,
      i18n!inner (
        locale
      )
    ),
    testimonial_reaction_counts(
      emoji,
      count
    ),
    reactions(
      emoji,
      user_id
    ) 
  `

  let query = supabase
    .from("testimonials")
    .select(columns)
    .eq("testimonial_translations.i18n.locale", locale)
    .eq("is_show", true)
    .eq("is_featured", true)
    .eq("reactions.user_id", user?.id ?? "00000000-0000-0000-0000-000000000000")
    .order("order_index", { ascending: true })
    .order("count", {
      referencedTable: "testimonial_reaction_counts",
      ascending: false,
    })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching featured testimonials:", error)
    throw error
  }

  if (!data) return []

  return data.map((testimonial: any) => {
    const t = testimonial.testimonial_translations?.[0] as TestimonialTranslation | undefined
    const allReactions = testimonial.testimonial_reaction_counts || []
    const userReaction = testimonial.reactions?.[0] ?? null
    const totalReactions = allReactions.reduce(
      (acc: number, curr: any) => acc + (curr.count || 0),
      0
    )
    const topReactions = allReactions.slice(0, MAX_TOP_REACTIONS)
    const totalEmojis = allReactions.length
    const remainingEmojis = Math.max(0, totalEmojis - MAX_TOP_REACTIONS)


    return {
      id: testimonial.id,
      name: testimonial.name,
      company: testimonial.company,
      avatar_url: testimonial.avatar_url ?? null,
      linkedin: testimonial.linkedin ?? null,
      relationship: testimonial.relationship,
      role: t?.role ?? "",
      content: t?.content ?? "",
      additional_info: t?.additional_info ?? null,
      is_show: testimonial.is_show,
      is_featured: testimonial.is_featured,
      order_index: testimonial.order_index,
      user_id: testimonial.user_id,
      created_at: testimonial.created_at,
      updated_at: testimonial.updated_at,
      reaction_summary: {
        userReaction,
        totalReactions,
        allReactions,
        topReactions,
        totalEmojis,
        remainingEmojis,
      }
    } as Testimonial
  })
}
