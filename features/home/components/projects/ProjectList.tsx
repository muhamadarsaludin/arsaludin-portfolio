"use client"

import ProjectCard from "@/features/projects/components/ProjectCard"
import ProjectCardSkeleton from "@/features/projects/components/ProjectCardSkeleton"
import { useProjects } from "@/features/projects/hooks/useProjects"
import EmptyStateCard from "@/features/shared/types/components/EmptyStateCard"
import ErrorStateCard from "@/features/shared/types/components/ErrorStateCard"

interface ProjectListProps {
  locale: string
  isFeatured?: boolean
}

export function ProjectList({ locale, isFeatured = false }: ProjectListProps) {
  const {
    data: projects,
    isLoading,
    isError,
  } = useProjects({
    locale,
    isFeatured,
  })

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
