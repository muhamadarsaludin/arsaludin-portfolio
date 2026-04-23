"use client"

import ProjectCard from "@/features/projects/components/ProjectCard"
import ProjectCardSkeleton from "@/features/projects/components/ProjectCardSkeleton"
import { useFeaturedProjects } from "@/features/projects/hooks/useFeaturedProjects"
import EmptyStateCard from "@/features/shared/types/components/EmptyStateCard"
import ErrorStateCard from "@/features/shared/types/components/ErrorStateCard"

export function ProjectList({ locale }: { locale: string }) {
  const { 
    data: projects, 
    isLoading, 
    isError,
    refetch
   } = useFeaturedProjects({locale})

  if (isLoading) return <ProjectListSkeleton />
  if (isError) return <ErrorStateCard onRetry={refetch}/>
  if (!projects || projects.length === 0) return <EmptyStateCard />

  return (
    <div className="max-w-full overflow-x-auto sm:overflow-x-hidden flex gap-4 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} className="w-[75vw] sm:w-auto shrink-0 snap-start" />
      ))}
    </div>
  )
}

export function ProjectListSkeleton() {
  return (
    <div className="max-w-full overflow-x-auto sm:overflow-x-hidden flex gap-4 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <ProjectCardSkeleton key={i} className="w-[75vw] sm:w-auto shrink-0 snap-start" />
      ))}
    </div>
  )
}
