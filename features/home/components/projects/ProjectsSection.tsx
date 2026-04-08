import Heading from "@/components/Heading"
import Section from "@/components/Section"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { getProjects } from "@/features/projects/services/projects"
import { ProjectList } from "./ProjectList" // Komponen Client Reusable
import MiracleButton from "@/components/miracle/Button"
import Link from "next/link"
import { IoSparkles } from "react-icons/io5"
import clsx from "clsx"

/**
 * Server Component: Prefetches featured projects for optimal SEO and performance.
 * Uses HydrationBoundary to pass data to the client-side TanStack Query cache.
 */
export default async function ProjectsSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.projects")
  const locale = await getLocale()
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["projects", locale, { isFeatured: true, isAdminView: false }],
    queryFn: () => getProjects({ locale, isFeatured: true, isAdminView: false }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={clsx(
        className
      )}>
        <div className="w-fit flex relative mb-8 md:mb-10">
          <Heading 
            id="featured-projects"
            className="max-w-[10ch] text-3xl md:text-4xl lg:text-5xl"
            linkClassName="text-[0.4em]!"
            noMarginTop
            fontWeight="semibold">
            {t("title")}
          </Heading>
          <IoSparkles className="absolute -right-4 -top-3 md:-right-5 md:-top-10 text-4xl md:text-5xl lg:text-6xl text-yellow"/> 
        </div>
        <ProjectList locale={locale} isFeatured={true} />
        <div className="flex justify-center mt-6 md:mt-8">
          <Link href="/projects">
            <MiracleButton variant="secondary">{t("cta")}</MiracleButton>
          </Link>
        </div>
      </Section>
    </HydrationBoundary>
  )
}