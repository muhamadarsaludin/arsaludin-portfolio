import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { ACHIEVEMENTS_PAGE_SIZE } from '../constants/achievements.constants';
import { getPaginatedAchievements } from '../services/achievements';
import MiracleBreadcrumbs from '@/components/miracle/Breadcrumbs';
import Section from '@/components/Section';
import { routing } from '@/i18n/routing';
import Heading from '@/components/Heading';
import AchievementsContent from './AchievementsContent';
import { Cursor } from '@/features/shared/types/index.types';
import { getAvailableCategories } from '@/features/categories/services/categories';
import { CategoryTargetType } from '@/features/categories/types/categories.types';
import Container from '@/components/Container';
import Article from '@/components/Article';
import { normalizeArrayParam } from '@/utils/search-params';
import { BasePageProps } from '@/types/page.types';

export default async function AchievementsPage(props: BasePageProps) {
  const t = await getTranslations("pages.achievements")
  const queryClient = new QueryClient()
  const targetType:CategoryTargetType = "achievement"
  const searchParams = await props.searchParams

  const filters = {
    search: typeof searchParams.search === 'string' && searchParams.search ? searchParams.search : undefined,
    types: normalizeArrayParam(searchParams.types),
    levels: normalizeArrayParam(searchParams.levels),
    categorySlugs: normalizeArrayParam(searchParams.categories),
    pageSize: ACHIEVEMENTS_PAGE_SIZE
  };


  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ["achievements", filters],
      queryFn: ({ pageParam }) => 
        getPaginatedAchievements({
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
   * used in @see useInfiniteAchievements to prevent instant re-fetching.
   */
  dehydratedState.queries.forEach((query) => {
    if (query.queryKey[0] === 'achievements') {
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
            achievements: t("breadcrumbs.achievements")
          }}
          className="mb-5 md:mb-6"
        />
        <div className="mb-10 md:mb-12 w-full">
          <Heading 
            id={t("title")}
            level={1}
            className="font-semibold">
              {t("title")}
          </Heading>
          <p className="mt-4 text-secondary">{t("description")}</p>
        </div>
        {/* Achievements Content */}
        <HydrationBoundary state={dehydratedState}>
          <AchievementsContent targetType={targetType} />
        </HydrationBoundary>
      </Article>
    </Container>
  )
}
