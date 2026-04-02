"use client"

import clsx from "clsx"
import Image from "next/image"
import { Project } from "../types/projects"
import SkillBadges from "@/features/shared/components/SkillBadges"
import { Link } from "@/i18n/navigation"
import ReactionGroup from "@/features/shared/components/reactions/ReactionGroup"
import CommentGroup from "@/features/shared/components/comments/CommentGroup"

export default function ProjectCard({ project }: { project: Project }) {
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
        <p className="text-secondary mb-4 text-sm leading-relaxed">{project.description}</p>
        <SkillBadges skillSummary={project.skill_summary} className="mb-auto" />
      </div>

      {/* Footer */}
      <div
        className="bg-surface-secondary border-primary flex items-center justify-between rounded-b-2xl border-t px-5 py-3 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <ReactionGroup
          targetId={project.id}
          targetType="project"
          reactionSummary={project.reaction_summary}
        />
        <CommentGroup
          targetId={project.id}
          targetType="project"
          commentsCount={project.comments_count}
        />
      </div>
    </div>
  )
}
