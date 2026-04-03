import React from "react"
import MiracleBadge from "@/components/miracle/Badge"
import MiracleTooltip from "@/components/miracle/Tooltip"
import clsx from "clsx"
import { Skill } from "../types/skills"
import { SkillIconMap } from "../services/skills"

type SkillBadgesProps = {
  skills: Skill[]
  limit?: number
  className?: string
}

export default function SkillBadges({ 
  skills = [], 
  limit = 7,
  className 
}: SkillBadgesProps) {
  const hasMore = skills.length > limit
  const topSkills = skills.slice(0, limit)
  const remainingCount = skills.length - limit
  
  return (
    <div className={clsx("flex flex-wrap items-center gap-2", className)}>
      {/* RENDER TOP SKILLS */}
      {topSkills.map((skill, i) => {
        const IconComponent = skill.icon ? SkillIconMap[skill.icon] : null
        
        const BadgeComponent = (
          <MiracleBadge
            className={clsx(
              skill.link && "cursor-pointer transition-all active:scale-95 group/badge"
            )}
            startIcon={IconComponent && <IconComponent className={clsx(skill.link && "group-hover/badge:scale-110 transition-transform duration-300")}/>}>
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
              className="no-underline"
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
            <MiracleBadge className="cursor-help bg-muted text-muted-foreground">
              +{remainingCount}
            </MiracleBadge>
          }
          noPadding
          hoverContent
        >
          <div className="flex max-h-[250px] w-[180px] flex-col p-3">
            <p className="mb-2 text-[10px] font-bold text-primary-inv uppercase tracking-widest opacity-50">
              Semua Skill
            </p>
            <div className="flex flex-col gap-1 overflow-y-auto pr-1">
              {skills.map((skill, i) => {
                const IconComponent = skill.icon ? SkillIconMap[skill.icon] : null
                
                const ItemContent = (
                  <div className={clsx(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors group",
                    skill.link ? "hover:bg-white/10" : "opacity-80"
                  )}>
                    {IconComponent && (
                      <IconComponent className="h-3 w-3 text-secondary-inv group-hover:scale-110 transition-transform duration-300" />
                    )}
                    <span className="text-secondary-inv">
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