// articles/page.tsx (Server Component)
import { getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/query-client"
import MiracleBreadcrumbs from "@/components/miracle/Breadcrumbs"
import { routing } from "@/i18n/routing"
import Heading from "@/components/Heading"
import type { Cursor } from "@/features/shared/types/index.types"
import { getAvailableCategories } from "@/features/categories/services/categories"
import type { CategoryTargetType } from "@/features/categories/types/categories.types"
import Container from "@/components/Container"
import Article from "@/components/Article"
import { ARTICLES_PAGE_SIZE } from "../constants/articles.constans"
import { getPaginatedArticles } from "../services/articles"
import ArticlesContent from "./ArticlesContent"
import type { BasePageProps } from "@/types/page.types"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { Suspense } from "react"
import ArticleCardSkeleton from "./ArticleCardSkeleton"

export const revalidate = 300 

export default async function ArticlesPage(props: BasePageProps) {
  const { locale } = await props.params
  const t = await getTranslations("pages.articles")
  const queryClient = getQueryClient()
  const targetType: CategoryTargetType = "article"

  const defaultFilters = {
    locale,
    search: undefined,
    categorySlugs: undefined,
    pageSize: ARTICLES_PAGE_SIZE,
  }

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ["articles", defaultFilters],
      queryFn: ({ pageParam }) =>
        getPaginatedArticles({
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
    if (query.queryKey[0] === "articles") {
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
              articles: t("breadcrumbs.articles"),
            }}
            className="mb-5 md:mb-6"
          />
          <header className="mb-8 w-full lg:mb-10 xl:mb-12">
            <Heading id={t("title")} level={1} className="flex items-center gap-2 font-semibold">
              {t("title")}
            </Heading>
            <p className="text-secondary mt-4">{t("description")}</p>
          </header>
        </MiracleReveal>

        {/* Articles Content */}
        <Suspense fallback={
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 mt-6 md:mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        }>
          <HydrationBoundary state={dehydratedState}>
            <ArticlesContent locale={locale} targetType={targetType} />
          </HydrationBoundary>
        </Suspense>
      </Article>
    </Container>
  )
}