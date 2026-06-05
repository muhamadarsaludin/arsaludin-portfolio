"use client"

import { MiracleReveal } from "@/components/miracle/Reveal"
import AchievementCard from "@/features/achievements/components/AchievementCard"
import AchievementCardSkeleton from "@/features/achievements/components/AchievementCardSkeleton"
import { useFeaturedAchievements } from "@/features/achievements/hooks/useFeaturedAchievements"
import { useBatchReactions } from "@/features/reactions/hooks/useBatchReactions"
import EmptyStateCard from "@/features/shared/components/EmptyStateCard"
import ErrorStateCard from "@/features/shared/components/ErrorStateCard"
import { useMemo } from "react"

export function AchievementList({ locale }: { locale: string }) {
  const { data: achievements, isLoading, isError, refetch } = useFeaturedAchievements({ locale })
  const achievementIds = useMemo(() => achievements?.map((a) => a.id) ?? [], [achievements])

  const { data: dataReactions } = useBatchReactions({
    targetIds: achievementIds,
    targetType: "achievement",
  })

  if (isLoading) return <AchievementListSkeleton />
  if (isError) return <ErrorStateCard onRetry={refetch} />
  if (!achievements || achievements.length === 0) return <EmptyStateCard />

  return (
    <div className="flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-x-hidden lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {achievements.map((achievement, index) => {
        const dataReaction = dataReactions?.[achievement.id]
        const reactionSummary = dataReaction?.summary ?? null
        const userReaction = dataReaction?.userReaction ?? null

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
            key={achievement.id}
          >
            <AchievementCard
              className="h-full w-full"
              achievement={achievement}
              reactionSummary={reactionSummary}
              userReaction={userReaction}
            />
          </MiracleReveal>
        )
      })}
    </div>
  )
}

export function AchievementListSkeleton() {
  return (
    <div className="flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-x-hidden lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <AchievementCardSkeleton key={i} className="w-[75vw] shrink-0 snap-start sm:w-auto" />
      ))}
    </div>
  )
}
