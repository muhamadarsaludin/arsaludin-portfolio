"use client"

import MiracleBadge from "@/components/miracle/Badge"
import MiracleTooltip from "@/components/miracle/Tooltip"
import { cn } from "@/utils/class-name"
import type { Skill } from "../types/skills.types"
import { SKILL_ICON_MAP } from "../services/skills"
import { useTranslations } from "next-intl"
import { MAX_VISIBLE_SKILLS } from "../constants/skills.constants"

type SkillBadgesProps = {
  skills: Skill[]
  limit?: number
  className?: string
}

export default function SkillBadges({ 
  skills = [], 
  limit = MAX_VISIBLE_SKILLS,
  className 
}: SkillBadgesProps) {
  const t = useTranslations("components.skillBadges")

  if (!skills.length) return null

  const hasMore = skills.length > limit
  const topSkills = skills.slice(0, limit)
  const remainingSkills = skills.slice(limit) 
  const remainingCount = remainingSkills.length

  return (
    <div className={cn("flex flex-wrap items-center gap-2 relative", className)}>
      {/* RENDER TOP SKILLS */}
      {topSkills.map((skill) => {
        const IconComponent = skill.icon ? SKILL_ICON_MAP[skill.icon] : null

        const BadgeComponent = (
          <MiracleBadge
            variant="secondary"
            className={cn(
              skill.link && "group/badge cursor-pointer transition-all active:scale-95"
            )}
            startIcon={
              IconComponent && (
                <IconComponent
                  className={cn(
                    skill.link && "transition-transform duration-300 group-hover/badge:scale-110"
                  )}
                />
              )
            }
          >
            {skill.name}
          </MiracleBadge>
        )

        if (skill.link) {
          return (
            <a
              key={skill.id}
              href={skill.link}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline cursor-pointer"
              aria-label={`${t("ariaPrefix")} ${skill.name}`}
            >
              {BadgeComponent}
            </a>
          )
        }

        return <div key={skill.id}>{BadgeComponent}</div>
      })}

      {/* RENDER TOOLTIP FOR REMAINING SKILLS */}
      {hasMore && (
        <MiracleTooltip
          trigger={
            <MiracleBadge variant="secondary" className="cursor-help">
              +{remainingCount}
            </MiracleBadge>
          }
          noPadding
          hoverContent
        >
          <div className="flex max-h-62.5 w-45 flex-col p-3">
            <p className="mb-2 text-[10px] font-bold uppercase">{t("title")}</p>
            <div className="flex flex-col gap-1 overflow-y-auto pr-1">
              {remainingSkills.map((skill) => {
                const IconComponent = skill.icon ? SKILL_ICON_MAP[skill.icon] : null

                const ItemContent = (
                  <div
                    className={cn(
                      "group/badge flex items-center gap-2 p-1.5 rounded-md",
                      "hover:bg-neutral-900 hover:dark:bg-neutral-100 transition-colors duration-300 ease-in-out"
                    )}
                  >
                    {IconComponent && (
                      <IconComponent className="text-secondary-inv h-3 w-3 transition-transform duration-300 group-hover/badge:scale-110" />
                    )}
                    <span
                      className={cn(
                        "text-secondary-inv",
                        skill.link &&
                          "transition-all duration-300 ease-in-out group-hover/badge:underline"
                      )}
                    >
                      {skill.name}
                    </span>
                  </div>
                )

                if (skill.link) {
                  return (
                    <a
                      key={skill.id}
                      aria-label={`${t("ariaPrefix")} ${skill.name}`}
                      href={skill.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline"
                    >
                      {ItemContent}
                    </a>
                  )
                }

                return <div key={skill.id}>{ItemContent}</div>
              })}
            </div>
          </div>
        </MiracleTooltip>
      )}
    </div>
  )
}