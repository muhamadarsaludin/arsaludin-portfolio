"use client"

import { useState } from "react"
import Image from "next/image"
import type { Achievement, AchievementType } from "../types/achievements.types"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import AchievementModal from "./AchievementModal"
import { useTranslations } from "use-intl"
import { LuAward } from "react-icons/lu"
import MiracleBadge, { BadgeColor } from "@/components/miracle/Badge"
import clsx from "clsx"

export default function AchievementCard({ achievement, className }: { achievement: Achievement, className?: string}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const typeBadgeColor: Record<AchievementType, BadgeColor> = {
    award: "yellow",
    course: "blue"
  }

  const t = useTranslations("components.achievementCard")
  const td = useTranslations("data.achievement")

  return (
    <div className={clsx(
      "relative flex flex-col",
      className
    )}>
      <button
        onClick={() => setIsModalOpen(true)}
        className="relative group/cert aspect-7/5 w-full overflow-hidden rounded-2xl border border-primary cursor-pointer"
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
        <div className="flex gap-2 items-start min-w-0">
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
              <div className="flex h-full w-full items-center justify-center text-primary-inv bg-blue">
                <LuAward size={20}/>
              </div>
            )}
          </div>
          <div className="flex flex-col items-start">
            <h3
              onClick={() => setIsModalOpen(true)}
              aria-label={t("viewDetail")}
              className="text-primary text-md font-semibold tracking-tight line-clamp-1 cursor-pointer"
            >
              {achievement.name}
            </h3>
            <div className="text-secondary text-sm tracking-tight flex items-center gap-1">
              <span>{achievement.issuing_organization}</span>
              |
              <MiracleBadge color={typeBadgeColor[achievement.type]} size="sm" variant="secondary">
                {td("types." + achievement.type)}
              </MiracleBadge>
            </div>
          </div>
        </div>
        <div className="shrink-0 relative">
          <ReactionGroup
            targetId={achievement.id}
            targetType="achievement"
            initialSummary={achievement.reaction_summary}
          />
        </div>
      </div>

      {isModalOpen && (
        <AchievementModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          achievement={achievement}
        />
      )}
    </div>
  )
}