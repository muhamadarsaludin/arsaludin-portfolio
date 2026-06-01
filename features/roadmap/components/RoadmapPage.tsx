import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/query-client"
import { getTranslations } from "next-intl/server"
import { getPaginatedCardsByStatus } from "@/features/cards/services/cards"
import type { CardPriority, CardStatus, CardType } from "@/features/cards/types/cards.types"
import { CARDS_PAGE_SIZE } from "@/features/cards/constants/card.constants"
import { routing } from "@/i18n/routing"
import Container from "@/components/Container"
import Article from "@/components/Article"
import MiracleBreadcrumbs from "@/components/miracle/Breadcrumbs"
import Heading from "@/components/Heading"
import { normalizeArrayParam } from "@/utils/search-params"
import RoadmapContent from "./RoadmapContent"
import type { BasePageProps } from "@/types/page.types"
import { MiracleReveal } from "@/components/miracle/Reveal"
import type { Cursor } from "@/features/shared/types/index.types"

const KANBAN_STATUSES: CardStatus[] = ["ideas", "planned", "in-progress", "released"]

export default async function RoadmapPage(props: BasePageProps) {
  const searchParams = await props.searchParams
  const t = await getTranslations("pages.roadmap")
  const queryClient = getQueryClient()

  await Promise.all(
    KANBAN_STATUSES.map((status) => {
      const filters = {
        status,
        search:
          typeof searchParams.search === "string" && searchParams.search
            ? searchParams.search
            : undefined,
        types: normalizeArrayParam(searchParams.types) as CardType[],
        priorities: normalizeArrayParam(searchParams.priorities) as CardPriority[],
        pageSize: CARDS_PAGE_SIZE,
      }

      queryClient.prefetchInfiniteQuery({
        queryKey: ["cards", filters],
        queryFn: ({ pageParam }) =>
          getPaginatedCardsByStatus({
            ...filters,
            cursor: pageParam as Cursor | undefined,
          }),
        initialPageParam: undefined as Cursor | undefined,
      })
    })
  )

  const dehydratedState = dehydrate(queryClient)

  /**
   * HYDRATION FIX:
   * Manually "aging" server data by 20 minutes to prevent it from overwriting
   * the client's multi-page infinite cache during navigation.
   */
  const TWENTY_MINUTES_IN_MS = 1000 * 60 * 20

  dehydratedState.queries.forEach((query) => {
    if (query.queryKey[0] === "cards") {
      query.state.dataUpdatedAt = query.state.dataUpdatedAt - TWENTY_MINUTES_IN_MS
    }
  })

  return (
    <Container>
      <Article className="pb-13 lg:pb-23">
        <MiracleReveal animation="fade-right">
          <MiracleBreadcrumbs
            locales={routing.locales}
            overrides={{
              home: t("breadcrumbs.home"),
              roadmap: t("breadcrumbs.roadmap"),
            }}
            className="mb-5 md:mb-6"
          />

          <div className="mb-6 w-full md:mb-8">
            <Heading id={t("title")} level={1} className="font-semibold">
              {t("title")}
            </Heading>
            <p className="text-secondary mt-4">{t("description")}</p>
          </div>
        </MiracleReveal>
        {/* Roadmap Content */}
        <HydrationBoundary state={dehydratedState}>
          <RoadmapContent kanbanStatuses={KANBAN_STATUSES} />
        </HydrationBoundary>
      </Article>
    </Container>
  )
}
