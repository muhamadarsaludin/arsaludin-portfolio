"use client"

import ProjectCard from "@/features/projects/components/ProjectCard"
import ProjectCardSkeleton from "@/features/projects/components/ProjectCardSkeleton"
import { useFeaturedProjects } from "@/features/projects/hooks/useFeaturedProjects"
import EmptyStateCard from "@/features/shared/types/components/EmptyStateCard"
import ErrorStateCard from "@/features/shared/types/components/ErrorStateCard"

export function ProjectList({ locale }: { locale: string }) {
  const { data: projects, isLoading, isError } = useFeaturedProjects({locale})

  if (isLoading) return <ProjectListSkeleton />
  if (isError) return <ErrorStateCard />
  if (!projects || projects.length === 0) return <EmptyStateCard />

  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

export function ProjectListSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  )
}
