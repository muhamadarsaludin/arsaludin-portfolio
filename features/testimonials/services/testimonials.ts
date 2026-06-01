"use server"

import { createClient } from "@/lib/supabase/server"
import { MAX_TOP_REACTIONS } from "@/features/reactions/constants/reactions.constants"
import type { Testimonial, TestimonialEntity, TestimonialTranslationEntity } from "../types/testimonials.types"
import type { Reaction, ReactionCount } from "@/features/reactions/types/reactions.types"

type GetFeaturedTestimonialsParams = {
  locale: string
}

type GetFeaturedTestimonialsResponse = Pick<TestimonialEntity, "id" | "name" | "company" | "avatar_url" | "linkedin" | "relationship" | "is_show" | "is_featured" | "order_index">
  & {
    translations: (Pick<TestimonialTranslationEntity, "role" | "content" | "additional_info"> 
    & {
      i18n: { locale: string }
    })[]
    reaction_counts: ReactionCount[]
    reactions: Reaction[]
  }
  
export async function getFeaturedTestimonials({ 
  locale 
} : GetFeaturedTestimonialsParams): Promise<Testimonial[]> {
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
    translations:testimonial_translations!inner (
      role,
      content,
      additional_info,
      i18n!inner (
        locale
      )
    ),
    reaction_counts:testimonial_reaction_counts(
      emoji,
      count
    ),
    reactions(
      id,
      emoji,
      user_id,
      created_at,
      updated_at,
      author:profiles(
        id,
        full_name,
        email,
        role,
        avatar_url
      )
    )
  `

  const { data, error } = await supabase
    .from("testimonials")
    .select<string, GetFeaturedTestimonialsResponse>(columns)
    .eq("is_show", true)
    .eq("is_featured", true)
    .eq("testimonial_translations.i18n.locale", locale)
    .eq("reactions.user_id", user?.id ?? "00000000-0000-0000-0000-000000000000")
    .order("order_index", { ascending: true })
    .order("count", {
      referencedTable: "testimonial_reaction_counts",
      ascending: false,
    })

  if (error) {
    console.error("Error fetching featured testimonials:", error)
    throw error
  }

  if (!data) return []

  return data.map((testimonial) => {
    const t = testimonial.translations?.[0]
    const userReaction = testimonial.reactions?.[0] ?? null
    const allReactions = testimonial.reaction_counts || []
    const totalEmojis = allReactions.length
    const totalReactions = allReactions.reduce(
      (acc, curr) => acc + (curr.count || 0), 
      0
    )

    return {
      id: testimonial.id,
      name: testimonial.name,
      company: testimonial.company,
      avatar_url: testimonial.avatar_url ?? null,
      linkedin: testimonial.linkedin ?? null,
      relationship: testimonial.relationship,
      is_show: testimonial.is_show,
      is_featured: testimonial.is_featured,
      order_index: testimonial.order_index,
      role: t?.role ?? "",
      content: t?.content ?? "",
      additional_info: t?.additional_info ?? null,
      reaction_summary: {
        userReaction,
        allReactions,
        totalReactions,
        totalEmojis
      }
    }
  })
}
