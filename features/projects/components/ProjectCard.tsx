"use client"

import clsx from "clsx"
import Image from "next/image"
import type { Project } from "../types/projects.types"
import { Link } from "@/i18n/navigation"
import SkillBadges from "@/features/skills/components/SkillBadges"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import CommentGroup from "@/features/comments/components/CommentGroup"
import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import { useTranslations } from "next-intl"

export default function ProjectCard({ project, className }: { project: Project, className?: string}) {
  const t = useTranslations("components.projectCard")
  return (
    <div
      className={clsx(
        "relative flex flex-col border-primary rounded-2xl border",
        className
      )}
    >
      {/* Stretched Link for entire card */}
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 rounded-2xl z-0"
        aria-label={t("ariaLabel", {project: project.name})}
      />

      {/* Image */}
      <div className="relative flex aspect-4/3 w-full rounded-t-2xl overflow-hidden">
        {project.thumbnail ? (
          <Image
            className="object-cover"
            src={project.thumbnail}
            alt={project.name}
            fill
            sizes="450px"
          />
        ) : (
          <MiracleSkeleton className="h-full w-full rounded-none!" variant="med"/>
        )}
      </div>
      {/* Body */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-primary mb-1 text-lg font-semibold md:text-xl xl:text-2xl">
          {project.name}
        </h3>
        <p className="text-secondary mb-6 text-sm leading-relaxed">{project.description}</p>
        <SkillBadges skills={project.skills} className="mb-auto relative z-2" />
      </div>

      {/* Footer */}
      <div
        className="bg-secondary border-primary flex items-center justify-between rounded-b-2xl border-t px-5 py-3 md:px-6 relative z-1"
        onClick={(e) => e.stopPropagation()}
      >
        <ReactionGroup
          targetId={project.id}
          targetType="project"
          initialSummary={project.reaction_summary}
        />
        <CommentGroup
          targetId={project.id}
          targetType="project"
          initialCount={project.comment_count}
        />
      </div>
    </div>
  )
}
