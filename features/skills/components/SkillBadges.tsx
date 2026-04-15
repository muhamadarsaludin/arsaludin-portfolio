import React from "react"
import MiracleBadge from "@/components/miracle/Badge"
import MiracleTooltip from "@/components/miracle/Tooltip"
import clsx from "clsx"
import type { Skill } from "../types/skills.types"
import { SkillIconMap } from "../services/skills"
import { useTranslations } from "next-intl"

type SkillBadgesProps = {
  skills: Skill[]
  limit?: number
  className?: string
}

export default function SkillBadges({ skills = [], limit = 7, className }: SkillBadgesProps) {
  const hasMore = skills.length > limit
  const topSkills = skills.slice(0, limit)
  const remainingCount = skills.length - limit
  const t = useTranslations("components.skillBadges")

  return (
    <div className={clsx("flex flex-wrap items-center gap-2 relative", className)}>
      {/* RENDER TOP SKILLS */}
      {topSkills.map((skill, i) => {
        const IconComponent = skill.icon ? SkillIconMap[skill.icon] : null

        const BadgeComponent = (
          <MiracleBadge
            variant="secondary"
            className={clsx(
              skill.link && "group/badge cursor-pointer transition-all active:scale-95"
            )}
            startIcon={
              IconComponent && (
                <IconComponent
                  className={clsx(
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
              key={i}
              href={skill.link}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              {BadgeComponent}
            </a>
          )
        }

        return <div key={i}>{BadgeComponent}</div>
      })}

      {/* RENDER TOOLTIP FOR REMAINING SKILLS */}
      {hasMore && (
        <MiracleTooltip
          trigger={
            <MiracleBadge variant="secondary" className="bg-muted text-muted-foreground cursor-help">
              +{remainingCount}
            </MiracleBadge>
          }
          noPadding
          hoverContent
        >
          <div className="flex max-h-[250px] w-[180px] flex-col p-3">
            <p className="mb-2 text-[10px] font-bold uppercase">{t("title")}</p>
            <div className="flex flex-col gap-1 overflow-y-auto pr-1">
              {skills.map((skill, i) => {
                const IconComponent = skill.icon ? SkillIconMap[skill.icon] : null

                const ItemContent = (
                  <div
                    className={clsx(
                      "group/badge flex items-center gap-2 p-1.5 rounded-md",
                      "hover:bg-neutral-900 hover:dark:bg-neutral-100 transition-colors duration-300 ease-in-out"
                    )}
                  >
                    {IconComponent && (
                      <IconComponent className="text-secondary-inv h-3 w-3 transition-transform duration-300 group-hover/badge:scale-110" />
                    )}
                    <span
                      className={clsx(
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
                      key={i}
                      href={skill.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline"
                    >
                      {ItemContent}
                    </a>
                  )
                }

                return <div key={i}>{ItemContent}</div>
              })}
            </div>
          </div>
        </MiracleTooltip>
      )}
    </div>
  )
}
