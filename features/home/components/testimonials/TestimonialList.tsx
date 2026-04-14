"use client"

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
  } = useFeaturedTestimonials({locale})

  if (isLoading) return <TestimonialListSkeleton />
  if (isError) return <ErrorStateCard />
  if (!testimonials || testimonials.length === 0) return <EmptyStateCard />

  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {testimonials.map((testimonial) => (
        <TestimonialCard testimonial={testimonial} key={testimonial.id} />
      ))}
    </div>
  )
}

export function TestimonialListSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <TestimonialCardSkeleton key={i} />
      ))}
    </div>
  )
}

