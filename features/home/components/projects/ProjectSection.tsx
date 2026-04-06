import Heading from "@/components/Heading"
import Section from "@/components/Section"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { getProjects } from "@/features/projects/services/projects"
import { ProjectList } from "./ProjectList" // Komponen Client Reusable
import MiracleButton from "@/components/miracle/Button"
import Link from "next/link"

/**
 * Server Component: Prefetches featured projects for optimal SEO and performance.
 * Uses HydrationBoundary to pass data to the client-side TanStack Query cache.
 */
export default async function ProjectSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.projects")
  const locale = await getLocale()
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["projects", locale, { isFeatured: true, isAdminView: false }],
    queryFn: () => getProjects({ locale, isFeatured: true, isAdminView: false }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={className}>
        <Heading id="featured-projects">{t("title")}</Heading>
        <ProjectList locale={locale} isFeatured={true} />
        <div className="mt-8 flex justify-center">
          <Link href="/projects">
            <MiracleButton variant="secondary">{t("cta")}</MiracleButton>
          </Link>
        </div>
      </Section>
    </HydrationBoundary>
  )
}