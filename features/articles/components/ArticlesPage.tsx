import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import MiracleBreadcrumbs from '@/components/miracle/Breadcrumbs';
import { routing } from '@/i18n/routing';
import Heading from '@/components/Heading';
import { Cursor } from '@/features/shared/types/index.types';
import { getAvailableCategories } from '@/features/categories/services/categories';
import { CategoryTargetType } from '@/features/categories/types/categories.types';
import Container from '@/components/Container';
import Article from '@/components/Article';
import { normalizeArrayParam } from '@/utils/search-params';
import { ARTICLES_PAGE_SIZE } from '../constants/articles.constans';
import { getFeaturedArticles, getPaginatedArticles } from '../services/articles';
import ArticlesContent from './ArticlesContent';
import MiracleBadge from '@/components/miracle/Badge';
import { LuTriangleAlert } from 'react-icons/lu';
import MiracleBanner from '@/components/miracle/Banner';
import { BasePageProps } from '@/types/page.types';

export default async function ArticlesPage(props: BasePageProps) {
  const {locale} = await props.params
  const searchParams = await props.searchParams;

  const t = await getTranslations("pages.articles")
  const queryClient = new QueryClient()
  const targetType:CategoryTargetType = "article"

  const filters = {
    locale,
    search: typeof searchParams.search === 'string' && searchParams.search ? searchParams.search : undefined,
    categorySlugs: normalizeArrayParam(searchParams.categories),
    pageSize: ARTICLES_PAGE_SIZE
  };


  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["featured-articles", locale],
      queryFn: () => getFeaturedArticles({ locale }),
    }),

    queryClient.prefetchInfiniteQuery({
      queryKey: ["articles", filters],
      queryFn: ({ pageParam }) => 
        getPaginatedArticles({
          ...filters,
          cursor: pageParam as Cursor | undefined,
        }),
      initialPageParam: undefined as Cursor | undefined,
    }),

    queryClient.prefetchQuery({
      queryKey: ["available-categories", targetType],
      queryFn: () => getAvailableCategories({ targetType }),
    })
  ])

  const dehydratedState = dehydrate(queryClient);
  
  /**
   * HYDRATION FIX:
   * Manually "aging" server data by 20 minutes to prevent it from overwriting 
   * the client's multi-page infinite cache during navigation.
   * This ensures the existing client data stays "newer" than the server's page 1.
   * NOTE: This 20-min offset must be LESS than the staleTime (30 mins)
   * used in @see useInfiniteArticles to prevent instant re-fetching.
   */
  dehydratedState.queries.forEach((query) => {
    if (query.queryKey[0] === 'articles') {
      query.state.dataUpdatedAt = Date.now() - (1000 * 60 * 20);
    }
  });

  return (
    <Container>
      <Article className="pb-13 lg:pb-23 w-full">
        <MiracleBreadcrumbs 
          locales={routing.locales}
          overrides={{
            home: t("breadcrumbs.home"),
            articles: t("breadcrumbs.articles")
          }}
          className="mb-5 md:mb-6"
        />
        <header className="mb-8 lg:mb-10 xl:mb-12 w-full">
          <div className="flex gap-2 items-center">
            <Heading 
              id={t("title")}
              level={1}
              className="font-semibold flex gap-2 items-center">
                {t("title")}
            </Heading>
            <MiracleBadge color="yellow" startIcon={<LuTriangleAlert />} variant="secondary">
              Beta
            </MiracleBadge>
          </div>
          <p className="mt-4 text-secondary">{t("description")}</p>

          <MiracleBanner color="yellow" startIcon={<LuTriangleAlert />} variant="secondary" title={t("banner.title")} className="mt-4">
            {t("banner.description")}
          </MiracleBanner>
        </header>

        {/* Articles Content */}
        <HydrationBoundary state={dehydratedState}>
          <ArticlesContent locale={locale} targetType={targetType} />
        </HydrationBoundary>
      </Article>
    </Container>
  )
}
