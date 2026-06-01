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

const KANBAN_STATUSES: CardStatus[] = ["ideas", "planned", "in-progress", "released"]

export default async function RoadmapPage(props: BasePageProps) {
  const { locale } = await props.params
  const searchParams = await props.searchParams
  const t = await getTranslations("pages.roadmap")
  const queryClient = getQueryClient()

  const filters = {
    search: typeof searchParams.search === "string" && searchParams.search ? searchParams.search : undefined,
    types: normalizeArrayParam(searchParams.types) as CardType[],
    priorities: normalizeArrayParam(searchParams.priorities) as CardPriority[],
    pageSize: CARDS_PAGE_SIZE
  }

  await Promise.all(
    KANBAN_STATUSES.map((status) =>
      queryClient.prefetchInfiniteQuery({
        queryKey: ["cards", { status, ...filters }],
        queryFn: () => getPaginatedCardsByStatus({ status, ...filters }),
        initialPageParam: undefined,
      })
    )
  )

  const dehydratedState = dehydrate(queryClient)

  dehydratedState.queries.forEach((query) => {
    if (query.queryKey[0] === "cards") {
      query.state.dataUpdatedAt = Date.now() - (1000 * 60 * 20)
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
              roadmap: t("breadcrumbs.roadmap")
            }}
            className="mb-5 md:mb-6"
          />
          
          <div className="mb-6 md:mb-8 w-full">
            <Heading 
              id={t("title")}
              level={1}
              className="font-semibold"
            >
              {t("title")}
            </Heading>
            <p className="mt-4 text-secondary">{t("description")}</p>
          </div>
        </MiracleReveal>

        <HydrationBoundary state={dehydratedState}>
          <RoadmapContent kanbanStatuses={KANBAN_STATUSES} />
        </HydrationBoundary>
      </Article>
    </Container>
  )
}