import Heading from "@/components/Heading"
import Section from "@/components/Section"
import { useLocale, useTranslations } from "next-intl"
import { Suspense } from "react"
import ProjectCardSkeleton from "@/features/projects/components/ProjectCardSkeleton"
import { getProjects } from "@/features/projects/services/projects"
import ProjectCard from "@/features/projects/components/ProjectCard"
import MiracleButton from "@/components/miracle/Button"
import Link from "next/link"

export default function ProjectSection({ className }: { className?: string }) {
  const t = useTranslations("pages.home.projects")
  const locale = useLocale()
  return (
    <Section className={className}>
      <Heading id="featured-projects">{t("title")}</Heading>
      
      {/* Suspense handles the loading state (streaming) */}
      <Suspense fallback={<FeaturedProjectListSkeleton />}>
        <FeaturedProjectList locale={locale} />
      </Suspense>

      <div className="mt-8 flex justify-center">
        <Link href="/projects">
          <MiracleButton variant="secondary">{t("cta")}</MiracleButton>
        </Link>
      </div>
    </Section>
  )
}

/**
 * FeatureProjectList handles the data fetching and internal states (Empty & Error).
 * This is a Server Component.
 */
async function FeaturedProjectList({ locale }: { locale: string }) {
  try {
    const featuredProjects = await getProjects(locale, true, false)
    // Handle Empty State (No records in Database)
    if (!featuredProjects || featuredProjects.length === 0) {
      return (
        <div className="mt-8 flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-primary">
          <p className="text-sm text-secondary">No featured projects found for this language.</p>
        </div>
      )
    }
    // Success State
    return (
      <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
        {featuredProjects.map((project) => {
          return <ProjectCard key={project.id} project={project} />
        })}
      </div>
    )
    
  } catch (error) {
    // Error State (Network failure, Supabase error, etc.)
    console.error("Failed to fetch featured project:", error)
    return (
      <div className="mt-8 rounded-2xl p-8 text-center bg-red-100 dark:bg-red-950">
        <p className="text-sm font-medium text-red">
          Unable to load featured projects. Please try again later.
        </p>
      </div>
    )  
  }
}

/**
 * Skeleton Loader matches the grid layout of the actual list.
 */
function FeaturedProjectListSkeleton() {
  return (
    <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  )
}
