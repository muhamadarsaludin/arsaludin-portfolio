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
import type { StaticPageProps } from "@/types/page.types"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { Suspense } from "react"
import ArticleCardSkeleton from "./ArticleCardSkeleton"
import { MiracleSkeleton } from "@/components/miracle/Skeleton"

export default async function ArticlesPage(props: StaticPageProps) {
  const { locale } = await props.params
  const t = await getTranslations("pages.articles")
  const queryClient = getQueryClient()
  const categoryTargetType: CategoryTargetType = "article"

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
      queryKey: ["available-categories", { locale, targetType: categoryTargetType }],
      queryFn: () => getAvailableCategories({ locale, targetType: categoryTargetType }),
    }),
  ])

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
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-6 md:gap-8">
                <div className="flex w-full items-center gap-3 md:w-8/12 md:gap-4">
                  <MiracleSkeleton className="h-9 flex-1" />
                  <MiracleSkeleton className="h-9 w-25 shrink-0" />
                </div>
                <div className="mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:mt-8 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ArticleCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            }
          >
            <ArticlesContent locale={locale} />
          </Suspense>
        </HydrationBoundary>
      </Article>
    </Container>
  )
}
