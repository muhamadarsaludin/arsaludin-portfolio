import React from "react"
import { Skill } from "../types/skills"
import { skillIcons } from "../services/skills"
import MiracleBadge from "@/components/miracle/Badge"
import MiracleTooltip from "@/components/miracle/Tooltip"

export default function SkillBadges({ skills }: { skills: Skill[] }) {
  return (
    <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
      {skills.slice(0, 7).map((skill, i) => {
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
      {skills.length > 7 && (
        <MiracleTooltip
          trigger={
            <MiracleBadge className="cursor-help transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700">
              +{skills.length - 7}
            </MiracleBadge>
          }
          noPadding
          hoverContent
        >
          <div className="flex max-h-[200px] max-w-[180px] flex-col p-2">
            <div className="flex h-full w-full flex-col gap-1 overflow-auto">
              {skills.map((additonalSkill, i) => {
                const IconComponent = additonalSkill.icon
                  ? (skillIcons as Record<string, React.ElementType>)[additonalSkill.icon]
                  : null
                return (
                  <MiracleBadge
                    key={i}
                    startIcon={IconComponent && <IconComponent className="h-3.5 w-3.5" />}
                  >
                    {additonalSkill.name}
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
