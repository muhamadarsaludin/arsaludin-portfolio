import React from "react"
import { SkillSummary } from "../types/skills"
import { skillIcons } from "../services/skills"
import MiracleBadge from "@/components/miracle/Badge"
import MiracleTooltip from "@/components/miracle/Tooltip"
import clsx from "clsx"

type SkillBadgesProps = {
  skillSummary: SkillSummary
  className?: string
}

export default function SkillBadges({ skillSummary, className }: SkillBadgesProps) {
  return (
    <div className={clsx("flex flex-wrap items-center gap-2", className)}>
      {skillSummary.top.map((skill, i) => {
        const IconComponent = skill.icon
          ? (skillIcons as Record<string, React.ElementType>)[skill.icon]
          : null
        return (
          <MiracleBadge
            key={i}
            startIcon={IconComponent && <IconComponent className="h-3.5 w-3.5" />}
          >
            {skill.name}
          </MiracleBadge>
        )
      })}
      {skillSummary.remaining > 0 && (
        <MiracleTooltip
          trigger={
            <MiracleBadge>
              +{skillSummary.remaining}
            </MiracleBadge>
          }
          noPadding
          hoverContent
        >
          <div className="flex max-h-[200px] max-w-[180px] flex-col p-2">
            <div className="flex h-full w-full flex-col gap-1 overflow-auto">
              {skillSummary.all.map((skill, i) => {
                const IconComponent = skill.icon
                  ? (skillIcons as Record<string, React.ElementType>)[skill.icon]
                  : null
                return (
                  <MiracleBadge
                    key={i}
                    startIcon={IconComponent && <IconComponent className="h-3.5 w-3.5" />}
                  >
                    {skill.name}
                  </MiracleBadge>
                )
              })}
            </div>
          </div>
        </MiracleTooltip>
      )}
    </div>
  )
}
