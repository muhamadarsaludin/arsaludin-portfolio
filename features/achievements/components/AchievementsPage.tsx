import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { ACHIEVEMENTS_PAGE_SIZE } from '../constants/achievements.types';
import { getPaginatedAchievements } from '../services/achievements';
import MiracleBreadcrumbs from '@/components/miracle/Breadcrumbs';
import Section from '@/components/Section';
import { routing } from '@/i18n/routing';
import Heading from '@/components/Heading';
import AchievementsContent from './AchievementsContent';
import { Cursor } from '@/features/shared/types/index.types';
import { getAvailableCategories } from '@/features/categories/services/categories';
import { CategoryTargetType } from '@/features/categories/types/categories.types';

type AchievementsPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function AchievementsPage({searchParams}: AchievementsPageProps) {
  const t = await getTranslations("pages.achievements")
  const queryClient = new QueryClient(
    { defaultOptions: { queries: { 
      staleTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    } } }
  )
  const targetType:CategoryTargetType = "achievement"

  const parseArrayParam = (param: string | string[] | undefined) => {
    if (!param) return undefined;
    const arr = Array.isArray(param) ? param : param.split(",");
    const filtered = arr.filter(Boolean);
    return filtered.length > 0 ? filtered : undefined;
  };

  const filters = {
    search: typeof searchParams.search === 'string' && searchParams.search ? searchParams.search : undefined,
    types: parseArrayParam(searchParams.types),
    categoryIds: parseArrayParam(searchParams.categories),
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
  
  // Workaround: Prevent Infinite Queries from resetting to page 1 on client navigation.
  // HydrationBoundary runs before the client component mounts, meaning the query is inactive.
  // TanStack Query overwrites inactive queries if the server's `dataUpdatedAt` is newer.
  // By aging the server's query by 29 mins, the client's multi-page cache stays "newer" and avoids being wiped,
  // while remaining under the 30-min staleTime so it doesn't instantly refetch on initial load.
  const now = Date.now();
  dehydratedState.queries.forEach((query) => {
    if (query.queryKey[0] === 'achievements') {
      query.state.dataUpdatedAt = now - 1000 * 60 * 29;
    }
  });

  return (
    <Section className="pb-13 lg:pb-23">
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
        <p className='mt-4'>{t("description")}</p>
      </div>
      {/* Achievements Content */}
      <HydrationBoundary state={dehydratedState}>
        <AchievementsContent targetType={targetType} />
      </HydrationBoundary>
    </Section>
  )
}
