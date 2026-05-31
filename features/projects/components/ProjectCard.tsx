"use client"

import { cn } from "@/utils/class-name"
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
      className={cn(
        "relative flex flex-col border border-primary rounded-2xl bg-card transition-all hover:shadow-md overflow-hidden",
        className
      )}
    >
      {/* STRETCHED LINK */}
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-10 rounded-2xl"
        aria-label={t("ariaLabel", { project: project.name })}
      />

      {/* Image Section */}
      <div className="relative flex aspect-4/3 w-full overflow-hidden">
        {project.thumbnail ? (
          <Image
            className="object-cover"
            src={project.thumbnail}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <MiracleSkeleton className="h-full w-full rounded-none!" variant="med" />
        )}
      </div>

      {/* Body Section */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-primary mb-1 text-lg font-semibold md:text-xl xl:text-2xl">
          {project.name}
        </h3>
        <p className="text-secondary mb-6 text-sm line-clamp-3">
          {project.description}
        </p>

        <SkillBadges skills={project.skills} className="relative z-20 mb-auto" />
      </div>

      {/* Footer Section */}
      <div
        className="bg-secondary border-t border-primary relative z-20 flex items-center justify-between px-5 py-3 md:px-6 pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation()
        }}
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