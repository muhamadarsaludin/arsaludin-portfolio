import { useQuery } from "@tanstack/react-query"
import { getFeaturedTestimonials } from "../services/testimonials"

type UseFeaturedTestimonialsProps = {
  locale: string
}

/**
 * Custom hook to fetch and manage localized featured testimonials for the public portfolio.
 * @param props - The hook properties.
 * @param props.locale - The language code (e.g., 'en', 'id') for content translation.
 * @returns The query result containing an array of Testimonial objects.
 */

export function useFeaturedTestimonials({ locale }: UseFeaturedTestimonialsProps) {
  return useQuery({
    queryKey: ["featured-testimonials", locale],
    queryFn: () => getFeaturedTestimonials({ locale }),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  })
}
