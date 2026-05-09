"use client"

import { MiracleReveal } from "@/components/miracle/Reveal"
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
    <div className="max-w-full overflow-x-auto sm:overflow-x-hidden overflow-y-hidden flex gap-4 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
      {projects.map((project, index) => (
        <MiracleReveal 
          animation={{
            default: "zoom-in",
            sm: "fade-up"
          }} 
          delay={{
            default: 0,
            sm:(index % 6) * 0.1
          }}
          className="w-[75vw] sm:w-auto shrink-0 snap-start" 
          key={project.id}>
          <ProjectCard project={project} className="w-full h-full" />
        </MiracleReveal>
      ))}
    </div>
  )
}

export function ProjectListSkeleton() {
  return (
    <div className="max-w-full overflow-x-auto sm:overflow-x-hidden overflow-y-hidden flex gap-4 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <ProjectCardSkeleton key={i} className="w-[75vw] sm:w-auto shrink-0 snap-start" />
      ))}
    </div>
  )
}
