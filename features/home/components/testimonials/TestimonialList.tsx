"use client"

import { MiracleReveal } from "@/components/miracle/Reveal"
import { useBatchReactions } from "@/features/reactions/hooks/useBatchReactions"
import EmptyStateCard from "@/features/shared/components/EmptyStateCard"
import ErrorStateCard from "@/features/shared/components/ErrorStateCard"
import TestimonialCard from "@/features/testimonials/components/TestimonialCard"
import TestimonialCardSkeleton from "@/features/testimonials/components/TestimonialCardSkeleton"
import { useFeaturedTestimonials } from "@/features/testimonials/hooks/useFeaturedTestimonials"
import { useMemo } from "react"

export function TestimonialList({ locale }: { locale: string }) {
  const { data: testimonials, isLoading, isError, refetch } = useFeaturedTestimonials({ locale })

  const testimonialIds = useMemo(() => testimonials?.map((p) => p.id) ?? [], [testimonials])

  const { data: dataReactions } = useBatchReactions({
    targetIds: testimonialIds,
    targetType: "testimonial",
  })

  if (isLoading) return <TestimonialListSkeleton />
  if (isError) return <ErrorStateCard onRetry={refetch} />
  if (!testimonials || testimonials.length === 0) return <EmptyStateCard />

  return (
    <div className="flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-x-hidden lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {testimonials.map((testimonial, index) => {
        const dataReaction = dataReactions?.[testimonial.id]
        const reactionSummary = dataReaction?.summary || null
        const userReaction = dataReaction?.userReaction || null
        return (
          <MiracleReveal
            animation={{
              default: "zoom-in",
              sm: "fade-up",
            }}
            delay={{
              default: 0,
              sm: (index % 6) * 0.1,
            }}
            threshold={0}
            className="w-[75vw] shrink-0 snap-start sm:w-auto"
            key={testimonial.id}
          >
            <TestimonialCard
              className="h-full w-full"
              testimonial={testimonial}
              reactionSummary={reactionSummary}
              userReaction={userReaction}
              testimonialIds={testimonialIds}
            />
          </MiracleReveal>
        )
      })}
    </div>
  )
}

export function TestimonialListSkeleton() {
  return (
    <div className="flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-x-hidden lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <TestimonialCardSkeleton key={i} className="w-[75vw] shrink-0 snap-start sm:w-auto" />
      ))}
    </div>
  )
}
