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
import { LuArrowRight } from "react-icons/lu"

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
      <Section className={clsx(className)}>
        <div className="relative mb-10 md:mb-12 flex w-fit">
          <Heading
            id="featured-projects"
            className="max-w-[10ch] text-3xl md:text-4xl lg:text-5xl"
            linkClassName="text-[0.4em]!"
            noMarginTop
            fontWeight="semibold"
          >
            {t("title")}
          </Heading>
          <IoSparkles className="text-yellow absolute -top-3 -right-4 text-4xl md:-top-10 md:-right-5 md:text-5xl lg:text-6xl" />
        </div>
        <ProjectList locale={locale} isFeatured={true} />
        <div className="mt-8 flex justify-center md:mt-10">
          <Link href="/projects" aria-label={t("cta")}>
            <MiracleButton 
              variant="secondary"
              endIcon={<LuArrowRight />}
              tabIndex={-1}>
                {t("cta")}
              </MiracleButton>
          </Link>
        </div>
      </Section>
    </HydrationBoundary>
  )
}
