"use client"

import { MiracleReveal } from "@/components/miracle/Reveal"
import EmptyStateCard from "@/features/shared/types/components/EmptyStateCard"
import ErrorStateCard from "@/features/shared/types/components/ErrorStateCard"
import TestimonialCard from "@/features/testimonials/components/TestimonialCard"
import TestimonialCardSkeleton from "@/features/testimonials/components/TestimonialCardSkeleton"
import { useFeaturedTestimonials } from "@/features/testimonials/hooks/useFeaturedTestimonials"

export function TestimonialList({locale}: {locale: string}) {
  const {
    data: testimonials,
    isLoading,
    isError,
    refetch
  } = useFeaturedTestimonials({locale})

  if (isLoading) return <TestimonialListSkeleton />
  if (isError) return <ErrorStateCard onRetry={refetch}/>
  if (!testimonials || testimonials.length === 0) return <EmptyStateCard />

  return (
    <div className="max-w-full overflow-x-auto sm:overflow-x-hidden overflow-y-hidden flex gap-4 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
      {testimonials.map((testimonial, index) => (
        <MiracleReveal 
          animation={{
            default: "zoom-in",
            sm: "fade-up"
          }} 
          delay={{
            default: 0,
            sm:(index % 6) * 0.1
          }}
          className="w-[75vw] sm:w-auto shrink-0 snap-start" 
          key={testimonial.id}>
          <TestimonialCard testimonial={testimonial} className="w-full h-full"/>
        </MiracleReveal>
      ))}
    </div>
  )
}

export function TestimonialListSkeleton() {
  return (
    <div className="max-w-full overflow-x-auto sm:overflow-x-hidden overflow-y-hidden flex gap-4 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <TestimonialCardSkeleton key={i} className="w-[75vw] sm:w-auto shrink-0 snap-start"/>
      ))}
    </div>
  )
}

