import { useQuery } from "@tanstack/react-query"
import { getFeaturedTestimonials } from "../services/testimonials"

export function useFeaturedTestimonials({locale}: { locale: string }) {
  return useQuery({
    queryKey: ["featured-testimonials", locale],
    queryFn: () => getFeaturedTestimonials({locale}),
    staleTime: 1000 * 60 * 60,
  })
}
