"use client"

import { MiracleReveal } from "@/components/miracle/Reveal"
import { EducationCard } from "@/features/educations/components/EducationCard"
import { EducationCardSkeleton } from "@/features/educations/components/EducationCardSkeleton"
import { useEducations } from "@/features/educations/hooks/useEducations"
import EmptyStateCard from "@/features/shared/components/EmptyStateCard"
import ErrorStateCard from "@/features/shared/components/ErrorStateCard"

export function EducationList({ locale }: { locale: string }) {
  const {
    data: educations,
    isLoading,
    isError,
    refetch
  } = useEducations({ locale })

  if (isLoading) return <EducationListSkeleton />
  if (isError) return <ErrorStateCard onRetry={refetch} />
  if (!educations || educations.length === 0) return <EmptyStateCard />

  return (
    <div className="flex flex-col gap-4">
      {educations.map((education, index) => (
        <MiracleReveal 
          key={education.id} 
          animation="fade-up" 
          delay={(index % 6) * 0.1}
        >
          <EducationCard education={education} />
        </MiracleReveal>
      ))}
    </div>
  )
}

export function EducationListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <EducationCardSkeleton key={`edu-skel-${i}`} />
      ))}
    </div>
  )
}