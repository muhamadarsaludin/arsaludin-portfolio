import { getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/query-client"
import MiracleBreadcrumbs from "@/components/miracle/Breadcrumbs"
import { routing } from "@/i18n/routing"
import Heading from "@/components/Heading"
import type { Cursor } from "@/features/shared/types/index.types"
import { getAvailableCategories } from "@/features/categories/services/categories"
import type { CategoryTargetType } from "@/features/categories/types/categories.types"
import { PROJECTS_PAGE_SIZE } from "../constants/projects.constans"
import { getPaginatedProjects } from "../services/projects"
import ProjectsContent from "./ProjectsContent"
import Container from "@/components/Container"
import Article from "@/components/Article"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { Suspense } from "react"
import { StaticPageProps } from "@/types/page.types"
import ProjectCardSkeleton from "./ProjectCardSkeleton"
import { MiracleSkeleton } from "@/components/miracle/Skeleton"

export default async function ProjectsPage(props: StaticPageProps) {
  const { locale } = await props.params

  const t = await getTranslations("pages.projects")
  const queryClient = getQueryClient()
  const targetType: CategoryTargetType = "project"

  const defaultFilters = {
    locale,
    search: undefined,
    categorySlugs: undefined,
    pageSize: PROJECTS_PAGE_SIZE,
  }

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ["projects", defaultFilters],
      queryFn: ({ pageParam }) =>
        getPaginatedProjects({
          ...defaultFilters,
          cursor: pageParam as Cursor | undefined,
        }),
      initialPageParam: undefined as Cursor | undefined,
    }),

    queryClient.prefetchQuery({
      queryKey: ["available-categories", { locale, targetType }],
      queryFn: () => getAvailableCategories({ locale, targetType }),
    }),
  ])

  const dehydratedState = dehydrate(queryClient)

  /**
   * HYDRATION FIX:
   * Manually "aging" server data by 20 minutes to prevent it from overwriting
   * the client's multi-page infinite cache during navigation.
   */
  const TWENTY_MINUTES_IN_MS = 1000 * 60 * 20

  dehydratedState.queries.forEach((query) => {
    if (query.queryKey[0] === "projects") {
      query.state.dataUpdatedAt = query.state.dataUpdatedAt - TWENTY_MINUTES_IN_MS
    }
  })

  return (
    <Container>
      <Article className="w-full pb-13 lg:pb-23">
        <MiracleReveal animation="fade-right">
          <MiracleBreadcrumbs
            locales={routing.locales}
            overrides={{
              home: t("breadcrumbs.home"),
              projects: t("breadcrumbs.projects"),
            }}
            className="mb-5 md:mb-6"
          />
          <header className="mb-8 w-full lg:mb-10 xl:mb-12">
            <Heading id={t("title")} level={1} className="font-semibold">
              {t("title")}
            </Heading>
            <p className="text-secondary mt-4">{t("description")}</p>
          </header>
        </MiracleReveal>
        {/* Projects Content */}
        <HydrationBoundary state={dehydratedState}>
          <Suspense fallback={
            <div className="flex w-full flex-col gap-6 md:gap-8">
              <div className="flex w-full items-center gap-3 md:w-8/12 md:gap-4">
                <MiracleSkeleton className="h-9 flex-1" />
                <MiracleSkeleton className="h-9 w-25 shrink-0" />
              </div>
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            </div>
          }>
            <ProjectsContent locale={locale} targetType={targetType} />
          </Suspense>
        </HydrationBoundary>
      </Article>
    </Container>
  )
}