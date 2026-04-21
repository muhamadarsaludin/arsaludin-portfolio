"use client"

import AchievementCard from "@/features/achievements/components/AchievementCard"
import AchievementCardSkeleton from "@/features/achievements/components/AchievementCardSkeleton"
import { useFeaturedAchievements } from "@/features/achievements/hooks/useFeaturedAchievements"
import EmptyStateCard from "@/features/shared/types/components/EmptyStateCard"
import ErrorStateCard from "@/features/shared/types/components/ErrorStateCard"

export function AchievementList() {
  const {
    data: achievements,
    isLoading,
    isError,
    refetch
  } = useFeaturedAchievements()

  if (isLoading) return <ProjectListSkeleton />
  if (isError) return <ErrorStateCard onRetry={refetch} />
  if (!achievements || achievements.length === 0) return <EmptyStateCard />

  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {achievements.map((achievement) => (
        <AchievementCard achievement={achievement} key={achievement.id} />
      ))}
    </div>
  )
}

export function ProjectListSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <AchievementCardSkeleton key={i} />
      ))}
    </div>
  )
}
