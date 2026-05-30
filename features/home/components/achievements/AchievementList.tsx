"use client"

import { MiracleReveal } from "@/components/miracle/Reveal"
import AchievementCard from "@/features/achievements/components/AchievementCard"
import AchievementCardSkeleton from "@/features/achievements/components/AchievementCardSkeleton"
import { useFeaturedAchievements } from "@/features/achievements/hooks/useFeaturedAchievements"
import EmptyStateCard from "@/features/shared/components/EmptyStateCard"
import ErrorStateCard from "@/features/shared/components/ErrorStateCard"

export function AchievementList({ locale }: { locale: string }) {
  const {
    data: achievements,
    isLoading,
    isError,
    refetch
  } = useFeaturedAchievements({ locale })

  if (isLoading) return <AchievementListSkeleton />
  if (isError) return <ErrorStateCard onRetry={refetch} />
  if (!achievements || achievements.length === 0) return <EmptyStateCard />

  return (
    <div className="max-w-full overflow-x-auto sm:overflow-x-hidden overflow-y-hidden flex gap-4 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
      {achievements.map((achievement, index) => (
        <MiracleReveal 
          animation={{
            default: "zoom-in",
            sm: "fade-up"
          }} 
          delay={{
            default: 0,
            sm:(index % 6) * 0.1
          }}
          threshold={0}
          className="w-[75vw] sm:w-auto shrink-0 snap-start" 
          key={achievement.id}>
          <AchievementCard achievement={achievement} className="w-full h-full" />
        </MiracleReveal>
      ))}
    </div>
  )
}

export function AchievementListSkeleton() {
  return (
    <div className="max-w-full overflow-x-auto sm:overflow-x-hidden overflow-y-hidden flex gap-4 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <AchievementCardSkeleton key={i} className="w-[75vw] sm:w-auto shrink-0 snap-start" />
      ))}
    </div>
  )
}
