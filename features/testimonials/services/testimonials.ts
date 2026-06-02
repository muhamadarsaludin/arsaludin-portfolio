"use server"

import { supabase } from "@/lib/supabase/public"
import type {
  Testimonial,
  TestimonialEntity,
  TestimonialTranslationEntity,
} from "../types/testimonials.types"
import type { Reaction, ReactionCount } from "@/features/reactions/types/reactions.types"

type GetFeaturedTestimonialsParams = {
  locale: string
}

type GetFeaturedTestimonialsResponse = Pick<
  TestimonialEntity,
  | "id"
  | "name"
  | "company"
  | "avatar_url"
  | "linkedin"
  | "relationship"
  | "is_show"
  | "is_featured"
  | "order_index"
> & {
  translations: (Pick<TestimonialTranslationEntity, "role" | "content" | "additional_info"> & {
    i18n: { locale: string }
  })[]
  reaction_counts: ReactionCount[]
  reactions: Reaction[]
}

export async function getFeaturedTestimonials({
  locale,
}: GetFeaturedTestimonialsParams): Promise<Testimonial[]> {
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
    )
  `

  const { data, error } = await supabase
    .from("testimonials")
    .select<string, GetFeaturedTestimonialsResponse>(columns)
    .eq("is_show", true)
    .eq("is_featured", true)
    .eq("testimonial_translations.i18n.locale", locale)
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
    const allReactions = testimonial.reaction_counts || []
    const totalEmojis = allReactions.length
    const totalReactions = allReactions.reduce((acc, curr) => acc + (curr.count || 0), 0)

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
        allReactions,
        totalReactions,
        totalEmojis,
      },
    }
  })
}
