import clsx from 'clsx'
import React from 'react'
import Image from "next/image"
import MiracleTooltip from '@/components/miracle/Tooltip'
import MiracleBadge from '@/components/miracle/Badge'
import { SkillItem } from '@/features/shared/types/skills'
import { Link } from '@/i18n/navigation'
import { skillIcons } from '@/features/shared/services/skills'
import { LuCircleFadingPlus, LuMessageCircleMore } from 'react-icons/lu'

export type ProjectCardProps = {
  name: string
  slug: string
  thumbnail: string
  url?: string
  github_url?: string
  description: string
  additional_info?: string
  additional_info_label?: string
  content?: string
  skills: SkillItem[]
}

export default function ProjectCard({ project }: { project: ProjectCardProps }) {
  return (
    <div
      // href={`/projects/${project.slug}`}
      // aria-label={project.name}
      className={clsx(
        "flex flex-col w-[80vw] max-w-[300px] sm:w-auto sm:max-w-none shrink-0 snap-start",
        "border border-primary rounded-2xl"
      )}
    >
      {/* Card Image */}
      <div className="w-full aspect-4/3 relative flex justify-center items-center p-5 sm:p-6 rounded-t-2xl overflow-hidden">
        <Image
          className="object-cover"
          src={project.thumbnail}
          alt={project.name}
          fill
          sizes="450px"
        />
      </div>
      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="mb-2 font-semibold text-primary text-lg md:text-xl xl:text-2xl">
          {project.name}
        </h3>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {project.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          {project.skills.slice(0, 7).map((skill, i) => {
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
          {project.skills.length > 7 && (
            <MiracleTooltip
              trigger={
                <MiracleBadge className="cursor-help transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700">
                  +{project.skills.length - 7}
                </MiracleBadge>
              }
              noPadding
            >
              <div className="max-w-[180px] p-2 text-center text-[11px] font-medium leading-snug whitespace-normal flex flex-col gap-1">
                {project.skills.slice(7).map((additonalSkill, i) => {
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
      {/* Footer */}
      {/* Comment & Reaction */}
      <div className="flex px-5 sm:px-6 py-3 border-t border-primary rounded-b-2xl">
        {/* Reaction */}
        <div className="flex gap-4">
          <div className="flex gap-1">
            <MiracleBadge>
              ❤️ 10
            </MiracleBadge>
            <MiracleBadge>
              😍 3
            </MiracleBadge>
            {/* Add Badge to show all icon reaction */}
            <MiracleBadge>
              3+
            </MiracleBadge>
            <LuCircleFadingPlus size={20}/>
            200
          </div>
          <span className="flex gap-1">
            <LuMessageCircleMore size={20}/>
            50
          </span>
        </div>
      </div>
    </div>
  )
}
