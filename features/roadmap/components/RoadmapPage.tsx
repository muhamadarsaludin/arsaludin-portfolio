import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/query-client"
import { getTranslations } from "next-intl/server"
import { getPaginatedCardsByStatus } from "@/features/cards/services/cards"
import type { CardStatus } from "@/features/cards/types/cards.types"
import { CARDS_PAGE_SIZE } from "@/features/cards/constants/card.constants"
import { routing } from "@/i18n/routing"
import Container from "@/components/Container"
import Article from "@/components/Article"
import MiracleBreadcrumbs from "@/components/miracle/Breadcrumbs"
import Heading from "@/components/Heading"
import RoadmapContent from "./RoadmapContent"
import { MiracleReveal } from "@/components/miracle/Reveal"
import type { Cursor } from "@/features/shared/types/index.types"
import { Suspense } from "react"
import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import CardItemSkeleton from "@/features/cards/components/CardItemSkeleton"

const KANBAN_STATUSES: CardStatus[] = ["ideas", "planned", "in-progress", "released"]

export default async function RoadmapPage() {
  const t = await getTranslations("pages.roadmap")
  const queryClient = getQueryClient()

  await Promise.all(
    KANBAN_STATUSES.map((status) => {
      const defaultFilters = {
        status,
        search: undefined,
        types: undefined,
        priorities: undefined,
        pageSize: CARDS_PAGE_SIZE,
      }

      queryClient.prefetchInfiniteQuery({
        queryKey: ["cards", defaultFilters],
        queryFn: ({ pageParam }) =>
          getPaginatedCardsByStatus({
            ...defaultFilters,
            cursor: pageParam as Cursor | undefined,
          }),
        initialPageParam: undefined as Cursor | undefined,
      })
    })
  )

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
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-6 md:gap-8">
                <div className="flex w-full items-center gap-3 md:w-8/12 md:gap-4">
                  <MiracleSkeleton className="h-9 flex-1" />
                  <MiracleSkeleton className="h-9 w-25 shrink-0" />
                </div>
                <div className="flex snap-x snap-mandatory flex-nowrap gap-4 overflow-x-auto pb-4 sm:gap-6 [&::-webkit-scrollbar]:hidden">
                  {KANBAN_STATUSES.map((_, i) => (
                    <div
                      className="w-[75vw] shrink-0 snap-start sm:min-w-[320px] sm:flex-1"
                      key={i}
                    >
                      <div className="bg-secondary flex h-full w-full flex-col gap-4 rounded-2xl p-4 md:p-5">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <CardItemSkeleton key={i} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <RoadmapContent kanbanStatuses={KANBAN_STATUSES} />
          </Suspense>
        </HydrationBoundary>
      </Article>
    </Container>
  )
}
