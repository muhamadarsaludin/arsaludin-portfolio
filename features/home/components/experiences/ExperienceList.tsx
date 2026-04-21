"use client"

import { ExperienceCard } from "@/features/experiences/components/ExperienceCard"
import { ExperienceCardSkeleton } from "@/features/experiences/components/ExperienceCardSkeleton"
import { useExperiences } from "@/features/experiences/hooks/useExperiences"
import EmptyStateCard from "@/features/shared/types/components/EmptyStateCard"
import ErrorStateCard from "@/features/shared/types/components/ErrorStateCard"

export function ExperienceList({ locale }: { locale: string }) {
  const {
    data: experiences,
    isLoading,
    isError,
    refetch
  } = useExperiences({
    locale
  })

  if (isLoading) return <ExperienceListSkeleton />
  if (isError) return <ErrorStateCard onRetry={refetch} />
  if (!experiences || experiences.length === 0) return <EmptyStateCard />

  return (
    <div className="flex flex-col gap-4">
      {experiences.map((experience, i) => (
        <ExperienceCard key={experience.id} experience={experience} showDetail={i === 0} />
      ))}
    </div>
  )
}

export function ExperienceListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <ExperienceCardSkeleton key={i} />
      ))}
    </div>
  )
}
