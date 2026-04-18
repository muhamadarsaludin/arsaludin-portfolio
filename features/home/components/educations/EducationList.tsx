"use client"

import { EducationCard } from "@/features/educations/components/EducationCard"
import { EducationCardSkeleton } from "@/features/educations/components/EducationCardSkeleton"
import { useEducations } from "@/features/educations/hooks/useEducations"
import EmptyStateCard from "@/features/shared/types/components/EmptyStateCard"
import ErrorStateCard from "@/features/shared/types/components/ErrorStateCard"

export function EducationList({ locale }: { locale: string }) {
  const {
    data: educations,
    isLoading,
    isError
  } = useEducations({
    locale
  })

  if (isLoading) return <EducationListSkeleton />
  if (isError) return <ErrorStateCard />
  if (!educations || educations.length === 0) return <EmptyStateCard />

  return (
    <div className="flex flex-col gap-4">
      {educations.map((education) => (
        <EducationCard key={education.id} education={education} />
      ))}
    </div>
  )
}

export function EducationListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <EducationCardSkeleton key={i} />
      ))}
    </div>
  )
}
