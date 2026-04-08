"use client"

import ProjectCard from "@/features/projects/components/ProjectCard"
import ProjectCardSkeleton from "@/features/projects/components/ProjectCardSkeleton"
import { useProjects } from "@/features/projects/hooks/useProjects"

interface ProjectListProps {
  locale: string
  isFeatured?: boolean
}

export function ProjectList({ locale, isFeatured = false }: ProjectListProps) {
  const { data: projects, isLoading, isError } = useProjects({ 
    locale, 
    isFeatured 
  })

  if (isLoading) return <ProjectListSkeleton />

  if (isError) return (
    <div className="rounded-2xl bg-red-100 p-8 text-center dark:bg-red-950">
      <p className="text-red-600 text-sm font-medium">Failed to load projects.</p>
    </div>
  )

  if (!projects?.length) return (
    <div className="border-primary flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed text-secondary text-sm">
      No projects found.
    </div>
  )

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