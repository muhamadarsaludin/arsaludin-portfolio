import Heading from '@/components/Heading'
import Section from '@/components/Section'
import { useLocale, useTranslations } from 'next-intl'
import React, { Suspense } from 'react'
import ProjectCardSkeleton from '@/features/projects/components/ProjectCardSkeleton'
import { getFeaturedProjects } from '@/features/projects/services/projects'
import ProjectCard, { ProjectCardProps } from '@/features/projects/components/ProjectCard'

async function FeaturedProjectList({ locale }: { locale: string }) {
  const dbFeaturedProjects = await getFeaturedProjects(locale)
  return (
    <div className="mt-8 flex snap-x snap-mandatory gap-4 pb-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {dbFeaturedProjects.map((dbProject) => {
        const project: ProjectCardProps = {
          name: dbProject.name,
          slug: dbProject.slug,
          thumbnail: dbProject.thumbnail,
          github_url: dbProject.github_url,
          url: dbProject.url,
          description: dbProject.description,
          content: dbProject.content,
          additional_info: dbProject.additional_info,
          additional_info_label: dbProject.additional_info_label,
          skills: dbProject.skills
        }
        return <ProjectCard key={dbProject.id} project={project} />
      })}
    </div>
  )
}

function FeaturedProjectListSkeleton() {
  return (
    <div className="mt-8 flex snap-x snap-mandatory gap-4 pb-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {[...Array(3)].map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  )
}


export default function ProjectSection({className} : {className?: string}) {
  const t = useTranslations("pages.home.projects")
  const locale = useLocale()
  return (
    <Section className={className}>
      <Heading id="featured-projects">
        {t("title")}
      </Heading>
      <Suspense fallback={<FeaturedProjectListSkeleton />}>
        <FeaturedProjectList locale={locale} />
      </Suspense>
    </Section>
  )
}
