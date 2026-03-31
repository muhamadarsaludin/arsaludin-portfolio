import clsx from 'clsx'
import React from 'react'
import MiracleTooltip from '@/components/miracle/Tooltip'
import MiracleBadge from '@/components/miracle/Badge'
import { skillIcons } from '@/features/shared/services/skills'
import type { Skill } from '@/features/shared/types/skills'

export interface ServiceType {
  title: string
  description: string
  illustration: React.ReactNode
  skills: Skill[]
  featured?: boolean
}

export default function ServiceCard({ service }: { service: ServiceType }) {
  return (
    <div 
      className={clsx(
        "flex flex-col w-[80vw] max-w-[300px] sm:w-auto sm:max-w-none shrink-0 snap-start",
        "border border-primary rounded-2xl"
      )}
    >
      <div className="w-full aspect-video relative flex justify-center items-center p-5 sm:p-6">
        {service.illustration}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#80808035_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_20%,#000_70%,transparent_100%)]"></div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="mb-2 font-semibold text-primary text-lg md:text-xl xl:text-2xl">
          {service.title}
        </h3>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {service.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          {service.skills.slice(0, 7).map((skill, i) => {
            const IconComponent = skill.icon ? (skillIcons as Record<string, React.ElementType>)[skill.icon] : null
            return (
              <MiracleBadge
                key={i}
                startIcon={IconComponent && <IconComponent className="h-3.5 w-3.5" />}
              >
                {skill.name}
              </MiracleBadge>
            )
          })}
          {service.skills.length > 7 && (
            <MiracleTooltip
              trigger={
                <MiracleBadge className="cursor-help transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700">
                  +{service.skills.length - 7}
                </MiracleBadge>
              }
              noPadding
            >
              <div className="max-w-[180px] p-2 text-center text-[11px] font-medium leading-snug whitespace-normal flex flex-col gap-1">
                {service.skills.slice(7).map((additonalSkill, i) => {
                  const IconComponent = additonalSkill.icon ? (skillIcons as Record<string, React.ElementType>)[additonalSkill.icon] : null
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
            </MiracleTooltip>
          )}
        </div>
      </div>
    </div>
  )
}