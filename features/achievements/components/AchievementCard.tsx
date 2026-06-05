"use client"

import { useState } from "react"
import Image from "next/image"
import type { Achievement, AchievementType } from "../types/achievements.types"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import AchievementModal from "./AchievementModal"
import { useTranslations } from "use-intl"
import { LuAward } from "react-icons/lu"
import type { BadgeColor } from "@/components/miracle/Badge"
import MiracleBadge from "@/components/miracle/Badge"
import { cn } from "@/utils/class-name"
import type { Reaction, ReactionSummary } from "@/features/reactions/types/reactions.types"

type AchievementCardProps = {
  className?: string
  achievement: Achievement
  reactionSummary: ReactionSummary | null
  userReaction: Reaction | null
  achievementIds: string[]
}

export default function AchievementCard({
  className,
  achievement,
  reactionSummary,
  userReaction,
  achievementIds,
}: AchievementCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const typeBadgeColor: Record<AchievementType, BadgeColor> = {
    award: "yellow",
    course: "blue",
  }

  const t = useTranslations("components.achievementCard")
  const td = useTranslations("data.achievement")

  return (
    <div className={cn("relative flex flex-col", className)}>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group/cert border-primary relative aspect-7/5 w-full cursor-pointer overflow-hidden rounded-2xl border"
      >
        <Image
          className="object-cover transition-transform duration-300 ease-in-out group-hover/cert:scale-103"
          src={achievement.image}
          alt={achievement.name}
          fill
          sizes="450px"
        />
      </button>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 pt-5">
        <div className="flex min-w-0 items-start gap-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
            {achievement.organization_logo ? (
              <Image
                src={achievement.organization_logo}
                alt={achievement.issuing_organization}
                fill
                sizes="40px"
                className="object-contain"
              />
            ) : (
              <div className="text-primary-inv bg-blue flex h-full w-full items-center justify-center">
                <LuAward size={20} />
              </div>
            )}
          </div>
          <div className="flex flex-col items-start">
            <h3
              onClick={() => setIsModalOpen(true)}
              aria-label={t("viewDetail")}
              className="text-primary text-md line-clamp-1 cursor-pointer font-semibold tracking-tight"
            >
              {achievement.name}
            </h3>
            <div className="text-secondary flex items-center gap-1 text-sm tracking-tight">
              <span>{achievement.issuing_organization}</span>|
              <MiracleBadge color={typeBadgeColor[achievement.type]} size="sm" variant="secondary">
                {td("types." + achievement.type)}
              </MiracleBadge>
            </div>
          </div>
        </div>
        <div className="relative shrink-0">
          <ReactionGroup
            targetId={achievement.id}
            targetIds={achievementIds}
            targetType="achievement"
            reactionSummary={reactionSummary}
            userReaction={userReaction}
          />
        </div>
      </div>

      <AchievementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        achievement={achievement}
      />
    </div>
  )
}
