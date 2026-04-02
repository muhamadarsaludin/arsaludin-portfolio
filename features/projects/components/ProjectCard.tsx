"use client"

import clsx from "clsx"
import Image from "next/image"
import { Project } from "../types/projects"
import SkillBadges from "@/features/shared/components/SkillBadges"
import { Link, useRouter } from "@/i18n/navigation"
import { toggleReaction } from "@/features/shared/services/reactions"
import ReactionGroup from "@/features/shared/components/reactions/ReactionGroup"

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter()

  const handleSelectReaction = async (emoji: string) => {
    try {
      await toggleReaction({
        targetId: project.id,
        targetType: 'project',
        emoji
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to toggle reaction:", error)
    }
  }
  
  return (
    <div
      className={clsx(
        "group relative flex w-[80vw] max-w-[300px] shrink-0 snap-start flex-col sm:w-auto sm:max-w-none",
        "border-primary rounded-2xl border"
      )}
    >
      {/* Stretched Link for entire card */}
      <Link
        href={`/projects/${project.slug}`}
        className="focus-visible:ring-primary absolute inset-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        aria-label={`Lihat detail proyek ${project.name}`}
      />

      {/* Image */}
      <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-t-2xl px-5 py-3 sm:px-6">
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
        <h3 className="text-primary mb-2 text-lg font-semibold md:text-xl xl:text-2xl">
          {project.name}
        </h3>
        <p className="text-sm leading-relaxed text-secondary mb-4">
          {project.description}
        </p>
        <SkillBadges skillSummary={project.skill_summary} className="mb-auto"/>
      </div>

      {/* Footer */}
      <div 
        className="flex items-center justify-between px-5 sm:px-6 py-3 rounded-b-2xl bg-surface-secondary border-t border-primary"
        onClick={(e) => e.stopPropagation()}>
          {/* Left */}
          <ReactionGroup reactionSummary={project.reaction_summary} onSelectReaction={handleSelectReaction}/>
  
          {/* Right */}
          <div className="flex items-center gap-1"></div>
      </div>
    </div>
  )
}
