import Heading from '@/components/Heading'
import Section from '@/components/Section'
import { useLocale, useTranslations } from 'next-intl'
import React, { Suspense } from 'react'
import ProjectCardSkeleton from '@/features/projects/components/ProjectCardSkeleton'
import { getProjects } from '@/features/projects/services/projects'
import ProjectCard from '@/features/projects/components/ProjectCard'
import MiracleButton from '@/components/miracle/Button'
import Link from 'next/link'

async function FeaturedProjectList({ locale }: { locale: string }) {
  const dbFeaturedProjects = await getProjects(locale, true, 3)
  return (
    <div className="mt-8 flex snap-x snap-mandatory gap-4 pb-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {dbFeaturedProjects.map((dbProject) => {
        return <ProjectCard key={dbProject.id} project={dbProject} />
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
      <div className="flex justify-center mt-8">
        <Link href="/projects">
          <MiracleButton variant="secondary">
            {t("cta")}
          </MiracleButton>
        </Link>
      </div>
    </Section>
  )
}
