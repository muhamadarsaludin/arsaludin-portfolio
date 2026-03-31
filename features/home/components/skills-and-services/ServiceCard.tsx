import clsx from "clsx"
import React from "react"
import MiracleTooltip from "@/components/miracle/Tooltip"
import MiracleBadge from "@/components/miracle/Badge"
import { skillIcons } from "@/features/shared/services/skills"
import type { Skill } from "@/features/shared/types/skills"

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
        "flex w-[80vw] max-w-[300px] shrink-0 snap-start flex-col sm:w-auto sm:max-w-none",
        "border-primary rounded-2xl border"
      )}
    >
      <div className="relative flex aspect-video w-full items-center justify-center p-5 sm:p-6">
        {service.illustration}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#80808035_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_20%,#000_70%,transparent_100%)] bg-[size:16px_16px]"></div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-primary mb-2 text-lg font-semibold md:text-xl xl:text-2xl">
          {service.title}
        </h3>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {service.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          {service.skills.slice(0, 7).map((skill, i) => {
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
          {service.skills.length > 7 && (
            <MiracleTooltip
              trigger={
                <MiracleBadge className="cursor-help transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700">
                  +{service.skills.length - 7}
                </MiracleBadge>
              }
              noPadding
              hoverContent
            >
              <div className="flex max-h-[200px] max-w-[180px] flex-col p-2">
                <div className="flex h-full w-full flex-col gap-1 overflow-auto">
                  {service.skills.map((additonalSkill, i) => {
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
      </div>
    </div>
  )
}
