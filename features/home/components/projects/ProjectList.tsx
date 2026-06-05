"use client"

import { MiracleReveal } from "@/components/miracle/Reveal"
import ProjectCard from "@/features/projects/components/ProjectCard"
import ProjectCardSkeleton from "@/features/projects/components/ProjectCardSkeleton"
import { useFeaturedProjects } from "@/features/projects/hooks/useFeaturedProjects"
import { useBatchReactions } from "@/features/reactions/hooks/useBatchReactions"
import EmptyStateCard from "@/features/shared/components/EmptyStateCard"
import ErrorStateCard from "@/features/shared/components/ErrorStateCard"
import { useMemo } from "react"

export function ProjectList({ locale }: { locale: string }) {
  const { data: projects, isLoading, isError, refetch } = useFeaturedProjects({ locale })
  const projectIds = useMemo(() => projects?.map((p) => p.id) ?? [], [projects])

  const { data: dataReactions } = useBatchReactions({
    targetIds: projectIds,
    targetType: "project",
  })

  if (isLoading) return <ProjectListSkeleton />
  if (isError) return <ErrorStateCard onRetry={refetch} />
  if (!projects || projects.length === 0) return <EmptyStateCard />

  return (
    <div className="flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-x-hidden lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {projects.map((project, index) => {
        const dataReaction = dataReactions?.[project.id]
        const reactionSummary = dataReaction?.summary || null
        const userReaction = dataReaction?.userReaction || null

        return (
          <MiracleReveal
            animation={{
              default: "zoom-in",
              sm: "fade-up",
            }}
            delay={{
              default: 0,
              sm: (index % 6) * 0.1,
            }}
            threshold={0}
            className="w-[75vw] shrink-0 snap-start sm:w-auto"
            key={project.id}
          >
            <ProjectCard
              className="h-full w-full"
              project={project}
              reactionSummary={reactionSummary}
              userReaction={userReaction}
              projectIds={projectIds}
            />
          </MiracleReveal>
        )
      })}
    </div>
  )
}

export function ProjectListSkeleton() {
  return (
    <div className="flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-x-hidden lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <ProjectCardSkeleton key={i} className="w-[75vw] shrink-0 snap-start sm:w-auto" />
      ))}
    </div>
  )
}
